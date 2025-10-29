//** MEMGRAPH DRIVER AND TYPES
import { Driver, ManagedTransaction, QueryResult, RecordShape, Session } from "neo4j-driver";

//** RETHINK DB
import rt from "rethinkdb";
// import { getRethinkDB } from "../../db/rethink";


//** VALIDATION ERROR
import ValidationError from "../../outputs/validation.error";

//** IMPORTED SERVICES
import TokenService from "../../user.services/token.services/token.service";

//** CONFIG IMPORT
import { CHAIN, EDITION_ADDRESS, ENGINE_ADMIN_WALLET_ADDRESS } from "../../config/constants";

//** CYPHER IMPORT
import { deductCardpack, openCardpackCypher } from "./gacha.cypher";

//** LUCKY ITEM IMPORT
import luckyItem from 'lucky-item'

//** TYPE INTERFACES
import { CardNameWeight, CardPackRate, PackData } from "./gacha.interface";

//** THIRDWEB IMPORT
import { engine } from "../../user.services/wallet.services/wallet.service";


class GachaService {
    driver: Driver;
    constructor(driver: Driver) {
      this.driver = driver;
  }


//   public async openCardPack(token: string, packData: PackData): Promise<string[]> {
//       try {
//           const tokenService: TokenService = new TokenService();
//           const username: string = await tokenService.verifyAccessToken(token);
  
//           // Assuming you know the pack name or ID key you want to work with
//           const packName: string = Object.keys(packData)[0];

//           const session: Session = this.driver.session();
//           const result: QueryResult<RecordShape> = await session.executeRead((tx: ManagedTransaction) =>
//               tx.run(openCardpackCypher, { username, name: packName })
//           );

//           if (!result || result.records.length === 0) {
//               throw new ValidationError(`no data found`, "");
//           }
  
//           const pack: PackData = result.records[0].get("pack").properties;
//           const walletAddress: string = result.records[0].get("walletAddress");
          
//           const connection: rt.Connection = await getRethinkDB();
//           const query: rt.Cursor = await rt.db('admin')
//               .table('cardPacks')
//               .filter({ packName: pack.name })
//               .run(connection);
  
//           const cardPack: CardPackRate[] = await query.toArray();
//           const cardPackContent = cardPack[0];
  
//           const { cardPackData } = cardPackContent;
          
//           //@ts-ignore
//           const rewardCards: string[] = await this.rollCardPack(cardPackData, walletAddress, username, pack.id);

//            await session.executeRead((tx: ManagedTransaction) =>
//              tx.run(deductCardpack, { username, name: packName })
//          );

//         return rewardCards;
//       } catch (error: any) {
//           console.log(error);
//           throw error;
//       }
//   }
  

//   private async rollCardPack(cardNameWeight: CardNameWeight[], walletAddress: string, username: string, packId: string): Promise<string[]> {
//     try {
//         // Use luckyItem to get the weighted items
//         const cardCount: number = cardNameWeight.length;
//         const weightedItems: CardNameWeight[] = luckyItem.itemsBy(cardNameWeight, 'weight', cardCount);
        
//         // Extract the card names from the weighted items
//         const cardNames: string[] = weightedItems.map(item => item.cardName);

//         // Transfer the reward cards
//         await this.transferRewardCards(cardNames, walletAddress, username, packId);


//         return cardNames;
//     } catch (error: any) {
//         console.error(error);
//         throw error;
//     }
//   }


//   private async transferRewardCards(rewardCards: string[],walletAddress: string, username: string, packId: string): Promise<void> {
// 	const session: Session = this.driver.session();
// 	try {
// 		// Retrieve card details for each reward card
// 		const cardData = await this.getValidRewardCards(session, rewardCards);

// 		if (cardData.length > 0) {
// 			// Transfer each card individually
// 			await Promise.all(
// 				cardData.map(({ id, name }) =>
// 					this.transferCard(id, walletAddress).then(() =>
// 						this.updateTransferredStatus(session, id)
// 					)
// 				)
// 			);

// 			// Update inventory and burn pack
// 			await this.updateInventory(username, cardData.map((c) => c.name), cardData.map((c) => c.id));
// 			await this.burnPack(packId);
// 		} else {
// 			console.log('No valid cards were found to transfer.');
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		throw error;
// 	} finally {
// 		await session.close();
// 	}
//   }

//   private async getValidRewardCards(session: Session, rewardCards: string[]): Promise<Array<{ id: string; name: string }>> {
//         const cardData: Array<{ id: string; name: string }> = [];
//         for (const cardName of rewardCards) {
//             const query = `
//                 MATCH (c:Card)
//                 WHERE c.name = $cardName 
//                 AND (c.transferred = false OR c.transferred IS NULL)
//                 RETURN c
//                 LIMIT 1
//             `;

//             const result = await session.executeRead((tx) =>
//                 tx.run(query, { cardName })
//             );

//             if (result.records.length > 0) {
//                 const card = result.records[0].get('c').properties;
//                 cardData.push({ id: card.id, name: card.name });
//             } else {
//                 console.log(`No valid card found for: ${cardName}`);
//             }
//         }

//         return cardData;
//   }


//   private async transferCard(tokenId: string, walletAddress: string): Promise<void> {
//         const requestBody = { from: ENGINE_ADMIN_WALLET_ADDRESS, to: walletAddress, tokenId, amount: '1'};
//         await engine.erc1155.transferFrom(CHAIN, EDITION_ADDRESS, ENGINE_ADMIN_WALLET_ADDRESS,requestBody);
//   }


//   private async updateTransferredStatus(session: Session, cardId: string): Promise<void> {
//         const updateQuery = `
//             MATCH (c:Card {id: $id})
//             SET c.transferred = true
//         `;

//         await session.run(updateQuery, { id: cardId });
//   }


//   private async burnPack(packId: string): Promise<void> {
// 	const requestBody = { tokenId: packId, amount: '1' };

// 	await engine.erc1155.burn(CHAIN,
// 		EDITION_ADDRESS,
// 		ENGINE_ADMIN_WALLET_ADDRESS,
// 		requestBody
// 	);
//   }


//   private async updateInventory(username: string, cardNames: string[], tokenIds: string[]): Promise<void> {
//     const session: Session = this.driver.session();
//     try {
//         // Query to get the user's current inventory size
//         const query = `
//             MATCH (u:User {username: $username})-[:INVENTORY]->(c:Card)
//             RETURN u, COUNT(c) AS inventoryCurrentSize
//         `;

//         // Execute the query to get the user and inventory size
//         const result: QueryResult<RecordShape> = await session.executeRead((tx: ManagedTransaction) =>
//             tx.run(query, { username })
//         );

//         // Check if the query returned results
//         if (!result || result.records.length === 0) {
//             // If no records are returned, set inventorySize and inventoryCurrentSize to 0
//             const inventorySize = 0;
//             const inventoryCurrentSize = 0;
            
//             // Proceed to create the card relationships
//             await this.createCardRelationship(session, username, cardNames, tokenIds, inventoryCurrentSize, inventorySize);
//             return;
//         }

//         // Extract user data and inventoryCurrentSize from the result
//         const userData = result.records[0].get("u");
//         const inventorySize: number = userData.properties.inventorySize.toNumber();
//         const inventoryCurrentSize: number = result.records[0].get("inventoryCurrentSize").toNumber();

//         // Proceed to create the card relationships
//         await this.createCardRelationship(session, username, cardNames, tokenIds, inventoryCurrentSize, inventorySize);

//     } catch (error: any) {
//         console.error(error);
//         throw error;
//     } finally {
//         await session.close();
//     }
//   }


//   private async createCardRelationship(session: Session, username: string, cardNames: string[], tokenIds: string[], inventoryCurrentSize: number, inventorySize: number): Promise<void> {
//         try {
//             // Prepare the data for the query
//             const cards = cardNames.map((name, i) => ({
//                 name,
//                 tokenId: tokenIds[i]
//             }));

//             // Variable to keep track of available inventory space
//             let remainingInventorySlots = inventorySize - inventoryCurrentSize;

//             // Iterate over the cards and assign the correct relationship based on remaining slots
//             for (let i = 0; i < cards.length; i++) {
//                 const relationship = remainingInventorySlots > 0 ? "INVENTORY" : "BAGGED";

//                 // Generate the Cypher query for each card
//                 const query = `
//                     MATCH (u:User {username: $username}), (c:Card {name: $cardName, id: $tokenId})
//                     SET c.transferred = true
//                     CREATE (u)-[:${relationship}]->(c)
//                 `;

//                 // Execute the query for each card
//                 await session.run(query, {
//                     username,
//                     cardName: cards[i].name,
//                     tokenId: cards[i].tokenId
//                 });

//                 // Decrement remaining inventory slots if the card was added to INVENTORY
//                 if (remainingInventorySlots > 0) {
//                     remainingInventorySlots--;
//                 }
//             }

//         } catch (error: any) {
//             console.error("Error creating relationship:", error);
//             throw error;
//         }
//   }


}

export default GachaService