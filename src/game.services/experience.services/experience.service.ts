//** MEMGRAPH DRIVER AND TYPES
import { Driver, ManagedTransaction, QueryResult, Session } from "neo4j-driver";

//** ERROR CODES
import ValidationError from '../../outputs/validation.error'

//** TYPE INTERFACES
import { UserData } from "../../user.services/user.service.interface";
import { PlayerStats,  LevelUpResult } from "./experience.interface";


class ExperienceService {

driver?: Driver;

constructor(driver?: Driver) {
    this.driver = driver;
}
    //Calculates the experience gain for a user based on their accuracy and experience needed for the next level.
    public async calculateExperienceGain(username: string = "nashar4", accuracy: number): Promise<LevelUpResult> {
        try {
            // Retrieve user details
            const user: UserData = await this.getUserDetails(username);
            const { playerStats } = user.properties;
    
            // Calculate experience gain
            const experienceRequired: number = await this.getRequiredPlayerExperience(playerStats.level);
            const baseExperienceGain: number = Math.floor(10 * Math.pow(playerStats.level, 1.8));
            let adjustedExperienceGain: number = baseExperienceGain * (accuracy * 100);
            const minExperienceGain: number = Math.floor(experienceRequired * 0.05);
            const maxExperienceGain: number = Math.floor(experienceRequired * 0.2);
            adjustedExperienceGain = Math.max(minExperienceGain, Math.min(maxExperienceGain, adjustedExperienceGain));
    
            const experienceGained: number = Math.floor(adjustedExperienceGain);
    
            // Generate the experience and return the result
            const result: LevelUpResult = await this.generateExperience(experienceGained, playerStats);
            await this.saveUserDetails(username, result.stats);
            return result;
    
        } catch (error: any) {
            console.error("Error calculating experience gain:", error);
            throw error;
        }
    }
    
    private async getRequiredPlayerExperience(level: number): Promise<number> {
        // Unified formula for required experience
        return Math.round(Math.pow(level, 1.8) + level * 4);
    }
    
    // Generates experience for a user, updating their level and experience points accordingly
    private async generateExperience(experienceGained: number, stats: PlayerStats): Promise<LevelUpResult> {
        try {
            const { level, playerExp } = stats;
            let currentLevel: number = level;
            let currentExperience: number = playerExp + experienceGained;
    
            // Loop until all experience is consumed or no level-up can occur
            while (true) {
                // Use the unified formula for required experience
                const requiredExperience: number = await this.getRequiredPlayerExperience(currentLevel);
    
                // Check if the user can level up
                if (currentExperience < requiredExperience) break;
    
                // Subtract required experience for the current level and increment level
                currentExperience -= requiredExperience;
                currentLevel++;
    
                console.log(`Current Level: ${currentLevel}, Required Experience: ${requiredExperience}, Current Experience: ${currentExperience}`);
            }
    
            // Update player statistics
            stats.level = currentLevel;
            stats.playerExp = currentExperience;
    
            // Return the updated level and experience
            return {
                currentLevel,
                currentExperience,
                experienceGained,
                stats,
            };
        } catch (error: any) {
            console.error("Error generating experience:", error);
            throw error;
        }
    }
    
    
    
    //Retrieves details of a user  based on the provided username.
    private async getUserDetails(username: string): Promise<UserData> {
        const session: Session | undefined = this.driver?.session();
        try {
            // Find the user node within a Read Transaction
            const result: QueryResult | undefined = await session?.executeRead((tx: ManagedTransaction) =>
                tx.run('MATCH (u:User {username: $username}) RETURN u', { username })
            );

            if (!result || result.records.length === 0) {
                throw new ValidationError(`User with username '${username}' not found.`, "");
            }

            return result.records[0].get('u');
        } catch(error: any) {
          console.log(error)
          throw error

        }
    }

    //Saves the details of a user, including player statistics, in the database.
    private async saveUserDetails(username: string, playerStats: PlayerStats): Promise<void> {
        const session: Session | undefined = this.driver?.session();
    
        try {
            if (!session) {
                throw new Error("Database session could not be created.");
            }
    
            // Execute a write transaction to update the user's playerStats as a whole object
            await session.executeWrite((tx: ManagedTransaction) =>
                tx.run(
                    `
                    MATCH (u:User {username: $username}) 
                    SET u.playerStats = $playerStats
                    RETURN u
                    `,
                    { username, playerStats }
                )
            );
        } catch (error: any) {
            console.error("Error saving user details:", error);
            throw error;
        } finally {
            // Ensure the session is closed
            await session?.close();
        }
    }
    
    
}
    

export default ExperienceService