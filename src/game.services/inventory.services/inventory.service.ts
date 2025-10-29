//** MEMGRAPH DRIVER AND TYPES
import { Driver, ManagedTransaction, QueryResult, RecordShape, Session } from "neo4j-driver";

//** IMPORTED SERVICES
import TokenService from "../../user.services/token.services/token.service";
import WalletService, { engine } from "../../user.services/wallet.services/wallet.service";

//** TYPE INTERFACES
import { CardMetaData, EquippedItemsInv, InventoryCardData , InventoryCards, UpdateData, UpdateInventoryData } from "./inventory.interface";
import { checkInventorySizeCypher, openCardUpgradeCypher, unequipItemCypher } from "./inventory.cypher";
import { StoreCardUpgradeData } from "../store.services/store.interface";

//** IMPORTED OUTPUTS
import { SuccessMessage } from "../../outputs/success.message";

//** CONFIG IMPORTS
import { CARD_UPGRADE, CHAIN, EDITION_ADDRESS } from "../../config/constants";


//** INVENTORY SERVICE CLASS
class InventoryService {
    driver?: Driver;
    constructor(driver?: Driver) {
    this.driver = driver;
    }

    

    // Retrieves inventory card data for a user based on the provided access token.
    public async cardInventoryOpen(token: string): Promise<InventoryCards> {
        try {
            const tokenService: TokenService = new TokenService();
    
            const userName: string = await tokenService.verifyAccessToken(token);
            const { smartWalletAddress, inventoryData } = await this.getInventoryData(userName);

            const ownedCards: InventoryCardData[] = await this.getOwnedCards(smartWalletAddress);
            const equipped: InventoryCardData[] = await this.getEquippedItems(inventoryData, ownedCards);

            const categorizedCards = this.categorizeCards(ownedCards, equipped);

            return categorizedCards
        } catch (error: any) {
            console.error("Error opening user inventory:", error);
            throw error;
        }
    }
    // Retrieves inventory card data for a user based on the provided access token.
    private async getInventoryData(userName: string) {
        const session: Session | undefined = this.driver?.session();
    
        const result: QueryResult | undefined = await session?.executeRead(tx =>
            tx.run(
                `
                MATCH (u:User {username: $userName})-[:INVENTORY]->(x:X_IN)
                MATCH (u)-[:INVENTORY]->(g:GREATGUYS)
                MATCH (u)-[:INVENTORY]->(i:ICU)
                MATCH (u)-[:INVENTORY]->(r:IROHM)
                RETURN x, g, i, r, u.smartWalletAddress as smartWalletAddress
                `,
                { userName }
            )
        );
    
        await session?.close();
    
        if (!result || result.records.length === 0) {
            return { smartWalletAddress: "", inventoryData: {} };
        }
    
        const smartWalletAddress: string = result.records[0].get("smartWalletAddress") || "";

        const xinInventoryData: UpdateData = result.records[0].get("x").properties;
        const greatGuysInventoryData: UpdateData  = result.records[0].get("g").properties;
        const icuInventoryData: UpdateData  = result.records[0].get("i").properties;
        const irohmInventoryData: UpdateData  = result.records[0].get("r").properties;

        const inventoryData = { xinInventoryData, greatGuysInventoryData, icuInventoryData, irohmInventoryData };

        return { smartWalletAddress, inventoryData };
    }
    
    // Helper method to get equipped items
    private async getEquippedItems(inventoryData: Record<string, any>, ownedCards: InventoryCardData[]): Promise<InventoryCardData[]> {
        let equippedCards: InventoryCardData[] = [];
    
        // Iterate through groups in inventoryData
        for (const groupKey of Object.keys(inventoryData)) {
            const group = inventoryData[groupKey];
    
            // Iterate through items in each group
            for (const itemKey of Object.keys(group)) {
                const inventoryItem = group[itemKey];
    
                // Skip items without a valid slot
                if (!inventoryItem.slot || inventoryItem.slot === "") {
                    continue;
                }
    
                // Compare equipped inventory items with owned cards
                const matchedCard = ownedCards.find(card => {
                    const metadata = card.metadata;
    
                    // Match based on `id` in `ownedCards` and `tokenId` in `inventoryItem`
                    return metadata.id === inventoryItem.tokenId &&
                        metadata.contractAddress === inventoryItem.contractAddress;
                });
    
                // If a match is found, push it to the equippedCards array
                if (matchedCard) {
                    equippedCards.push(matchedCard); // Push the entire card object
                }
            }
        }

        return equippedCards;
    }
    
    
    

    // Helper method to fetch owned cards
    private async getOwnedCards(smartWalletAddress: string): Promise<InventoryCardData[]> {
        const ownedCards = (await engine.erc1155.getOwned(smartWalletAddress, CHAIN, EDITION_ADDRESS))
            .result as unknown as InventoryCardData[];
    
        // Add contractAddress to each card
        ownedCards.forEach(card => {
            card.metadata.contractAddress = EDITION_ADDRESS;
        });
    
        return ownedCards;
    }
    
