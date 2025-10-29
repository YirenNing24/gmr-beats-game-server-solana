//** IMPORTED TYPES
import { Driver } from "neo4j-driver";
import { ClassicScoreStats, ScorePeerId } from "../leaderboard.services/leaderboard.interface";

//** MONGODB IMPORT
import { mongoDBClient } from "../../db/mongodb.client";
import { MongoClient, ObjectId } from "mongodb";

//** IMPORTED SERVICES
import TokenService from "../../user.services/token.services/token.service";
import ExperienceService from "../experience.services/experience.service";
import SongRewardService from "../rewards.services/song.rewards.service";

//** INTERFACE IMPORT
import { LevelUpResult } from "../experience.services/experience.interface";
import EnergyService from "../energy.services/energy.service";
import keydb from "../../db/keydb.client";
import { nanoid } from "nanoid";



class ScoreService {

    driver?: Driver;
    constructor(driver?: Driver) {
        this.driver = driver;
    }   

    //** BEATS SERVER EXCLUSIVE SERVICE */
	public async saveScoreClassic(score: ClassicScoreStats, token: string): Promise<LevelUpResult> {
		const tokenService = new TokenService();
		const songRewardService = new SongRewardService();
		let username: string | null = null;
		let beatsReward: number | null = null;

		console.log("Mongol: ", score)
	
		try {
			username = await tokenService.verifyAccessToken(token);
	
			// ✅ Validate game session BEFORE connecting to MongoDB
			// const keydbData = await keydb.HGETALL(`energy_usage:${score.gameId}`);
			// if (!keydbData || keydbData.username !== username) {
			// 	throw new Error(`Invalid or expired game session for user: ${username}`);
			// }
	
			// ✅ Run heavy calculations **before** opening MongoDB
			const [experienceGain, previousHighscore] = await Promise.all([
				this.calculateExperience(username, score.accuracy),
				this.getHighScoreIndividual(score.songName, username),
			]);
	
			// 🚨 Allow songReward to fail without affecting score saving
			try {
				beatsReward = await songRewardService.classicSongReward(score);
			} catch (rewardError) {
				console.error(`Error calculating song reward for user: ${username}`, rewardError);
			}
	
			// ✅ Prepare score data **before** opening MongoDB connection
			const scoreWithRewards = {
				...score,
				timestamp: Date.now(),
				experienceGain: experienceGain.experienceGained,
				beatsReward,
				previousHighscore
			};


			


	
			// ✅ Open MongoDB **only when ready to insert**
			await this.insertScoreToMongo(scoreWithRewards, username);
	
			// ✅ Remove game session from KeyDB only after successful DB insert
			// await keydb.DEL(`energy_usage:${score.gameId}`);
	
			// Add rewards to response
			experienceGain.beatsReward = beatsReward;
			experienceGain.previousHighscore = previousHighscore;
			experienceGain.score = score;
	
			return experienceGain;
		} catch (error: any) {
			console.error(`Error saving classic score for user: ${username}`, error);
			throw error;
		}
	}


