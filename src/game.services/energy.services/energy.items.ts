//** MEMGRAPH IMPORT
import { Driver, ManagedTransaction, QueryResult, Session } from "neo4j-driver-core";

//** KEYDB IMPORTS
import keydb from "../../db/keydb.client";

//** SERVICE IMPORT
import TokenService from "../../user.services/token.services/token.service"
import WalletService, { engine } from "../../user.services/wallet.services/wallet.service";
import { getDriver } from "../../db/memgraph";
import { CHAIN, MISCELLANEOUS_ITEMS_CONTRACT } from "../../config/constants";
import ValidationError from "../../outputs/validation.error";
import { SuccessMessage } from "../../outputs/success.message";
import EnergyService from "./energy.service";
import { EnergyBottleMetadata, EnergyBottleNFT } from "./energy.interface";



class EnergyItemsService {
  private driver?: Driver;

	constructor(driver?: Driver) {
		this.driver = driver;
	}

    public async rechargeEnergy(token: string) {
      const driver: Driver = getDriver();
        const tokenSerivce: TokenService = new TokenService();
        const walletService: WalletService = new WalletService(driver);
        
        try {

          const username: string = await tokenSerivce.verifyAccessToken(token);
          const smartWalletAddress: string = await walletService.getSmartWalletAddress(username);
          await this.checkEnergyItem(smartWalletAddress);
          await this.addEnergy(username);
          
          return new SuccessMessage("Energy recharged successfully");
        } catch(error: any) {
          console.log(error)
          throw error
        }
     }


    private async checkEnergyItem(smartWalletAddress: string) {
      try {
          const { result: ownedEnergyItems } = await engine.erc1155.getOwned(
              smartWalletAddress,
              CHAIN,
              MISCELLANEOUS_ITEMS_CONTRACT
          );
  
          const energyItem = ownedEnergyItems.find(item => item.metadata.id === "0");
  
          if (!energyItem || BigInt(energyItem.quantityOwned ?? "0") < 1n) {
            throw new ValidationError("No energy items owned", "No energy items owned");
        }
  
        await this.useEnergyItem(smartWalletAddress);
      } catch (error: any) {
          console.error("Error checking energy item:", error);
          throw error
      }
     }


     private async useEnergyItem(smartWalletAddress: string) {
      try {
        const maxRetries = 3; // Max retries for burning
        const retryDelay = 1000; // 1-second delay between retries
    
        const requestBody = { tokenId: "0", amount: "1" };
    
        let transaction;
        let burnRetries = maxRetries;
    
        // Retry mechanism for burning the item
        while (burnRetries > 0) {
          try {
            transaction = await engine.erc1155.burn(CHAIN, MISCELLANEOUS_ITEMS_CONTRACT, smartWalletAddress, requestBody);
            break; // Break if successful
          } catch (error: any) {
            console.error("Error burning energy item: ", error);
            burnRetries--;
            if (burnRetries === 0) {
              throw new Error("Failed to burn energy item after multiple attempts.");
            }
            await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before retrying
          }
        }
    

        
      } catch (error: any) {
        console.error("Error in useEnergyItem:", error);
        throw error;
      }
    }
    


    private async addEnergy(username: string) {
      try {
        const driver: Driver = getDriver();
        const energyService: EnergyService = new EnergyService(driver);
        const BASE_MAX_ENERGY: number = 15;
	
        const playerLevel: number = await energyService.getMaxEnergy(username);
        const MAX_ENERGY: number = BASE_MAX_ENERGY + playerLevel;

        await keydb.HSET(`player:${username}`, {
          currentEnergy: MAX_ENERGY,
          lastEnergyUpdate: Date.now()
        });

      } catch(error: any) {
        console.log(error)
        throw error
      }
     }


     public async getEnergyDrinks(token: string): Promise<EnergyBottleNFT[]> {
      const tokenService: TokenService = new TokenService();
      const driver = getDriver();
      const walletService: WalletService = new WalletService(driver);
    
      try {
        const username: string = await tokenService.verifyAccessToken(token);
        const smartWalletAddress: string = await walletService.getSmartWalletAddress(username);
    
        // Fetch owned energy bottles
        const energyBottlesBasic = (await engine.erc1155.getOwned(smartWalletAddress, CHAIN, MISCELLANEOUS_ITEMS_CONTRACT)).result;
    
        // Find energy bottle with metadata id "0"
        const energyBottle = energyBottlesBasic.find(
          (item) => item.metadata.id === "0"
        ) as unknown as EnergyBottleNFT;
    
        // If no energy bottle or insufficient quantity
        if (!energyBottle || BigInt(energyBottle.quantityOwned ?? "0") < 1n) {
          const energyBottleBasic: EnergyBottleMetadata = {
            name: "Basic Energy Bottle",
            description: "A basic energy bottle that recharges 5 energy points.",
            rechargeAmount: "5",
            tier: "Basic",
          };
    
          const energyBottleNFT: EnergyBottleNFT = {
            metadata: energyBottleBasic,
            owner: smartWalletAddress,
            type: "ERC1155",
            supply: "1",
            quantityOwned: "0",
          };
    
          return [energyBottleNFT];
        }
    
        // Return existing energy bottle
        return [energyBottle];
    
      } catch (error: any) {
        console.error("Error fetching energy bottles:", error);
        throw error;
      }
     }
    
}

export default EnergyItemsService