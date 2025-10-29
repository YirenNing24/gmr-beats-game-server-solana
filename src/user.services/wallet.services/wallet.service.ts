//** THIRDWEB IMPORT * TYPES
import { Engine } from "@thirdweb-dev/engine";



//**  TYPE INTERFACE
import { WalletData } from "../user.service.interface";

//** MEMGRAPH IMPORTS
import { QueryResult } from "neo4j-driver";
import { Driver, Session } from "neo4j-driver-core";
import { Metaplex, keypairIdentity, irysStorage, toBigNumber, SplTokenAmount, Pda } from "@metaplex-foundation/js";

//** ERROR CODES
import ValidationError from '../../outputs/validation.error.js'
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";


export interface CreatedWalletResponse {
  address: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}



class WalletService {
  driver?: Driver;
  constructor(driver?: Driver) {
    this.driver = driver;
  }


  //** Creates a wallet and returns the wallet address.
  // public async createWallet(username: string): Promise<string> {
  //    try {
  //        // Create a new backend wallet with the player's username as the label
  //        const wallet = await engine.backendWallet.create({ label: username, type: "smart:local" });
         
  //        // Extract the wallet address from the response
  //        const { walletAddress } = wallet.result;

  //        return walletAddress;
  //    } catch (error: any) {
  //        console.error("Error creating player wallet:", error);
  //        throw error;
  //    }
  //  }


   public async createWallet(username: string): Promise<string> {
      try {
         const response = await fetch('https://api.thirdweb.com/v1/solana/wallets', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-secret-key': process.env.PROJECT_KEY_THIRDWEB || '',
            },
            body: JSON.stringify({
               label: username,
            })
         });

         const data = await response.json();
         if (!response.ok) {
            throw new Error(data.message || 'Failed to create Solana wallet');
         }

          const { address, label, createdAt, updatedAt } =  data.result as CreatedWalletResponse;

         return address;
      } catch (error: any) {
         console.error("Error creating Solana wallet:", error);
         throw error;
      }
   }


  public async getWalletBalance(walletAddress: string) {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const publicKey = new PublicKey(walletAddress);

      // Native SOL balance (preserve immediately)
      const balanceLamports = await connection.getBalance(publicKey);
      const balanceSol = Number(balanceLamports) / 1_000_000_000;

      // Format native balance: up to 9 decimals, trim trailing zeros
      let nativeBalanceStr = balanceSol.toFixed(9).replace(/\.?0+$/, "");

      // Default SPL APE values
      let apeUiAmount = 0;
      let apeDecimals = 0;

      // Try to fetch token accounts but don't throw to the outer catch.
      try {
        const mintPubkey = new PublicKey("C1MHyoTJpRTeS9AQCyspNVu2EWAYCZwmJ1jNkEArFP1f"); // ape coin
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: mintPubkey
        });

        if (tokenAccounts.value.length > 0) {
          let rawSum = BigInt(0);
          for (const ta of tokenAccounts.value) {
            const tokenAmount = ta.account.data.parsed.info.tokenAmount;
            const amountStr: string = tokenAmount.amount; // raw integer as string
            rawSum += BigInt(amountStr);
            apeDecimals = tokenAmount.decimals;
          }

          // Convert rawSum -> ui amount using decimals
          if (apeDecimals >= 0) {
            const divisor = 10 ** apeDecimals;
            apeUiAmount = Number(rawSum) / divisor;
          }
        }
      } catch (innerErr) {
        // Token account lookup failed — log but continue, native balance still preserved
        console.error("Error fetching SPL token accounts:", innerErr);
        apeUiAmount = 0;
        apeDecimals = 0;
      }

      return {
        smartWalletAddress: walletAddress,
        beatsBalance: "0",
        nativeBalance: nativeBalanceStr,
        apeBalance: apeUiAmount.toString()
      };
    } catch (error: any) {
      console.error("getWalletBalance error:", error);

      // If we fail before fetching native balance we return 0; otherwise outer try would have returned
      return {
        smartWalletAddress: walletAddress,
        beatsBalance: "0",
        nativeBalance: "0",
        apeBalance: "0",
        error: error.message
      };
    }
  }



  // public async getWalletBalance(walletAddress: string) {
  //   try {
  //     const [arbitrumToken, beatsToken] = await Promise.all([
  //       engine.backendWallet.getBalance(CHAIN, walletAddress),
  //       engine.erc20.balanceOf(walletAddress, CHAIN, BEATS_TOKEN)
  //     ]);

  //     return {
  //       smartWalletAddress: walletAddress,
  //       beatsBalance: beatsToken.result.displayValue,
  //       gmrBalance: "0",
  //       nativeBalance: arbitrumToken.result.displayValue,
  //     } as WalletData;
  //   } catch (error: any) {
  //     throw error;
  //   }
  // }





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