	public async submitClassicGame(): Promise<{ _id: string }> {
		const sessionId = new ObjectId();
		try {
			let client: MongoClient | null = null;
			client = await mongoDBClient.connect();
			const db = client.db("beats");
			const collection = db.collection("classicScores");
			// Insert a placeholder document with only _id and timestamp
			await collection.insertOne({
				_id: sessionId,
				createdAt: new Date(),
			});
			return { _id: sessionId.toHexString() };
		} catch (error: any) {
			console.error("Error creating classic game session:", error);
			throw error;
		}
	}
	/**
	 * Inserts the score into MongoDB with retry logic.
	 */
	private async insertScoreToMongo(scoreWithRewards: any, username: string | null): Promise<void> {
		let retries = 3;
	
		while (retries > 0) {
			let client: MongoClient | null = null;
			try {
				client = await mongoDBClient.connect();
				const db = client.db("beats");
				const collection = db.collection("classicScores");
	
				let gameId: string = scoreWithRewards.gameId;
	
				// Validate or convert gameId to ObjectId
				let objectId: ObjectId;
				try {
					objectId = new ObjectId(gameId);
				} catch {
					console.warn(`Invalid gameId format from client (${gameId}), generating new ObjectId`);
					objectId = new ObjectId();
					scoreWithRewards.gameId = objectId.toHexString();
				}
	
				// Check for an existing document
				const existingScore = await collection.findOne({ _id: objectId });
	
				// If it exists and has a songName, and it's different => new ObjectId (new game session)
				if (existingScore && existingScore.songName && existingScore.songName !== scoreWithRewards.songName) {
					console.warn(`⚠️ gameId collision with different songName for ${username}. Old: ${existingScore.songName}, New: ${scoreWithRewards.songName}`);
					objectId = new ObjectId();
					scoreWithRewards.gameId = objectId.toHexString();
				}

	

				const result = await collection.updateOne(
					{ _id: objectId },
					{ $set: { ...scoreWithRewards, username } },
					{ upsert: true }
				);

				console.log("monggis 4: ", result);
	
				console.log(`✅ Score saved for ${username} with _id / gameId: ${objectId}`);
				break;
			} catch (insertError) {
				console.error(`❌ Error inserting score for ${username}. Retrying...`, insertError);
				await new Promise((resolve) => setTimeout(resolve, 2000));
				retries--;
			} finally {
				if (client) {
					try {
						await client.close();
					} catch (closeError) {
						console.error(`Error closing MongoDB client for ${username}`, closeError);
					}
				}
			}
		}
	
		if (retries === 0) {
			throw new Error(`🚨 Failed to save score after retries for ${username}`);
		}
	}
	


	public async retrieveHistory(token: string, username: string): Promise<ClassicScoreStats[]> {
		const tokenService: TokenService = new TokenService();
		let client: MongoClient | null = null;

	
		try {
			await tokenService.verifyAccessToken(token);
	
			client = await mongoDBClient.connect();
			const db = client.db("beats");
			const collection = db.collection("classicScores");
	
			const scores = await collection
				.find({ username })
				.sort({ createdAt: -1 }) // descending
				.limit(10)
				.toArray();
	
			return scores as unknown as ClassicScoreStats[];
		} catch (error: any) {
			console.error(`Error retrieving score history for user: ${username}`, error);
			throw error;
		} finally {
			if (client) {
				try {

				} catch (closeError: any) {
					console.error(`Error closing MongoDB client while retrieving history for user: ${username}`, closeError);
				}
			}
		}
	}
	
	
	
	
	
	
	
	
    //* CLASSIC GAME MODE RETRIEVE SCORE FUNCTION
	public async getHighScoreClassic(peerId: ScorePeerId, token: string): Promise<ClassicScoreStats[]> {
		try {
			const tokenService: TokenService = new TokenService();
			await tokenService.verifyAccessToken(token);

			// Establish MongoDB connection
			const client: MongoClient = await mongoDBClient.connect();
			const db = client.db("beats");
			const collection = db.collection<ClassicScoreStats>("classicScores");

			// Convert peerId to number
			const idPeer: number = parseInt(peerId.peerId);

			// Query the collection for scores
			const classicScoreStats: ClassicScoreStats[] = await collection
				.find({ peerId: idPeer })
				.toArray();

			return classicScoreStats;
		} catch (error: any) {
			console.error("Error fetching high scores:", error);
			throw error;
		} finally {

		}
	}


