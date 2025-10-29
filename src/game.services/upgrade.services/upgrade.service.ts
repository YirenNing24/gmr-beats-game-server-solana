

//** MEMGRAPH DRIVER
import { Driver, QueryResult, Session,  ManagedTransaction, RecordShape } from 'neo4j-driver-core'

//** IMPORTED SERVICES
import TokenService from "../../user.services/token.services/token.service";

//** TYPE INTERFACES
import { CardUpgradeData, CardUpgradeUpdate } from './upgrade.interface';
import { CardMetaData } from '../inventory.services/inventory.interface';

//** CYPHER IMPORT
import { upgradeCardDataCypher } from './upgrade.cypher';

//** VALIDATION ERROR IMPORT
import ValidationError from '../../outputs/validation.error';

//** SUCCESS MESSAGE IMPORT
import { SuccessMessage } from '../../outputs/success.message';
import { StoreCardUpgradeData } from '../store.services/store.interface';

//** IMPORT THIRDWEB
import { Edition, ThirdwebSDK } from '@thirdweb-dev/sdk';
import { CARD_UPGRADE, CHAIN, EDITION_ADDRESS, SECRET_KEY } from '../../config/constants';


class UpgradeService {
    driver: Driver
    constructor(driver: Driver) {
      this.driver = driver
      }

    // public async cardGainExperience(token: string, cardUpgradeData: CardUpgradeData): Promise<SuccessMessage> {
    //     const tokenService: TokenService = new TokenService();
    //     const userName: string = await tokenService.verifyAccessToken(token);
    
    //     try {
    //         const { cardUri, cardUpgrade, cardId } = cardUpgradeData;
    //         const session: Session | undefined = this.driver?.session();
    
    //         let card: CardMetaData | undefined;
    //         const cardUpgradeItem: StoreCardUpgradeData[] = [];
    //         const cardUpgradeUpdate: CardUpgradeUpdate[] = []
    //         // Iterate over each cardUpgrade item
    //         for (const item of cardUpgrade) {
    //             const { uri, id, quantityConsumed } = item;
    
    //             // Use a Read Transaction and only return the necessary properties
    //             const result: QueryResult<RecordShape> | undefined = await session?.executeRead(
    //                 (tx: ManagedTransaction) =>
    //                     tx.run(upgradeCardDataCypher,
    //                         { userName, cardUri, uri, id, cardId, }
    //                     )
    //             );
    
    //             if (result && result.records.length > 0) {
    //                 const record = result.records[0];
    //                 card = record.get("Card").properties;
    //                 const cardUpgrade: StoreCardUpgradeData = record.get("CardUpgrade").properties;
    
    //                 // Subtract quantityConsumed from the quantity property
    //                 const remainingQuantity = cardUpgrade.quantity - quantityConsumed;
    //                 if (remainingQuantity < 0) {
    //                     throw new Error("Quantity consumed exceeds available quantity.");
    //                 }
    //                 cardUpgrade.quantity = remainingQuantity;
    //                 const cardUpgradeItemtoDB = { id, uri, remainingQuantity, quantityConsumed } as CardUpgradeUpdate
    //                 // Multiply the experience by the quantity consumed
    //                 cardUpgrade.experience *= quantityConsumed;
    //                 cardUpgradeUpdate.push(cardUpgradeItemtoDB)
    //                 cardUpgradeItem.push(cardUpgrade);
    //             }
    //         }

    //         if (!card) {
    //             throw new ValidationError("Card not found", "Card not found");
    //         }
    
    //         const { level, experience, id } = card as CardMetaData;
    
    //         // Calculate total experience gained from all card upgrade items
    //         let experienceGain: number = cardUpgradeItem.reduce((total, item) => total + item.experience, 0);
    
    //         // Calculate total card experience by adding the gained experience to the current experience
    //         let cardExperience: number = parseInt(experience) + experienceGain;
    //         let cardLevel: number = parseInt(level);
    
    //         // Calculate the required experience for the current card level
    //         let cardExperienceRequired: number = await this.getRequiredCardExperience(cardLevel);
    
    //         // Continue leveling up until the required experience is met
    //         while (cardExperience >= cardExperienceRequired) {
    //             cardExperience -= cardExperienceRequired;
    //             const levelUp = await this.levelUp(cardLevel);
    //             const { newLevel, requiredExp } = levelUp;
    //             cardLevel = newLevel;
    //             cardExperienceRequired = requiredExp;
    //         }

