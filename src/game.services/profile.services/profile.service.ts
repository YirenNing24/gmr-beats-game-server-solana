//** MEMGRAPH IMPORT
import { Driver, ManagedTransaction, QueryResult, RecordShape, Session } from "neo4j-driver";

//** MONGODB IMPORT
import { mongoDBClient } from "../../db/mongodb.client";
import { ObjectId } from "mongodb";

//** OUTPUT IMPORTS
import ValidationError from "../../outputs/validation.error";
import { SuccessMessage } from "../../outputs/success.message";

//** SERVICE IMPORT
import TokenService from "../../user.services/token.services/token.service";

//** TYPE INTERFACES
import { UpdateStatsFailed, ProfilePicture, StatPoints, SoulMetaData, CardCollection, PictureLikes, BufferData, MyNote } from "./profile.interface";
import { PlayerStats } from "../../user.services/user.service.interface";

//** IMPORT THIRDWEB
import { CardMetaData } from "../inventory.services/inventory.interface";

//** NANOID IMPORT
import { nanoid } from "nanoid";



class ProfileService {
  driver?: Driver;
  constructor(driver?: Driver) {
    this.driver = driver;
  }

  public async updateStats(statPoints: StatPoints, token: string): Promise<any | UpdateStatsFailed> {
    try {
        const tokenService: TokenService = new TokenService();
        const username: string | Error = await tokenService.verifyAccessToken(token);

        const session: Session | undefined = this.driver?.session();
        if (!session) throw new Error('Session is undefined');

        const result: QueryResult<RecordShape> | undefined = await session.executeRead(tx =>
            tx.run(`MATCH (u:User {username: $username}) RETURN u.playerStats`, { username })
        );

        if (!result?.records.length) throw new ValidationError(`User with username '${username}' not found.`, "");

        const userData = result?.records[0].get('u.playerStats');
        const playerStats: PlayerStats = JSON.parse(userData);

        const { level, playerExp, availStatPoints, rank } = playerStats;
        const { mainVocalist, rapper, leadDancer, leadVocalist, mainDancer, visual, leadRapper } = statPoints;
        const totalStatPointsAdded =
            mainVocalist + rapper + leadDancer + leadVocalist + mainDancer + visual + leadRapper;

        if (
            Object.values(statPoints).some(val => val < 0) ||
            totalStatPointsAdded > availStatPoints
        ) throw new ValidationError(`Invalid stat changes detected.`, "");

        const newAvailStatPoints = Math.max(0, availStatPoints - totalStatPointsAdded);
        const updatedStatPointsSaved = {
            mainVocalist,
            rapper,
            leadDancer,
            leadVocalist,
            mainDancer,
            visual,
            leadRapper,
        };

        const updatedPlayerStats: PlayerStats = { level, playerExp, availStatPoints: newAvailStatPoints, rank, statPointsSaved: updatedStatPointsSaved };
        await session.executeWrite(tx =>
            tx.run(`MATCH (u:User {username: $username}) SET u.playerStats = $newPlayerStats`, { username, updatedPlayerStats })
        );
        await session.close();

        return { success: true, message: 'Stats updated successfully.', updatedPlayerStats };
    } catch (error: any) {
        console.error("Error updating stats:", error);
        return { success: false, message: 'Error updating stats.' } as UpdateStatsFailed;
    }
    }

  public async uploadProfilePic(imageBuffer: BufferData, token: string): Promise<SuccessMessage> {
      try {
        const tokenService: TokenService = new TokenService();
        const userName: string | Error = await tokenService.verifyAccessToken(token);

        const uploadedAt: number = Date.now();
        const fileFormat: string = "png";
        const fileSize: number = 100;
  
        const profilePicture = {
          profilePicture: imageBuffer.bufferData,
          userName,
          uploadedAt,
          fileFormat,
          fileSize,
          likes: []
        };

        const client = await mongoDBClient.connect();
        const db = client.db("beats");
        const profilePicCollection = db.collection("profilePic");

        const existingProfilePicsCount: number = await profilePicCollection.countDocuments({ userName });
        if (existingProfilePicsCount >= 5) {
          throw new ValidationError("You already have 5 profile pictures.", "");
        }
  
        // Insert the profile picture into MongoDB
        await profilePicCollection.insertOne(profilePicture);

        return new SuccessMessage("Profile picture upload successful");
      } catch (error: any) {
        console.error("Error updating profile picture:", error);
        throw error;
      }
    }

