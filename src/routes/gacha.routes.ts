//** ELYSIA AND JWT MODULE IMPORT
import Elysia from 'elysia'


//** MEMGRAPH DRIVER AND TYPES
import { Driver } from 'neo4j-driver';
import { getDriver } from '../db/memgraph';

//** SERVICE IMPORT
import GachaService from '../game.services/gacha.services/gacha.service';

//**  TYPE INTERFACE IMPORT
import { packDataSchema } from '../game.services/gacha.services/gacha.schema';
import { authorizationBearerSchema } from './route.schema/schema.auth';



const gacha = (app: Elysia): void => {
    app.post('/api/gacha/open/card-pack', async ({ headers, body }): Promise<string[]> => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
              throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);

            const driver: Driver = getDriver();
            const gachaService: GachaService = new GachaService(driver);

            const output: string[] = await gachaService.openCardPack(jwtToken, body);

            return output;
        } catch (error: any) {
            throw error
        } 
     }, packDataSchema,
    
    );

};

export default gacha;