//** ELYSIA IMPORT
import Elysia from 'elysia';

//** MEMGRAPH IMPORT 
import { getDriver } from '../db/memgraph';
import { Driver } from 'neo4j-driver';

//** SERVICE IMPORT
import StoreService from '../game.services/store.services/store.service';

//** TYPE INTERFACES
import { SuccessMessage } from '../outputs/success.message';

//** SCHEMA IMPORT
import { cardUpgradeSchema } from '../game.services/upgrade.services/upgrade.schema';
import UpgradeService from '../game.services/upgrade.services/upgrade.service';


const upgrade = (app: Elysia) => {


  app.post('/api/upgrade/card', async ({ headers, body }): Promise<SuccessMessage> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const upgradeService: UpgradeService = new UpgradeService(driver)
        
        const output: SuccessMessage = await upgradeService.cardGainExperience(jwtToken, body)

        return output as SuccessMessage;
      } catch (error: any) {
        throw error

      }
    }, cardUpgradeSchema
  )

}

export default upgrade