    public async likeProfilePicture(token: string, likedProfilePicture: { _id: string }): Promise<SuccessMessage> {
      try {
        const tokenService: TokenService = new TokenService();
        const userName: string | Error = await tokenService.verifyAccessToken(token);
    
        const client = await mongoDBClient.connect();
        const db = client.db("beats");
        const profilePicCollection = db.collection("profilePic");
    
        // Convert pictureId to ObjectId once
        const pictureId = new ObjectId(likedProfilePicture._id);
    
        // Get the profile picture from MongoDB
        const picture = await profilePicCollection.findOne({ _id: pictureId });
    
        if (!picture) {
          throw new ValidationError(`Profile picture with ID '${likedProfilePicture._id}' not found.`, "");
        }
    
        // Ensure likes array exists
        const likes = picture.likes ?? [];
    
        // Check if the user already liked the picture
        const alreadyLiked = likes.some((like: any) => like.userName === userName);
    
        if (alreadyLiked) {
          throw new ValidationError(`User '${userName}' has already liked this picture.`, "");
        }
    
        // Create a new like object
        const likeData = {
          userName,
          timestamp: Date.now(),
          likeId: nanoid(),
        };
    
        // Add the new like to the picture
        await profilePicCollection.updateOne(
          { _id: pictureId },
          //@ts-ignore
          { $push: { likes: likeData } }
        );
    
        // Close the DB connection

    
        return new SuccessMessage("Profile picture liked successfully");
      } catch (error: any) {
        console.error("Error liking profile picture:", error);
        throw error;
      }
    }
    
    

    public async unlikeProfilePicture(token: string, likedProfilePicture: { _id: string }): Promise<SuccessMessage> {
      try {
        const tokenService: TokenService = new TokenService();
        const userName: string | Error = await tokenService.verifyAccessToken(token);
    
        const client = await mongoDBClient.connect();
        const db = client.db("beats");
        const profilePicCollection = db.collection("profilePic");
    
        // Convert pictureId to ObjectId once
        const pictureId = new ObjectId(likedProfilePicture._id);
    
        // Get the profile picture from MongoDB
        const picture = await profilePicCollection.findOne({ _id: pictureId });
    
        if (!picture) {
          throw new ValidationError(`Profile picture with ID '${likedProfilePicture._id}' not found.`, "");
        }
    
        // Ensure likes array exists
        const likes = picture.likes ?? [];
    
        // Check if the user has already liked the picture
        const likeIndex = likes.findIndex((like: any) => like.userName === userName);
    
        if (likeIndex === -1) {
          throw new ValidationError(`User '${userName}' has not liked this picture.`, "");
        }
    
        // Remove the like
        likes.splice(likeIndex, 1);
    
        // Update the profile picture in the database
        await profilePicCollection.updateOne(
          { _id: pictureId },
          { $set: { likes } }
        );
    
        // Close the DB connection

    
        return new SuccessMessage("Profile picture unliked successfully");
      } catch (error: any) {
        console.error("Error unliking profile picture:", error);
        throw error;
      }
    }
    
    
  public async getPlayerProfilePic(token: string, playerUsername: string): Promise<ProfilePicture[]> {
    try {
      const tokenService: TokenService = new TokenService();
      await tokenService.verifyAccessToken(token);
      const client = await mongoDBClient.connect();
      const db = client.db("beats");
  
      // Retrieve the latest 10 profile pictures for the player
      const profilePictures = await db
        .collection("profilePic")
        .find({ userName: playerUsername })
        .sort({ uploadedAt: -1 }) // Sort by latest uploadedAt timestamp
        .limit(5)
        .toArray();
  
      return profilePictures as unknown as ProfilePicture[];
    } catch (error: any) {
      console.error(`Error processing the image: ${error.message}`);
      throw error;
    }
  }
  

