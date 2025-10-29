//** ELYSIA IMPORT
import Elysia from 'elysia';

//** MEMGRAPH IMPORT 
import { getDriver } from '../db/memgraph';
import { Driver } from 'neo4j-driver';

//** SERVICE IMPORT
import StoreService from '../game.services/store.services/store.service';

//** TYPE INTERFACES
import { SuccessMessage } from '../outputs/success.message';
import { buyCardPackSchema, buyCardSchema, buyCardUpgradeSchema } from './route.schema/store.schema';
import { StoreCardData, StoreCardUpgradeData, StorePackData } from '../game.services/store.services/store.interface';

//** SCHEMA IMPORT
import { authorizationBearerSchema } from './route.schema/schema.auth';


const store = (app: Elysia) => {

  app.get('/api/store/cards/valid', async ({ headers }): Promise<StoreCardData[]> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const storeService: StoreService = new StoreService(driver);

        const output: StoreCardData[] = await storeService.getValidCards(jwtToken);
        return output as StoreCardData[] 

      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }, authorizationBearerSchema
  )


  .post('/api/store/cards/buy', async ({ headers, body }) => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const driver: Driver = getDriver();
        const storeService: StoreService = new StoreService(driver);
        
        const output: SuccessMessage = await storeService.buyCard(body, jwtToken);

        return output;
      } catch (error: any) {
        console.log(error);
        throw error

      }
    }, buyCardSchema
  )


  .post('/api/store/card-upgrade/buy', async ({ headers, body }): Promise<SuccessMessage> => {
    try {
      const authorizationHeader: string = headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new Error('Bearer token not found in Authorization header');
      }
      const jwtToken: string = authorizationHeader.substring(7);
      const driver: Driver = getDriver();
      const storeService: StoreService = new StoreService(driver);
      const output: SuccessMessage = await storeService.buyCardUpgrade(body, jwtToken);
      return output as SuccessMessage;
    } catch (error: any) {
      console.log(error);
      throw error
    }
  }, buyCardUpgradeSchema
  )


  .get('/api/store/card-upgrades/valid', async ({ headers }): Promise<StoreCardUpgradeData[]> => {
    try {
      const authorizationHeader: string = headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new Error('Bearer token not found in Authorization header');
      }

      const jwtToken: string = authorizationHeader.substring(7);

      const driver: Driver = getDriver();
      const storeService: StoreService = new StoreService(driver);

      const output: StoreCardUpgradeData[] = await storeService.getvalidCardUpgrade(jwtToken)

      return output as StoreCardUpgradeData[]
    } catch (error: any) {
      throw error
    }
  }, authorizationBearerSchema
  )


  .get('/api/store/card-packs/valid', async ({ headers }): Promise<StorePackData[]> => {
    try {
      const authorizationHeader: string = headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new Error('Bearer token not found in Authorization header');
      }

      const jwtToken: string = authorizationHeader.substring(7);

      const driver: Driver = getDriver();
      const storeService: StoreService = new StoreService(driver);

      const output: StorePackData[] = await storeService.getValidCardPacks (jwtToken)

      return output as StorePackData[]
    } catch (error: any) {
      throw error
    }
  }, authorizationBearerSchema
  )


  // .post('/api/store/card-upgrade/buy', async ({ headers, body }): Promise<SuccessMessage> => {
  //   try {
  //     const authorizationHeader: string = headers.authorization;
  //     if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
  //       throw new Error('Bearer token not found in Authorization header');
  //     }
  //     const jwtToken: string = authorizationHeader.substring(7);

  //     const driver: Driver = getDriver();
  //     const storeService: StoreService = new StoreService(driver);
      
  //     const output: SuccessMessage = await storeService.buyCardUpgrade(body, jwtToken);

  //     return output as SuccessMessage;
  //   } catch (error: any) {
  //     throw error
  //   }
  // }, buyCardUpgradeSchema
  // )

  .post('/api/store/card-packs/buy', async ({ headers, body }): Promise<SuccessMessage> => {
    try {
      const authorizationHeader: string = headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new Error('Bearer token not found in Authorization header');
      }
      const jwtToken: string = authorizationHeader.substring(7);

      const driver: Driver = getDriver();
      const storeService: StoreService = new StoreService(driver);
      
      const output: SuccessMessage = await storeService.buyCardPack(body, jwtToken);

      return output as SuccessMessage;
    } catch (error: any) {
      throw error
    }
  }, buyCardPackSchema
  )


};

export default store;
