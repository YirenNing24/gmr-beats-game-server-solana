//** MEMGRAPH DRIVER AND TYPES
import { Driver } from "neo4j-driver";

//** ERROR CODES
import ValidationError from '../../outputs/validation.error'

//** SERVICE IMPORTS
import TokenService from "../../user.services/token.services/token.service";
import SoulService from "../soul.services/soul.service";


//** TYPE INTERFACE IMPORT
import { CollectionMission, CompletedMission, DailyMission, GetDailyMission, GetPersonalMission, PersonalMission, Reward, UserMissions } from "./reward.interface";
import WalletService from "../../user.services/wallet.services/wallet.service";
import { SuccessMessage } from "../../outputs/success.message";


//** MONGODB IMPORT
import { MongoClient } from "mongodb";
import { mongoDBClient } from "../../db/mongodb.client";
import { ClassicScoreStats } from "../leaderboard.services/leaderboard.interface";



class RewardService {

    driver?: Driver;
    constructor(driver?: Driver) {
        this.driver = driver;
    }


	public async getPersonalMissions(token: string): Promise<GetPersonalMission[]> {
		const tokenService = new TokenService();
		const client: MongoClient = await mongoDBClient.connect();
	
		try {
			// Verify the access token
			const username: string = await tokenService.verifyAccessToken(token);
			const collection = client.db("beats").collection("personalMissions");
			
			// Fetch all personal missions from the database
			const personalMissions = await collection
				.find({ missionType: "personal" })
				.toArray() as unknown as PersonalMission[];
	
			// Fetch the user's completed missions
			const userMissions = await this.getUserMissions(username);
	
			// Enrich missions with eligibility and claim status
			const enrichedMissions: GetPersonalMission[] = await Promise.all(
				personalMissions.map(async (mission) => {
					const completedMission = userMissions?.completedMissions.find(
						(completed) => completed.missionName === mission.name
					);
			
					if (completedMission && completedMission.rewardClaimed) {
						// If the mission is already completed and claimed
						return {
							...mission,
							elligible: false, // Already claimed, so not eligible
							claimed: true    // Reward already claimed
						};
					} else {
						// If not claimed, check for eligibility
						const eligible: boolean = await this.checkPersonalMissionEligibility(username, mission);
						return {
							...mission,
							elligible: eligible,
							claimed: false   // Not yet claimed
						};
					}
				})
			);
			
			await client.close();

			return enrichedMissions;
		} catch (error: any) {
			console.error("Error fetching personal missions:", error);
			throw error;
		} finally {
			await client.close(); // Ensure the database connection is closed in case of an error
		}
	}
	

	public async getDailyMisions(token: string): Promise<GetDailyMission[]> {
		const tokenService = new TokenService();
		const client: MongoClient = await mongoDBClient.connect();
		try {
			// Verify the access token
			const username: string = await tokenService.verifyAccessToken(token);
			const collection = client.db("beats").collection("dailyMissions");
	
			// Fetch all daily missions from the database
			const dailyMissions = await collection
				.find({ missionType: "daily" })
				.toArray() as unknown as DailyMission[];
	
			// Fetch the user's completed missions
			const userMissions = await this.getUserMissions(username);
	
			// Enrich missions with eligibility and claim status
			const enrichedMissions: GetDailyMission[] = await Promise.all(
				dailyMissions.map(async (mission) => {
					const completedMission = userMissions?.completedMissions.find(
						(completed) => completed.missionName === mission.name
					);
	
					if (completedMission && completedMission.rewardClaimed) {
						// If the mission is already completed and claimed
						return {
							...mission,
							elligible: false, // Already claimed, so not eligible
							claimed: true    // Reward already claimed
						};
					} else {
						// If not claimed, check for eligibility
						const eligible: boolean = await this.checkDailyMissionEligibility(username, mission);
						return {
							...mission,
							elligible: eligible,
							claimed: false   // Not yet claimed
						};
					}
				})
			);
	
			return enrichedMissions;


		} catch(error: any) {
	      console.log(error);
		  throw error
		}
	}


	public async getCollectionMissions(token: string): Promise<CollectionMission[]> {
		const tokenService = new TokenService();
		try {
			await tokenService.verifyAccessToken(token);
			const client: MongoClient = await mongoDBClient.connect();
			const collection = client.db("beats").collection("collectionMissions");
	
			const collectionMissions: CollectionMission[] = await collection.find({ missionType: "collection" }).toArray() as unknown as CollectionMission[];
			await client.close();

			return collectionMissions;
		} catch (error: any) {
			console.error("Error fetching collection missions:", error);
			throw error;
		}
	}