    // Helper method to categorize cards
    private categorizeCards(ownedCards: InventoryCardData[], equippedCards: InventoryCardData[]): InventoryCards {
        // Arrays to store categorized cards
        let ownedAndInventory: InventoryCardData[] = [];
        let ownedAndEquipped: InventoryCardData[] = [];
    
        // Get equipped card IDs for comparison
        const equippedIds: Set<string> = new Set(
            equippedCards.map(card => card.metadata.id) // Use `metadata.id`, not `tokenId`
        );
    
        // Categorize each owned card
        ownedCards.forEach(card => {
            const metadata = card.metadata; // Directly access metadata
            const cardId = metadata.id; // Ensure correct property
    
            // Check if the card is equipped
            if (equippedIds.has(cardId)) {
                // Add to equipped array
                ownedAndEquipped.push(card);
            } else {
                // Add to inventory array
                ownedAndInventory.push(card);
            }
        });
    
        return [ownedAndInventory, ownedAndEquipped];
    }
    
    
    
    
    // Updates inventory data for a user based on the provided access token and update information.
    public async equipItem(token: string, updateInventoryData: UpdateInventoryData[]): Promise<SuccessMessage> {
        try {
            const walletService: WalletService = new WalletService(this.driver);
            const tokenService: TokenService = new TokenService();

            const userName: string = await tokenService.verifyAccessToken(token);
            const smartWalletAddress: string = await walletService.getSmartWalletAddress(userName);

            // Iterate over each item in the updateInventoryData array
            for (const item of updateInventoryData) {
                const { group, contractAddress, tokenId, slot, uri, name } = item;
                const nftInventory = await this.getInventoryNFT(smartWalletAddress, contractAddress);


                // Check if the item is in inventory using the utility function
                //@ts-ignore
                const isInInventory: boolean = await this.isItemInInventory(nftInventory, tokenId, group, uri, slot, name
                );
                
    
                // If a match is not found, throw an error
                if (!isInInventory) {
                    throw new Error(`Item with tokenId ${tokenId}, group ${group}, and uri ${uri} is not in the inventory`);
                }
    
                await this.updateInventoryDB(group, userName, slot, {
                    uri,
                    tokenId,
                    contractAddress,
                    group,
                    slot,
                    name
                });

            }
    
            // Return success message
            return new SuccessMessage("Inventory update successful");
        } catch (error: any) {
            console.error("Error updating inventory:", error);
            throw error;
        }
    }


    // Utility function to check if an item is in the inventory
    private async isItemInInventory(
        nftInventory: Array<{ metadata: { id: string; group: string; uri: string; slot: string; name: string } }>,
        tokenId: string,
        group: string,
        uri: string,
        slot: string,
        name: string
    ): Promise<boolean> {
        // Normalize slot (remove spaces)
        const normalizedSlot = slot.replace(/\s+/g, "");
    
        return nftInventory.some((nft) => {
            // Normalize slot for NFT metadata
            const nftSlot = nft.metadata.slot.replace(/\s+/g, "");
    
            return (
                nft.metadata.id === tokenId &&
                nft.metadata.group === group &&
                nft.metadata.uri === uri &&
                nftSlot === normalizedSlot &&
                nft.metadata.name === name
            );
        });
    }
    
    
    // Retrieves inventory card data for a user based on the provided access token.
    private async getInventoryNFT(username: string, contractAddress: string) {
        try {

            const nftInventory = await engine.erc1155.getOwned(username, CHAIN, contractAddress);
            return nftInventory.result;

        } catch(error: any) {
            console.error("Error retrieving NFT Inventory:", error);
            throw error;
        }
    }


    // Updates the inventory database with the provided update data.
    private async updateInventoryDB(groupName: string, username: string, slot: string, updateData: UpdateInventoryData): Promise<void> {
        const session: Session | undefined = this.driver?.session();
        try {
            // Normalize group name
            let group: string = this.formatGroupName(groupName);

            // Fetch the inventory node for the group
            const result: QueryResult | undefined = await session?.executeWrite((tx: ManagedTransaction) =>
                tx.run(
                    `MATCH (u:User {username: $username})-[:INVENTORY]->(i:${group})
                     RETURN i`,
                    { username }
                )
            );
    
            if (!result || result.records.length === 0) {
                throw new Error(`Inventory for group ${groupName} not found for user ${username}`);
            }
    
            // Execute the update query
            await session?.executeWrite((tx: ManagedTransaction) =>
                tx.run(
                    `MATCH (u:User {username: $username})-[:INVENTORY]->(i:${group})
                     SET i.${slot} = $updateData`,
                    { username, updateData }
                )
            );
    
            await session?.close();
        } catch (error: any) {
            console.error("Error updating inventory in database:", error);
            throw error;
        }
    }
    


