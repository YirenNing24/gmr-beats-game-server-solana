// Import necessary modules
import { Driver } from 'neo4j-driver';
import { initDriver, getDriver } from '../db/memgraph';
import InitMemgraph from './memgraph.init';
import { NEO4J_PASSWORD, NEO4J_USERNAME, NEO4J_URI } from '../config/constants';


const initServer = async () => {
  // Retrieve the initialized driver
  const driver: Driver = getDriver();

  // Initialize Memgraph
  const initMemgraph: InitMemgraph = new InitMemgraph(driver);
  await initMemgraph.createConstraint();
}

(async () => {
    await initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD);
    initServer();
  })();