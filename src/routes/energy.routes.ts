//** ELYSIA AND JWT MODULE IMPORT
import Elysia from 'elysia'

//** MEMGRAPH DRIVER AND TYPES
import { Driver } from 'neo4j-driver';
import { getDriver } from '../db/memgraph';

//** SERVICE IMPORT
import EnergyService from '../game.services/energy.services/energy.service';

//** SCHEMA IMPORT
import EnergyItemsService from '../game.services/energy.services/energy.items';
import { authorizationBearerSchema } from './route.schema/schema.auth';
import { EnergyBottleNFT } from '../game.services/energy.services/energy.interface';

const energy = (app: Elysia): void => {


    app.post('/api/energy/use', async ({ headers }) => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
              throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);


            const energyService: EnergyService = new EnergyService()
            const result = await energyService.usePlayerEnergy(jwtToken);

            return result
        } catch (error: any) {
          console.log(error)
          throw error
        }
      }, authorizationBearerSchema
    )


    .get('/api/energy-drinks/get', async ({ headers }): Promise<EnergyBottleNFT[]> => {
      try {
        const authorizationHeader = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

          const energyItemService: EnergyItemsService = new EnergyItemsService(); 
          const result: EnergyBottleNFT[] = await energyItemService.getEnergyDrinks(jwtToken);

          return result
      } catch (error: any) {
        console.log(error)
        throw error
      }
    }, authorizationBearerSchema
  )


}

export default energy