    public async unequipItem(token: string, updateInventoryData: UpdateInventoryData[]): Promise<SuccessMessage> {
        let session: Session | undefined;
        try {
            const tokenService: TokenService = new TokenService();
            const userName: string = await tokenService.verifyAccessToken(token);
    
            session = this.driver?.session();
    
            for (const item of updateInventoryData) {
                let { group, slot } = item;
                
                // Normalize group names
                let groupName: string = this.formatGroupName(group);

                // Update the inventory node to unequip the specified slot
                await session?.executeWrite(tx =>
                    tx.run(
                        `
                        MATCH (u:User {username: $userName})-[:INVENTORY]->(i:${groupName})
                        SET i.${slot} = {uri: "", tokenId: "", contractAddress: "", group: "", slot: "", name: ""}
                        RETURN i
                        `,
                        { userName }
                    )
                );
            }
    
            return new SuccessMessage("Equip removed");
        } catch (error: any) {
            console.error("Error removing equipped items:", error);
            throw error;
        } finally {
            await session?.close(); // Ensures session is closed properly
        }
    }
    
    
    

    // Retrieves inventory card data for a user based on the provided access token.
    public async upgradeInventoryOpen(token: string): Promise<StoreCardUpgradeData[]> {
      try {
        const tokenService: TokenService = new TokenService();
    
        const userName: string = await tokenService.verifyAccessToken(token);
        const { smartWalletAddress } = await this.getInventoryData(userName);
        const cardUpgrades: StoreCardUpgradeData[] = await this.getOwnedCardUpgrades(smartWalletAddress)

        return cardUpgrades
      } catch (error: any) {
        console.error("Error opening user inventory:", error);
        throw error;
      }
    }


    private async getOwnedCardUpgrades(smartWalletAddress: string): Promise<StoreCardUpgradeData[]> {
        const ownedCardUpgrades = (await engine.erc1155.getOwned(smartWalletAddress, CHAIN, CARD_UPGRADE))
            .result as unknown as StoreCardUpgradeData[];
    
        // Add contractAddress to each card
        ownedCardUpgrades.forEach(cardUpgrade => {
            cardUpgrade.editionAddress = CARD_UPGRADE;
        });
    
        return ownedCardUpgrades;
    }
    



    // Check the remaining inventory size for a user based on the provided username.
    public async checkInventorySize(userName: string): Promise<number | undefined> {
      try {
          const session: Session | undefined = this.driver?.session();
  
          // Use a Read Transaction and only return the necessary properties
          const result: QueryResult<RecordShape> | undefined = await session?.executeRead(
              (tx: ManagedTransaction) =>
                  tx.run(checkInventorySizeCypher, {
                      userName
                  })
          );
  
          await session?.close();
  
          // If no records found, return undefined
          if (!result || result.records.length === 0) {
              return undefined;
          }
  
          // Extract the remaining inventory size from the result
          const remainingSize: number = result.records[0].get("remainingSize");
  
          return remainingSize as number
      } catch (error: any) {
          console.error("Error checking inventory size:", error);
          throw error;
      }
    }




    // Retrieves inventory card data for a user based on the provided access token.
    public async packInventoryOpen(token: string) {
        try {
            const tokenService: TokenService = new TokenService();
            const userName: string = await tokenService.verifyAccessToken(token);
    
            const session: Session | undefined = this.driver?.session();
    
            // Use a Read Transaction and only return the necessary properties
            const result: QueryResult<RecordShape> | undefined = await session?.executeRead(
                (tx: ManagedTransaction) =>
                    tx.run(
                        `MATCH (u:User {username: $userName})-[:OWNED]->(p:Pack)
                         WHERE p.quantity > 0
                         RETURN p.name as name, p as packProperties`,
                        { userName }
                    )
            );
    
            await session?.close();
    
            // If no records found, return empty arrays
            if (!result || result.records.length === 0) {
                return [];
            }
    
            // Create an object to store card packs
            const cardPacks: { [uri: string]: Record<string, any> } = {};
    
            // Iterate over the result records
            result.records.forEach((record) => {
                const packUri: string | undefined = record.get("name");
                const packProperties: Record<string, any> = record.get("packProperties")?.properties;
    
                if (packUri && packProperties) {
                    // Extract the quantity if it exists
                    if (packProperties.quantity && typeof packProperties.quantity === 'object') {
                        packProperties.quantity = packProperties.quantity.toNumber();
                    }
    
                    cardPacks[packUri] = packProperties;
                }
            });
    
            // Return the card packs object inside an array
            return [cardPacks];
        } catch (error: any) {
            console.error("Error opening user inventory:", error);
            throw error;
        }
    }


