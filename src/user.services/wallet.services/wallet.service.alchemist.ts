//** THIRDWEB IMPORT * TYPES
import { Engine } from "@thirdweb-dev/engine";

//** CONFIG IMPORT
import { BEATS_TOKEN, ENGINE_ACCESS_TOKEN, ENGINE_URI, CHAIN, ENGINE_ADMIN_WALLET_ADDRESS } from "../../config/constants";

//**  TYPE INTERFACE
import { WalletData } from "../user.service.interface";

//** MEMGRAPH IMPORTS
import { QueryResult } from "neo4j-driver";
import { Driver, Session } from "neo4j-driver-core";


//** ERROR CODES
import ValidationError from '../../outputs/validation.error.js'

import { AlchemyServerSigner, generateAccessKey, SolanaSigner } from "@account-kit/signer";
import { Connection, SystemProgram, PublicKey } from "@solana/web3.js";
import { createServerSigner } from "@account-kit/signer";





export const engine: Engine = new Engine({
  url: ENGINE_URI,
  accessToken: ENGINE_ACCESS_TOKEN,
  
});

class WalletService {
  driver?: Driver;
  constructor(driver?: Driver) {
    this.driver = driver;
  }


  //** Creates a wallet and returns the wallet address.
    public async createWallet(): Promise<{ walletAddress: string, accessKey: string }> {
        try {
            const alchemyApiKey = process.env.ALCHEMY_API_KEY;
            const accessKey: string = generateAccessKey();

            if (!alchemyApiKey || !accessKey) {
                throw new ValidationError(
                    "Missing configuration",
                    "ACCESS_KEY or ALCHEMY_API_KEY is not set in environment"
                );
            }

            const signer: AlchemyServerSigner = await createServerSigner({
                auth: { accessKey },
                connection: { apiKey: alchemyApiKey },
            });


            const solanaSigner: SolanaSigner = signer.toSolanaSigner();
            const walletAddress: string = solanaSigner.address;
            console.log("Created Solana Smart Wallet:", walletAddress);

            return { walletAddress, accessKey };
        } catch (error: any) {
            console.error("createWallet error:", error);
            throw new ValidationError("Wallet creation failed", error.message);
        }
    }

  public async getWalletBalance(walletAddress: string) {
    try {
      const [arbitrumToken, beatsToken] = await Promise.all([
        engine.backendWallet.getBalance(CHAIN, walletAddress),
        engine.erc20.balanceOf(walletAddress, CHAIN, BEATS_TOKEN)
      ]);

      return {
        smartWalletAddress: walletAddress,
        beatsBalance: beatsToken.result.displayValue,
        gmrBalance: "0",
        nativeBalance: arbitrumToken.result.displayValue,
      } as WalletData;
    } catch (error: any) {
      throw error;
    }
  }


  public async getSmartWalletAddress(userName: string): Promise<string> {
    try {
        const session: Session | undefined = this.driver?.session();
        
        // Find the user node within a Read Transaction
        const result: QueryResult | undefined = await session?.executeRead(tx =>
            tx.run('MATCH (u:User {username: $userName}) RETURN u.smartWalletAddress AS smartWalletAddress', { userName })
        );

        await session?.close();
        
        // Verify the user exists
        if (result?.records.length === 0) {
            throw new ValidationError(`User with username '${userName}' not found.`, "");
        }

        // Retrieve the smartWalletAddress
        const smartWalletAddress: string = result?.records[0].get('smartWalletAddress');
        
        return smartWalletAddress;
    } catch (error: any) {
        console.log(error);
        throw error;
    }
  }


  public async getSoul(userName: string): Promise<string> {
    try {
        const session: Session | undefined = this.driver?.session();
        
        // Find the user node within a Read Transaction
        const result: QueryResult | undefined = await session?.executeRead(tx =>
            tx.run('MATCH (u:User {username: $userName}) RETURN u.soul AS soul', { userName })
        );

        await session?.close();
        
        // Verify the user exists
        if (result?.records.length === 0) {
            throw new ValidationError(`User with username '${userName}' not found.`, "");
        }

        // Retrieve the soul
        const soul: string = result?.records[0].get('soul');
        
        return soul;
    } catch (error: any) {
        console.log(error);
        throw error;
    }
  }

}


export default WalletService