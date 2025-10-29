import neo4j, { Driver } from 'neo4j-driver';
import { NEO4J_PASSWORD, NEO4J_URI, NEO4J_USERNAME }  from '../config/constants';

let driver: Driver;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function initDriver(uri: string, username: string, password: string, retries: number = 5, delay: number = 2000): Promise<Driver> {
  let attempt: number = 0;

  while (attempt < retries) {
    try {
      driver = neo4j.driver(
        uri,
        neo4j.auth.basic(username, password),
        // {
        //   encrypted: 'ENCRYPTION_ON',  // Enable SSL
        //   trust: 'TRUST_ALL_CERTIFICATES',
        // }
      );

      // Try to get server info to verify the connection
      await driver.getServerInfo();

      // If connection is successful, break out of the loop
      console.log('Successfully connected to Memgraph');
      return driver;
    } catch (error: any) {
      attempt++;
      console.error(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await sleep(delay);
      } else {
        throw new Error(`Failed to connect to Neo4j after ${retries} attempts.`);
      }
    }
  }

  // This will never be reached if the retry limit is reached and an error is thrown
  throw new Error('Unable to initialize Neo4j driver.');
}

/**
 * Get the instance of the Neo4j Driver created in the `initDriver` function
 * @returns {neo4j.Driver}
 */
export function getDriver(): Driver {
  return driver;
}

/**
 * If the driver has been instantiated, close it and all remaining open sessions
 * @returns {Promise<void>}
 */
export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
  }
}

