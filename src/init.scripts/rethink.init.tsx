//** RETHINK DB
import rt from "rethinkdb";
import { getRethinkDB } from "../db/rethink";


// Replace this array with your actual data
const tableNames: string[] = ['chats', 'private', 'group', 'profilePic', 'status', 'myNotes', 'fanZone', 'missions', 'classicScores', 'notifications'];

const createDatabaseAndTables = async (): Promise<void> => {
  try {

    const connection: rt.Connection = await getRethinkDB();

    // Create the 'beats' database
    await rt.dbCreate('beats').run(connection)

    // Use the 'beats' database
    for (const tableName of tableNames) {
        await rt.db('beats').tableCreate(tableName).run(connection)
        console.log(`Table '${tableName}' created.`);
    }

    console.log('Database and tables created successfully.');

  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

// Run the function
createDatabaseAndTables();