    //         const stringLevel: string = JSON.stringify(cardLevel);
    //         const stringExperience: string = JSON.stringify(cardExperience);
    //         const newMetadata = { ...card, level: stringLevel, experience: stringExperience};
           
    //         await this.updateCardMetaDataChain(id, newMetadata, cardUpgradeUpdate);
    //         await this.updateCardMetaDataDB(userName, newMetadata);
    //         await this.updateCardUpgradeDB(cardUpgradeUpdate, userName);
            
    //         return new SuccessMessage("Card Upgrade successful");
    //     } catch (error: any) {
    //         throw error;
    //     }
    // }
    
    // private async getRequiredCardExperience(level: number): Promise<number> {
    //     return Math.round(Math.pow(level, 1.8) + level * 4);
    // }

    // private async levelUp(cardLevel : number) {
    //     cardLevel += 1
    //     const requiredExp = await this.getRequiredCardExperience(cardLevel + 1);
    //     return { newLevel: cardLevel, requiredExp }
    // }

    // private async updateCardMetaDataChain(tokenId: string, newMetadata: CardMetaData, cardUpgradeUpdate: CardUpgradeUpdate[]) {
    //     try {
  
    //         // Use the SDK normally
    //         const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
    //             secretKey: SECRET_KEY,
    //         });

    //         const metadata = { newMetadata };
    
    //         // Update metadata using ERC1155 contract
    //         const edition: Edition = await sdk.getContract(EDITION_ADDRESS, "edition");

    //         await edition.erc1155.updateMetadata(tokenId, metadata);
    //         await this.updateCardUpgradeChain(cardUpgradeUpdate);
            
    //     } catch(error: any) {
    //       throw error;
    //     }
    // }

    // private async updateCardMetaDataDB(userName: string, newMetadata: CardMetaData) {
    //     try {
    //         const session: Session | undefined = this.driver?.session();
    //         const { uri, id } = newMetadata;

    //         console.log(uri, id);
    //         await session.executeWrite(tx =>
    //             tx.run(`
    //                 MATCH (u:User {username: $userName})-[:INVENTORY|EQUIPPED]->(c:Card {uri: $uri, id: $id })
    //                 SET c += $newMetadata`, 
    //                 { userName, uri, newMetadata, id }
    //             )
    //         );

    //         await session.close()
    //     } catch(error: any) {
    //       console.error("Error updating card metadata:", error);
    //       throw error;
    //     }
    // }

    // private async updateCardUpgradeChain(cardUpgradeUpdate: CardUpgradeUpdate[]) {
    //     try {
    //         // Use the SDK normally
    //         const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
    //             secretKey: SECRET_KEY,
    //         });
    
    //         // Update metadata using ERC1155 contract
    //         const edition: Edition = await sdk.getContract(CARD_UPGRADE, "edition");
    
    //         for (const update of cardUpgradeUpdate) {
    //             await edition.erc1155.burn(update.id, update.quantityConsumed);
    //         }
    
    //     } catch(error: any) {
    //         console.error("Error occurred during card upgrade:", error);
    //         throw error
    //     }
    // }

    // private async updateCardUpgradeDB(cardUpgradeUpdate: CardUpgradeUpdate[], userName: string) {
    //     try {
    //         const session: Session | undefined = this.driver?.session();
    
    //         for (const update of cardUpgradeUpdate) {
    //             await session.executeWrite(async tx => {
    //                 if (update.remainingQuantity === 0) {
    //                     await tx.run(`
    //                         MATCH (u:User {username: $userName})-[o:OWNED]->(c:CardUpgrade {id: $id})
    //                         DELETE o`, 
    //                         { userName, uri: update.id }
    //                     );
    //                 } else {
    //                     await tx.run(`
    //                         MATCH (u:User {username: $userName})-[:OWNED]->(c:CardUpgrade {id: $id})
    //                         SET c.quantity = $remainingQuantity`, 
    //                         { userName, id: update.id, remainingQuantity: update.remainingQuantity }
    //                     );
    //                 }
    //             });
    //         }
    
    //     } catch(error: any) {
    //         throw error;
    //     }
    // }
    



    
    
    
    

}

export default UpgradeService