	public async claimPersonalMissionReward(token: string, missionName: {name: string}): Promise<SuccessMessage> {
		const tokenService = new TokenService();
		const soulService = new SoulService(this.driver);

		try {
			const { name } = missionName
			const username: string = await tokenService.verifyAccessToken(token);
			const client: MongoClient = await mongoDBClient.connect();
			const collection = client.db("beats").collection("personalMissions");


			const missionData = await collection.findOne({ name }) as unknown as PersonalMission;
			if (!missionData) {
				throw new ValidationError("Mission not found", "Mission not found");
			}
			// Validate the mission type
			if (missionData.missionType !== "personal") {
				throw new ValidationError("Invalid mission type", "Invalid mission type");
			}
	
			// Check eligibility
			const eligibility: boolean = await this.checkPersonalMissionEligibility(username, missionData);
			if (!eligibility) {
				throw new ValidationError("User is not eligible for the reward", "User is not eligible for the reward");
			}
	
			// Check if the mission has already been claimed
			const userMissions = await this.getUserMissions(username);
	
			if (userMissions !== null) {
				// User has missions recorded; check for duplicates
				const completedMission = userMissions.completedMissions.find(
					(mission) => mission.missionName ===  name 
				);
	
				if (completedMission && completedMission.rewardClaimed) {
					throw new ValidationError("Reward for this mission has already been claimed", "Reward already claimed");
				}
			}
	
			// Award the reward
			await this.giveReward(username, missionData.requirement.criteria.reward, "BEATS");
	
			// Update the user's mission data
			await this.updateUserMission(username, name);
	
			// Update Soul Metadata
			// soulService.updateSoulMetaData(username, name, "personal");
	
			// Close the database connection
			await client.close();
	
			return new SuccessMessage("Personal mission reward claimed successfully");
		} catch (error: any) {
			console.error("Error claiming personal mission reward:", error);
			throw error;
		}
	}


	public async claimDailyMissionReward(token: string, missionName: {name: string}): Promise<SuccessMessage> {
		const tokenService = new TokenService();
		try {
			const { name } = missionName
			const username: string = await tokenService.verifyAccessToken(token);
			const client: MongoClient = await mongoDBClient.connect();
			const collection = client.db("beats").collection("dailyMissions");
	
			const missionData = await collection.findOne({ name }) as unknown as DailyMission;
			if (!missionData) {
				throw new ValidationError("Mission not found", "Mission not found");
			}
	
			// Validate the mission type
			if (missionData.missionType !== "daily") {
				throw new ValidationError("Invalid mission type", "Invalid mission type");
			}
	
			// Check eligibility
			const eligibility: boolean = await this.checkDailyMissionEligibility(username, missionData);
			if (!eligibility) {
				throw new ValidationError("User is not eligible for the reward", "User is not eligible for the reward");
			}
	
			// Check if the mission has already been claimed
			const userMissions = await this.getUserMissions(username);
	
			if (userMissions !== null) {
				// User has missions recorded; check for duplicates
				const completedMission = userMissions.completedMissions.find(
					(mission) => mission.missionName === name
				);
	
				if (completedMission && completedMission.rewardClaimed) {
					throw new ValidationError("Reward for this mission has already been claimed", "Reward already claimed");
				}
			}
	
			// Award the reward
			await this.giveReward(username, missionData.requirement.criteria.reward, "BEATS");
	
			// Update the user's mission data
			await this.updateUserMission(username, name);
	
			// Update Soul Metadata
			// soulService.updateSoulMetaData(username, name, "daily");
	
			// Close the database connection
			await client.close();
	
			return new SuccessMessage("Daily mission reward claimed successfully");
		} catch (error: any) {
			console.error("Error claiming daily mission reward:", error);
			throw error;
		}
	}
	
	

	private async updateUserMission(username: string, missionName: string): Promise<void> {
		const client: MongoClient = await mongoDBClient.connect();
		try {
			const userMissionsCollection = client.db("beats").collection("missionsCompleted");
	
			// Fetch or initialize the user's mission record
			const userMissions = await userMissionsCollection.findOne({ username }) ?? {
				username,
				completedMissions: [],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			} as unknown as UserMissions;
	
			// Add the completed mission to the user's record
			const completedMission: CompletedMission = {
				missionName,
				completedAt: new Date().toISOString(),
				rewardClaimed: true
			};
	
			userMissions.completedMissions.push(completedMission);
			userMissions.updatedAt = new Date().toISOString();
	
			// Save the updated user missions back to the database
			await userMissionsCollection.updateOne(
				{ username },
				{ $set: userMissions },
				{ upsert: true }
			);
		} catch (error: any) {
			console.error("Error updating user mission:", error);
			throw error;
		} finally {
			await client.close(); // Ensure the database connection is closed
		}
	}


	private async getUserMissions(username: string): Promise<UserMissions | null> {
		const client: MongoClient = await mongoDBClient.connect();
		try {
			const userMissionsCollection = client.db("beats").collection("missionsCompleted");
	
			// Fetch the user's mission record
			const userMissions = await userMissionsCollection.findOne({ username }) as UserMissions | null;
	
			return userMissions;
		} catch (error: any) {
			console.error("Error fetching user missions:", error);
			throw error;
		} finally {
			await client.close(); // Ensure the database connection is closed
		}
	}
	
	
	private async checkPersonalMissionEligibility(username: string, missionData: PersonalMission): Promise<boolean> {
		try {
			let verified = false;
	
			// Destructure for easier access
			const { type, value: requirementValue } = missionData.requirement.criteria;
	
			if (type === "uniqueSongs") {
				
				verified = await this.checkCompletedSongs(username, requirementValue);
			}
			return verified;
		} catch (error: any) {
			console.error("Error checking personal mission eligibility:", error);
			throw error;
		}
	}