    // Updates inventory data for a user based on the provided access token and update information.
    public async getChatItems(token: string): Promise<{ loudspeaker: { quantity: number } }> {
        let session: Session | undefined;
        try {
            const tokenService: TokenService = new TokenService();
            const username: string = await tokenService.verifyAccessToken(token);
    
            session = this.driver?.session();
            const result: QueryResult | undefined = await session?.executeRead((tx: ManagedTransaction) =>
                tx.run(
                    `
                    MATCH (u:User {username: $username})-[:OWNED]->(l:LoudSpeaker)
                    RETURN l.quantity as quantity
                    `,
                    { username }
                )
            );
    
            // Process the result and return the chat items
            if (!result || result.records.length === 0) {
                // Handle the case where no data is found
                return { loudspeaker: { quantity: 0 } };
            }
    
            // Extract the returned data from the records
            const quantity: number = result.records[0].get("quantity").toNumber();
            return { loudspeaker: { quantity } };
    
        } catch (error: any) {
            // Handle errors appropriately
            throw error;
        } finally {
            // Ensure the session is properly closed
            if (session) {
                await session.close();
            }
        }
    }
    

    // Updates inventory data for a user based on the provided access token and update information.
    public async openGroupCardEquipped(apiKey: string, groupName: string, username: string) {
        try {
            const tokenService = new TokenService();
            const isAuthorized = await tokenService.verifyApiKey(apiKey);
    
            if (!isAuthorized) {
                throw new Error("Unauthorized API Key");
            }
    
            const session = this.driver?.session();
            if (!session) {
                throw new Error("Database session could not be established.");
            }
    
            // Handle cases where group names need formatting
            const group: string = this.formatGroupName(groupName);

            console.log("card group log: ", group)
    
            const result = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(
                    `
                    MATCH (u:User {username: $username})-[:INVENTORY]->(i:${group})
                    RETURN i, u.smartWalletAddress as smartWalletAddress
                    `,
                    { username }
                )
            );
            
            await session.close();
    
            if (!result || result.records.length === 0) {
                return []
            }
    
            const smartWalletAddress: string = result.records[0].get("smartWalletAddress") || "";
    
            // Extract equipped card metadata (inventory is stored inside `properties`)
            const equippedInventory = result.records[0].get("i").properties; // ✅ Extract properties
    
            if (!equippedInventory) {
                throw new Error("Equipped inventory data is missing.");
            }
    
            // Extract values from the equipped inventory object
            const equippedCards = Object.values(equippedInventory)
                .filter((item: any) => item.tokenId && item.tokenId.trim() !== ""); // Ensure tokenId is not empty
    
    
            // Fetch user's owned and equipped NFT cards
            const ownedAndEquipped = await this.getInventoryNFT(smartWalletAddress, EDITION_ADDRESS);
    
    
            // Match equipped cards with owned cards
            const matchedCards = equippedCards
                .map((equipped: any) => {
                    const matchedCard = ownedAndEquipped.find((card) => card.metadata.id === equipped.tokenId);
                    if (matchedCard) {
                        return {
                            name: matchedCard.metadata.name,
                            scoreBoost: matchedCard.metadata.scoreboost, // Ensure correct field name
                        };
                    }
                    return null;
                })
                .filter((card): card is { name: string; scoreBoost: string } => card !== null);
    
            return matchedCards;
        } catch (error) {
            console.error("Error fetching equipped cards:", error);
            throw error;
        }
    }
    
    
    // Updates inventory data for a user based on the provided access token and update information.
    public async equippedGroupCard(token: string, groupName: string) {
        const session = this.driver?.session();
        try {
            const tokenService: TokenService = new TokenService();
            const username: string = await tokenService.verifyAccessToken(token);

            if (!session) {
                throw new Error("Database session could not be established.");
            }
    
            // Handle cases where group names need formatting
            const group: string = this.formatGroupName(groupName);

    
            const result = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(
                    `
                    MATCH (u:User {username: $username})-[:INVENTORY]->(i:${group})
                    RETURN i, u.smartWalletAddress as smartWalletAddress
                    `,
                    { username }
                )
            );
    
            if (!result || result.records.length === 0) {
                return [];
            }
    
            // Extracting equipped card metadata from the inventory node
            const equippedCards = result.records.map((record) => record.get("i").properties);
    
            return equippedCards;
        } catch (error: any) {
            console.error(error);
            throw error;
        } finally {
            // Ensure the session is always closed to prevent memory leaks
            await session?.close();
        }
    }


    private formatGroupName(groupName: string): string {
		const groupMap: Record<string, string> = {
			"X:IN": "X_IN",
			"Great Guys": "GREATGUYS",
            "I-ROHM": "IROHM"
		};

		// Return formatted group name or default to the original name
		return groupMap[groupName] || groupName;
	}
    






}
  

export default InventoryService;