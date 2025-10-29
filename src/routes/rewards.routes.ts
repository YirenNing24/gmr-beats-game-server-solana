//** ELYSIA IMPORT
import Elysia from 'elysia';

//** MEMGRAPH IMPORT 
import { getDriver } from '../db/memgraph';
import { Driver } from 'neo4j-driver';

//** SERVICE IMPORT
import RewardService from '../game.services/rewards.services/mission.rewards.service';

//** SCHEMA IMPORT
import { authorizationBearerSchema } from './route.schema/schema.auth';
import { personalMissionSchema } from '../game.services/rewards.services/rewards.schema';

//** OUTPUT MESSSAGE IMPORT
import { SuccessMessage } from '../outputs/success.message';
import { GetDailyMission } from '../game.services/rewards.services/reward.interface';




const rewards = (app: Elysia) => {

  app.get('/api/reward/personal-missions', async ({ headers }) => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
        const driver: Driver = getDriver();
        const rewardService: RewardService = new RewardService(driver)
        
        const output = await rewardService.getPersonalMissions(jwtToken);
        return output 
      } catch (error: any) {
        console.log(error)
        throw error

        }
     }, authorizationBearerSchema
    )

    .get('/api/reward/collection-missions', async ({ headers }) => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
        const driver: Driver = getDriver();
        const rewardService: RewardService = new RewardService(driver)
        
        const output = await rewardService.getCollectionMissions(jwtToken);
        return output 
      } catch (error: any) {
        console.log(error)
        throw error

        }
     }, authorizationBearerSchema
    )

    .get('/api/reward/daily-missions', async ({ headers }) => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
        const driver: Driver = getDriver();
        const rewardService: RewardService = new RewardService(driver)
        
        const output: GetDailyMission[] = await rewardService.getDailyMisions(jwtToken);
        return output 
      } catch (error: any) {
        console.log(error)
        throw error
        }
     }, authorizationBearerSchema
    )

    .post('/api/reward/claim/personal-mission', async ({ headers, body }) => {
     try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
        const driver: Driver = getDriver();
        const rewardService: RewardService = new RewardService(driver);
        
        const output = await rewardService.claimPersonalMissionReward(jwtToken, body)
        return output as SuccessMessage;
     } catch (error: any) {
       console.log(error);
       throw error
     }

     }, personalMissionSchema
    )

    .post('/api/reward/claim/daily-mission', async ({ headers, body }) => {
      try {
         const authorizationHeader: string = headers.authorization;
         if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
           throw new Error('Bearer token not found in Authorization header');
         }
         const jwtToken: string = authorizationHeader.substring(7);
         const driver: Driver = getDriver();
         const rewardService: RewardService = new RewardService(driver);
         
         const output = await rewardService.claimDailyMissionReward(jwtToken, body)
         return output as SuccessMessage;
      } catch (error: any) {
        console.log(error);
        throw error
      }
 
      }, personalMissionSchema
    )
}

export default rewards