  public async getProfilePic(token: string, username?: string): Promise<ProfilePicture[]> {
    try {
      let userName: string = username || "";
  
      // If username is not provided, verify token to get it
      if (!userName) {
        const tokenService: TokenService = new TokenService();
        userName = await tokenService.verifyAccessToken(token);
      }
  
      const client = await mongoDBClient.connect();
      const db = client.db("beats");
  
      const profilePictures = await db
        .collection("profilePic")
        .find({ userName })
        .sort({ uploadedAt: -1 }) // Ensures newest profile pictures appear first
        .toArray();
  
      return profilePictures as unknown as ProfilePicture[];
    } catch (error: any) {
      console.error(`Error retrieving profile pictures: ${error.message}`);
      throw error;
    }
  }
  
  

  public async getDisplayPic(token: string, userNames: string[], origin: string): Promise<ProfilePicture[]> {
    try {
      // Skip token verification if origin is "leaderboard" or "social"
      if (origin !== "leaderboard" && origin !== "social") {
        const tokenService: TokenService = new TokenService();
        await tokenService.verifyAccessToken(token);
      }
  
      const client = await mongoDBClient.connect();
      const db = client.db("beats");
  
      // Fetch only the latest profile picture per user
      const profilePictures = await db.collection("profilePic")
        .aggregate([
          { $match: { userName: { $in: userNames } } }, // Match usernames
          { $sort: { uploadedAt: -1 } }, // Sort by newest first
          {
            $group: {
              _id: "$userName",
              profilePicture: { $first: "$profilePicture" }, // Get latest image only
              userName: { $first: "$userName" } // Preserve username
            }
          }
        ])
        .toArray();
        

      return profilePictures as unknown as ProfilePicture[];
    } catch (error: any) {
      console.error("Error getting profile pictures:", error);
      throw new ValidationError(`Error retrieving the profile pictures: ${error.message}.`, "");
    }
  }
  
  
  
  
    

    public async changeProfilePic(token: string, newProfilePicture: { _id: string }): Promise<SuccessMessage> {
      try {
        const tokenService: TokenService = new TokenService();
        const userName: string | Error = await tokenService.verifyAccessToken(token);
        if (typeof userName !== "string") {
          throw new Error("Invalid token");
        }
    
        const client = await mongoDBClient.connect();
        const db = client.db("beats");
        const profilePicCollection = db.collection("profilePic");
        
        const pictureId: string = newProfilePicture._id;
    
        // Retrieve the profile picture by ID and check ownership
        const latestProfilePic = await profilePicCollection.findOne({
          _id: new ObjectId(pictureId),
          userName, // Ensure the user owns the picture
        });
    
        if (!latestProfilePic) {
          throw new ValidationError("No profile picture found for this user", "");
        }
    
        // Set all profile pictures of this user to inactive
        await profilePicCollection.updateMany(
          { userName },
          { $set: { isActive: false } }
        );
    
        // Set the new profile picture as active
        const updateResult = await profilePicCollection.updateOne(
          { _id: new ObjectId(pictureId) },
          { $set: { isActive: true, uploadedAt: Date.now() } }
        );
    
        if (updateResult.modifiedCount === 1) {
          return new SuccessMessage("Profile picture updated successfully");
        } else {
          throw new Error("Failed to update profile picture");
        }
      } catch (error: any) {
        console.error("Error updating profile picture:", error);
        throw error;
      }
    }
    

    
  public async createSoulPreferences(token: string, soulMetadata: SoulMetaData): Promise<SuccessMessage> {
      const session: Session | undefined = this.driver?.session();
      const tokenService: TokenService = new TokenService();
      const userName: string | Error = await tokenService.verifyAccessToken(token);
      try{

          const result: QueryResult | undefined = await session?.executeRead(tx =>
              tx.run(`
              MATCH (u:User {username: $userName})
              OPTIONAL MATCH (u)-[:SOUL]->(s:Soul) 
              RETURN s, u.smartWalletAddress as smartWalletAddress`, { userName })
          );
          await session?.close();

          let smartWalletAddress: string | undefined;

          if (result && result.records.length > 0) {
            smartWalletAddress = result.records[0].get('smartWalletAddress');
          }

          // If no Soul node is connected to the user, create a Soul node
          const soulExists = result?.records.some(record => record.get('s') !== null);

          if (!soulExists) {
            //@ts-ignore
            await this.createSoul(userName, smartWalletAddress, soulMetadata);
          }
          else {
            //@ts-ignore
            await this.saveSoul(userName, soulMetadata)
    
          };

        return new SuccessMessage("Preference saved successfully")
      } catch(error: any) {
        throw error
      }
    }



