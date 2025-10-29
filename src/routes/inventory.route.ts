//** ELYSIA AND JWT MODULE IMPORT
import Elysia from 'elysia'

//** MEMGRAPH DRIVER AND TYPES
import { Driver } from 'neo4j-driver';
import { getDriver } from '../db/memgraph';

//** INTERFACE IMPORT
import { CardMetaData, InventoryCards } from '../game.services/inventory.services/inventory.interface';

//** SERVICES IMPORTS
import InventoryService from '../game.services/inventory.services/inventory.service';

//** VALIDATION SCHEMA IMPORT
import { authorizationBearerSchema } from './route.schema/schema.auth';
import { cardGroupSchema, equipItemSchema  } from '../game.services/inventory.services/inventory.schema';
import { SuccessMessage } from '../outputs/success.message';
import { StoreCardUpgradeData } from '../game.services/store.services/store.interface';


const inventory = (app: Elysia): void => {
    app.get('/api/card/inventory/open', async ({ headers }): Promise<InventoryCards> => {
        try {
            const authorizationHeader = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);

            const driver: Driver = getDriver();
            const inventoryService: InventoryService = new InventoryService(driver);
            const output = await inventoryService.cardInventoryOpen(jwtToken)

            return output as InventoryCards
            } catch (error: any) {
            return error
            }
        }, authorizationBearerSchema
        )
    

    .post('/api/card/inventory/equip-item', async ({ headers, body }): Promise<SuccessMessage> => {
         try {
             const authorizationHeader: string = headers.authorization || "";
             if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                 throw new Error('Bearer token not found in Authorization header');
             }
             const jwtToken: string = authorizationHeader.substring(7);

             const driver: Driver = getDriver();
             const inventoryService: InventoryService = new InventoryService(driver);
             const output: SuccessMessage = await inventoryService.equipItem(jwtToken, body)

             return output as SuccessMessage
         } catch (error: any) {
             return error
             }
         }, equipItemSchema
        )


    .post('/api/card/inventory/unequip-item', async ({ headers, body }): Promise<SuccessMessage> => {
            try {
                const authorizationHeader: string = headers.authorization || "";
                if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                    throw new Error('Bearer token not found in Authorization header');
                }
                const jwtToken: string = authorizationHeader.substring(7);
   
                const driver: Driver = getDriver();
                const inventoryService: InventoryService = new InventoryService(driver);
                const output: SuccessMessage = await inventoryService.unequipItem(jwtToken, body)
   
                return output as SuccessMessage
            } catch (error: any) {
                return error
                }
            }, equipItemSchema
        )


    .get('/api/upgrade/inventory/open', async ({ headers }): Promise<StoreCardUpgradeData[]> => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);

            const driver: Driver = getDriver();
            const inventoryService: InventoryService = new InventoryService(driver);
            const output: StoreCardUpgradeData[] = await inventoryService.upgradeInventoryOpen(jwtToken)

            return output as StoreCardUpgradeData[]
            } catch (error: any) {
            return error
            }
        }, authorizationBearerSchema
        )


    .get('/api/card-pack/inventory/open', async ({ headers }) => {
            try {
                const authorizationHeader = headers.authorization;
                if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                    throw new Error('Bearer token not found in Authorization header');
                }
                const jwtToken: string = authorizationHeader.substring(7);
    
                const driver: Driver = getDriver();
                const inventoryService: InventoryService = new InventoryService(driver);
                const output = await inventoryService.packInventoryOpen(jwtToken);
    
                return output
                } catch (error: any) {
                return error
                }
            }, authorizationBearerSchema
        )



    .get('/api/card/inventory/group-equipped/:groupName', async ({ headers, params, query }): Promise<CardMetaData[] | undefined> => {
        try {
            const apiKeyHeader: string | undefined = headers['x-api-key'];
            if (!apiKeyHeader) {
                throw new Error('x-api-key header is missing');
            }
    
            const groupName: string = params.groupName;
            const username: string = query.username as string;  // Assuming `username` is passed as a query parameter
    
            const driver: Driver = getDriver();
            const inventoryService: InventoryService = new InventoryService(driver);
            const output: CardMetaData[] | undefined = await inventoryService.openGroupCardEquipped(apiKeyHeader, groupName, username);
    
            return output;
        } catch (error: any) {
            console.log(error);
            throw error
            }
        }, cardGroupSchema
        )
        
        
    .get('/api/chat/items', async ({ headers }) => {
        try {
            const authorizationHeader = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);

            const driver: Driver = getDriver();
            const inventoryService: InventoryService = new InventoryService(driver);
            const output = await inventoryService.getChatItems(jwtToken);

            return output
            } catch (error: any) {
            return error
            }
        }, authorizationBearerSchema
        )



    .get('/api/card/inventory/equip-group/:groupName', async ({ headers, params }): Promise<CardMetaData[] | undefined> => {
            try {
                const authorizationHeader = headers.authorization;
                if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                    throw new Error('Bearer token not found in Authorization header');
                }
                const jwtToken: string = authorizationHeader.substring(7);
        
                const driver: Driver = getDriver();
                const inventoryService: InventoryService = new InventoryService(driver);
                const output: CardMetaData[] | undefined = await inventoryService.equippedGroupCard(jwtToken, params.groupName);

                return output;
            } catch (error: any) {
                throw error
                }
                }
            )

};

export default inventory;