	private async getHighScoreIndividual(songName: string, username: string): Promise<number> {
		let client: MongoClient | null = null;
		try {
			client = await mongoDBClient.connect();
			const db = client.db("beats");
			const collection = db.collection<ClassicScoreStats>("classicScores");
	
			// Find the highest score for the given song and username
			const highestScore = await collection
				.find({ songName, username }) // Filter by song name AND username
				.sort({ score: -1 }) // Sort in descending order to get the highest score first
				.limit(1) // Only retrieve one document
				.project({ score: 1, _id: 0 }) // Only return the score field
				.next(); // Get the first result
	
			// Ensure the function always returns a number (never null)
			return highestScore?.score ?? 0;
		} catch (error: any) {
			console.error("Error fetching highest score:", error);
			throw error;
		} finally {
			// ✅ Ensure the MongoDB connection is closed
			if (client) {
				try {

				} catch (closeError) {
					console.error("Error closing MongoDB client:", closeError);
				}
			}
		}
	}
	
	
	
	
	//* CLASSIC GAME MODE RETRIEVE ALL SCORE FUNCTION
	public async getPlayerHighScorePerSong(token: string): Promise<ClassicScoreStats[]> {
		try {
			const tokenService: TokenService = new TokenService();
			const username: string = await tokenService.verifyAccessToken(token);
	
			const client: MongoClient = await mongoDBClient.connect();
			const db = client.db("beats");
			const collection = db.collection<ClassicScoreStats>("classicScores");
	
			const highScores = await collection
				.aggregate([
					{ $match: { username } },
					{ $sort: { score: -1, timestamp: -1 } }, // Sort first 
					{
						$group: {
							_id: {
								songName: "$songName",
								difficulty: "$difficulty"
							},
							songName: { $first: "$songName" },
							difficulty: { $first: "$difficulty" },
							score: { $first: "$score" },
							combo: { $first: "$combo" },
							maxCombo: { $first: "$maxCombo" },
							accuracy: { $first: "$accuracy" },
							finished: { $first: "$finished" },
							artist: { $first: "$artist" },
							perfect: { $first: "$perfect" },
							veryGood: { $first: "$veryGood" },
							good: { $first: "$good" },
							bad: { $first: "$bad" },
							miss: { $first: "$miss" },
							username: { $first: "$username" },
							gameId: { $first: "$gameId" }
						}
					},
					{ $sort: { score: -1 } }
				])
				.toArray();
	
			const formattedScores = highScores.map(({ _id, ...rest }) => rest) as ClassicScoreStats[];
	
	
			
			return formattedScores;
		} catch (error: any) {
			console.error("Error fetching high scores:", error);
			throw error;
		}
	}
	
	
	
	
	

	//* CLASSIC GAME MODE RETRIEVE ALL SCORE FUNCTION
    private async calculateExperience(username: string, accuracy: number): Promise<LevelUpResult> {
        try {
            const experienceService: ExperienceService = new ExperienceService(this.driver);
            const result: LevelUpResult = await experienceService.calculateExperienceGain(username, accuracy);

            return result
        } catch(error: any) {
          console.log(error)
          throw error
        }
    }

	

    
    
}

export default ScoreService;


// const toPascalCase = (str: string): string => {
//     return str
//         .toLowerCase()
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join('');
// }


// {
// 	"_id": {
// 	  "$oid": "67c7deb9de3f466a2180e533"
// 	},
// 	"accuracy": 0.91260162601626,
// 	"artist": "X:IN",
// 	"bad": 3,
// 	"combo": 79,
// 	"difficulty": "easy",
// 	"finished": true,
// 	"good": 0,
// 	"maxCombo": 79,
// 	"miss": 0,
// 	"perfect": 65,
// 	"score": 2372100,
// 	"songName": "",
// 	"username": "nashar5",
// 	"veryGood": 14,
// 	"timestamp": 1741151929390,
// 	"experienceGain": 7,
// 	"beatsReward": 46,
// 	"previousHighscore": 0
//   }


// {
// 	"_id": {
// 	  "$oid": "67c297853a6e708db8ed19d0"
// 	},
// 	"accuracy": 0.959349593495935,
// 	"artist": "X:IN",
// 	"bad": 0,
// 	"combo": 82,
// 	"difficulty": "easy",
// 	"finished": true,
// 	"good": 0,
// 	"maxCombo": 82,
// 	"miss": 0,
// 	"peerId": 152611201,
// 	"perfect": 72,
// 	"score": 731088,
// 	"songName": "No Doubt",
// 	"username": "nashar5",
// 	"veryGood": 10,
// 	"timestamp": 1740806021472,
// 	"experienceGain": 3,
// 	"beatsReward": 48,
// 	"previousHighscore": 676912
//   }