  public async getSoul(token: string): Promise<SoulMetaData> {
      const tokenService: TokenService = new TokenService();
      try {
          // Verify the access token and get the username
          const userName: string | Error = await tokenService.verifyAccessToken(token);
          
          const session: Session | undefined = this.driver?.session();
          const result: QueryResult | undefined = await session?.executeRead(tx =>
              tx.run(`
                  MATCH (u:User { username: $userName })-[:SOUL]->(s:Soul)
                  RETURN s as soul
              `, { userName })
          );

          await session?.close();
  
          if (!result || result.records.length === 0) {
            //@ts-ignore
              return {}
          }
  
          const soul: SoulMetaData = result.records[0].get('soul').properties;
  
          const { ...filteredSoulNode } = soul;
  
          return filteredSoulNode as SoulMetaData;
      } catch (error: any) {
          throw error;
      } 
    }

  public async getOwnedCardCount(token: string): Promise<{ [groupName: string]: number }> {
      const tokenService: TokenService = new TokenService();
      try {
          // Verify the access token and get the username
          const userName: string | Error = await tokenService.verifyAccessToken(token);
          
          const session: Session | undefined = this.driver?.session();
          const result: QueryResult | undefined = await session?.executeRead(tx =>
              tx.run(`
                  MATCH (u:User { username: $userName })-[:INVENTORY|EQUIPPED]->(c:Card)
                  WITH c.group AS groupName, count(c) AS cardCount
                  RETURN groupName, cardCount
              `, { userName })
          );
          await session?.close();
  
          if (result) {
              const counts: { [groupName: string]: number } = {};
              result.records.forEach(record => {
                  const groupName = record.get('groupName');
                  const cardCount = record.get('cardCount').toNumber();
                  counts[groupName] = cardCount;
              });
              return counts;
          } else {
              throw new Error('Failed to retrieve card counts');
          }
      } catch (error: any) {
          throw error;
      }
    }

  public async getCardCollection(token: string): Promise<CardCollection[]> {
      try {
        const tokenService: TokenService = new TokenService();
        const userName: string | Error = await tokenService.verifyAccessToken(token);
    
        const session: Session | undefined = this.driver?.session();
    
        const getCardCollectionCypher = `
          MATCH (u:User {username: $userName})-[:EQUIPPED|INVENTORY|BAGGED]->(c:Card)
          WITH c.name AS cardName, collect(c) AS cards
          RETURN cardName, cards[0] AS card, size(cards) AS count
        `;
    
        const result: QueryResult<RecordShape> | undefined = await session?.executeRead(
          (tx: ManagedTransaction) =>
            tx.run(getCardCollectionCypher, { userName })
        );

        await session?.close();

        const cardCollection = result?.records.map(record => {
          const card: CardMetaData = record.get('card').properties;
          delete card.imageByte;
    
          return {
            name: record.get('cardName'),
            card: card,
            count: record.get('count').toInt()
          };
        });
    
        return cardCollection as CardCollection[]
    
      } catch (error: any) {
        throw error;
      }
    }

