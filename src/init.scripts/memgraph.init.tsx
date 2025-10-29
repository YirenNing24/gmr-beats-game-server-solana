//** MEMGRAPH DRIVER
import { Driver, Session, ManagedTransaction } from 'neo4j-driver-core'

class InitMemgraph {
  /**
   * The Neo4j driver used for database interactions.
   * @type {Driver}
   * @memberof AuthService
   * @instance
   */
  driver: Driver
  constructor(driver: Driver) {
    this.driver = driver
    }

    async createConstraint (): Promise<void> {
        // Create a session using the driver
        const session: Session = this.driver.session();
        try {
            // Create a unique constraint on the username property of the User nodes
            await session?.executeWrite(async (tx: ManagedTransaction): Promise<void> => {
                await tx.run(
                    `
                    CREATE CONSTRAINT ON (u:User) ASSERT u.username IS UNIQUE
                    `
                );
            });
            session.close()
        } catch (error: any) {
            throw error;
        }
    };


}




export default InitMemgraph