	private async checkDailyMissionEligibility(username: string, missionData: DailyMission): Promise<boolean> {
		try {
			// Destructure for easier access
			const { type } = missionData.requirement.criteria;
	
			// If the mission type is "login", check daily login status
			if (type === "login") {
				const hasClaimed = await this.checkDailyLogin(username);
	
				// If the user has already claimed, they are NOT eligible
				return !hasClaimed;
			}
	
			return false;
		} catch (error: any) {
			console.error("Error checking personal mission eligibility:", error);
			throw error;
		}
	}
	



	private async checkCompletedSongs(username: string, value: number): Promise<boolean> {
		try {
			const client: MongoClient = await mongoDBClient.connect();
			const collection = client.db("beats").collection("classicScores");
	
			// Query to find completed scores for the given username
			const scores = await collection
				.find<ClassicScoreStats>({ username, finished: true })
				.project({ songName: 1 })
				.toArray();
	
			// Use a Set to filter out duplicate song names
			const uniqueSongs = new Set(scores.map(score => score.songName));
	
			// Check if the number of unique songs meets the requirement
			return uniqueSongs.size >= value;
		} catch (error: any) {
			console.error("Error in checkCompletedSongs: ", error);
			throw error;
		}
	}



	private async checkDailyLogin(username: string): Promise<boolean> {
		try {
			const client: MongoClient = await mongoDBClient.connect();
			const collection = client.db("beats").collection("dailyLogins");
	
			// Get the current time in UTC
			const nowUTC = new Date();
	
			// Convert to Korean Standard Time (UTC+9)
			const nowKST = new Date(nowUTC.getTime() + 9 * 60 * 60 * 1000);
	
			// Get 24 hours ago in KST
			const past24HoursKST = new Date(nowKST.getTime() - 24 * 60 * 60 * 1000);
	
			// Check if a login claim exists within the last 24 hours (KST)
			const recentClaim = await collection.findOne({
				username,
				claimed_at: { $gte: past24HoursKST }, // Ensures claimed reward is within 24 hours
			});
	
			// Return true if claimed, otherwise false
			return recentClaim !== null;
		} catch (error: any) {
			console.error("Error in checkDailyLogin: ", error);
			throw error;
		}
	}
		
	

	
	private async giveReward(username: string, rewardData: Reward, rewardType: string): Promise<void> {
		const walletService = new WalletService(this.driver);
		const smartWalletAddress: string = await walletService.getSmartWalletAddress(username);
		try {
			if (rewardType === "BEATS") {
				await this.sendSolReward(smartWalletAddress, rewardData.amount.toString());
			}
		
		} catch (error: any) {
			console.error("Error in giveReward: ", error);
			throw error;
		}

	}


	public async sendSolReward(smartWalletAddress: string, solAmount: string): Promise<void> {
			try {
				// Proceed with transfer after successful allowance transaction
				const params: SendSolanaParams = {
					from: "Ca6iXuBexw6t87mZMpCGGCwRJZk2Go9rZk4BV6u7EW5r",
					to: smartWalletAddress,
					amount: Number(solAmount)
				}

				await sendSolanaToken(params);
			} catch (error: any) {
				console.log(error)
				throw error
		}
	}
}

export default RewardService;


export interface SendSolanaParams {
	from: string,
	to: string
	amount: number
	
}


const sendSolanaToken = async (params: SendSolanaParams) => {
	// Convert SOL → lamports and make sure it's an integer
	const amountLamports = BigInt(Math.floor(params.amount * 1_000_000_000));

	console.log("amount lamports: ", amountLamports)

	// Convert lamports (amount) to 8-byte little-endian buffer
	const lamportsBuffer = Buffer.alloc(8);
	lamportsBuffer.writeBigUInt64LE(amountLamports);

	// Instruction discriminator for "Transfer" (2) as u32 little-endian
	const discriminator = Buffer.alloc(4);
	discriminator.writeUInt32LE(2);

	const data = Buffer.concat([discriminator, lamportsBuffer]).toString("base64");

	const body = {
		executionOptions: {
			chainId: "solana:devnet",
			signerAddress: params.from,
			commitment: "confirmed"
		},
		instructions: [
			{
				programId: "11111111111111111111111111111111",
				accounts: [
					{ pubkey: params.from, isSigner: true, isWritable: true },
					{ pubkey: params.to, isSigner: false, isWritable: true }
				],
				data,
				encoding: "base64"
			}
		]
	};

	const headers = {
		"Content-Type": "application/json",
		"x-client-id": process.env.X_CLIENT_ID || "",
		"x-vault-access-token": process.env.VAULT_ACCESS_TOKEN || ""
	};

	const res = await fetch("https://engine.thirdweb.com/v1/solana/transaction", {
		method: "POST",
		headers,
		body: JSON.stringify(body)
	});

	const dataRes = await res.json();
	if (!res.ok) throw new Error(dataRes.error || "Transaction failed");
	return dataRes;
};