  // public async updateMyNotes(token: string, myNotes: MyNote): Promise<SuccessMessage | Error> {
  //     try {
  //       const { note } = myNotes
  //       if (note.length > 60) {
  //         return new Error("Note exceeds the 60 character limit.");
  //       }
    
  //       const tokenService: TokenService = new TokenService();
  //       const userName: string | Error = await tokenService.verifyAccessToken(token);
    
  //       const connection: rt.Connection = await getRethinkDB();
        
  //       const timestamp: number = Date.now();
  //       const noteData = { userName, note, createdAt: timestamp, updatedAt: timestamp };
    
  //       // Insert the new note or update the existing one
  //       await rt.db('beats').table('myNotes').insert(noteData, { conflict: "replace" }).run(connection);

  //       return new SuccessMessage("My notes updated");
  //     } catch (error: any) {
  //       console.error("Error updating note:", error);
  //       throw error;
  //     }
  //   }

  // public async getMutualMyNotes(token: string,): Promise<MyNote | {}> {
  //     try {
  //       const tokenService: TokenService = new TokenService();
  //       const userName: string | Error = await tokenService.verifyAccessToken(token);
    
  //       const connection: rt.Connection = await getRethinkDB();
        
  //       // Retrieve the latest note for the user
  //       const cursor: rt.Cursor = await rt
  //         .db('beats')
  //         .table('myNotes')
  //         .filter({ userName })
  //         .orderBy(rt.desc('createdAt')) // Order by createdAt timestamp in descending order
  //         .limit(1) // Limit to one result
  //         .run(connection);
        
  //       const notesArray: MyNote[] = await cursor.toArray();
        
  //       if (notesArray.length === 0) {
  //         return {}
  //       }
    
  //       const myNote: MyNote = notesArray[0];
    
  //       return myNote;
  //     } catch (error: any) {
  //       console.error("Error retrieving note:", error);
  //       throw error;
  //     }
  //   }

  // public async getMyNotes(token: string,): Promise<MyNote | {}> {
  //     try {
  //       const tokenService: TokenService = new TokenService();
  //       const userName: string | Error = await tokenService.verifyAccessToken(token);
    
  //       const connection: rt.Connection = await getRethinkDB();
        
  //       // Retrieve the latest note for the user
  //       const cursor: rt.Cursor = await rt
  //         .db('beats')
  //         .table('myNotes')
  //         .filter({ userName })
  //         .orderBy(rt.desc('createdAt')) // Order by createdAt timestamp in descending order
  //         .limit(1) // Limit to one result
  //         .run(connection);
        
  //       const notesArray: MyNote[] = await cursor.toArray();
        
  //       if (notesArray.length === 0) {
  //         return {}
  //       }
    
  //       const myNote: MyNote = notesArray[0];
    
  //       return myNote;
  //     } catch (error: any) {
  //       console.error("Error retrieving note:", error);
  //       throw error;
  //     }
  //   }

  // public async moments(token: string, myNotes: MyNote): Promise<SuccessMessage | Error> {
  //     try {
  //       const { note } = myNotes
  //       if (note.length > 60) {
  //         return new Error("Note exceeds the 60 character limit.");
  //       }
    
  //       const tokenService: TokenService = new TokenService();
  //       const userName: string | Error = await tokenService.verifyAccessToken(token);
    
  //       const connection: rt.Connection = await getRethinkDB();
        
  //       const timestamp: number = Date.now();
  //       const noteData = { userName, note, createdAt: timestamp, updatedAt: timestamp };
    
  //       // Insert the new note or update the existing one
  //       await rt.db('beats').table('myNotes').insert(noteData, { conflict: "replace" }).run(connection);

  //       return new SuccessMessage("My notes updated");
  //     } catch (error: any) {
  //       console.error("Error updating note:", error);
  //       throw error;
  //     }
  //   }



    

}
export default ProfileService