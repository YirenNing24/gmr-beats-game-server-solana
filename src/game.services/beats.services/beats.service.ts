//** IMPORTED SERVICES
import TokenService from '../../user.services/token.services/token.service.js';
import keydb from '../../db/keydb.client.js';

//** MEMGRAPH DRIVER
import { Driver } from 'neo4j-driver-core';

//** TYPE INTERFACE */
import { SuccessMessage } from '../../outputs/success.message.js';
import { BeatsActivity, BeatsStatus, MutualStatus } from './beats.interface.js';    

class BeatsService {
  driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  public async authenticateBeatsClient(token: string): Promise<SuccessMessage | Error> {
    try {
      const tokenService: TokenService = new TokenService();
      const userName: string | Error = await tokenService.verifyAccessToken(token);

      //@ts-ignore
      if (userName instanceof Error) {
        console.log("Token verification failed");
        return new Error("error encountered");
      }

      const activity = { activity: 'lobby' };

      await this.setBeatsClientStatus(userName, activity);

      return new SuccessMessage(userName);
    } catch (error: any) {
      console.error("An error occurred during authentication:", error);
      return new Error("authentication failed");
    }
  }


  public async setBeatsClientStatus(username: string, beatsActivity: BeatsActivity): Promise<SuccessMessage | Error> {
    try {
      const { activity } = beatsActivity;
      await keydb.HSET(username, {
        status: 'online',
        activity: activity
      });

      return new SuccessMessage('Status set successfully');
    } catch (error: any) {
      console.log(error);
      return new Error('Failed to set status');
    }
  }

  
  public async getBeatsClientStatus(token: string, usernames: string[]): Promise<MutualStatus[] | Error> {
    try {
      const tokenService: TokenService = new TokenService();
      await tokenService.verifyAccessToken(token);
      
      // Create an array of promises for fetching statuses
      const fetches:  Promise<MutualStatus>[] = usernames.map(async (username) => {
        const result = await keydb.HGETALL(username);
        // Cast to BeatsStatus type and return as an object
        return { username, status: result as unknown as BeatsStatus };
      });
  
      // Wait for all promises to resolve
      const results: MutualStatus[] = await Promise.all(fetches);
  
      return results;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
  
}

export default BeatsService;
