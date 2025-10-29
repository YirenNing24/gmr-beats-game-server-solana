import { mongoDBClient } from "./mongodb.client";


const dbName: string = "beats";  // The database name
const collectionNames: string[] = ['chats', 'private', 'group', 'profilePic', 'status', 'myNotes', 'fanZone', 'missions', 'classicScores', 'notifications', 'personalMissions', 'collectionMissions', 'missionsCompleted'];

//
const createDatabaseAndCollections = async (): Promise<void> => {
  try {
    // Connect to the MongoDB server
    await mongoDBClient.connect();

    // Select the database
    const db = mongoDBClient.db(dbName);

    // Create collections
    for (const collectionName of collectionNames) {
      await db.createCollection(collectionName);
      console.log(`Collection '${collectionName}' created.`);
    }

    console.log('Database and collections created successfully.');

  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await mongoDBClient.close();  // Close the connection to MongoDB
  }
}

// Run the function
createDatabaseAndCollections();
