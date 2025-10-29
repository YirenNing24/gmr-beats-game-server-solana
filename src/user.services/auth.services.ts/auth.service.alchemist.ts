//**TODO SPACE IN LAST NAME SHOULD BE ALLOWED */
//**TODO SERVER VALIDATE REGISTRATION */
//**TODO ADD USERID CONSTRAINT
//**TODO ADD EMAIL IN THE CONSTRAINT */


//** CONFIGS IMPORT
import { SALT_ROUNDS } from '../../config/constants.js'

//** BCRYPT IMPORT
import { hash, compare } from 'bcrypt-ts'
import crypto from "crypto";

//** ERROR CODES
import ValidationError from '../../outputs/validation.error.js'

//** NEW ACCOUNT DEFAULT VALUES
import { playerStats } from '../../noobs/noobs.js'

//**  IMPORTED SERVICES
import WalletService from '../wallet.services/wallet.service.alchemist.js';
import TokenService from '../token.services/token.service.js'
import EnergyService from '../../game.services/energy.services/energy.service.js'

//** UUID GENERATOR
import { nanoid } from "nanoid"

//** MEMGRAPH DRIVER
import { Driver, QueryResult, Session,  ManagedTransaction } from 'neo4j-driver-core'

//** TYPE INTERFACES
import { WalletData, UserData, ValidateSessionReturn, AuthenticateReturn, TokenScheme, User, Suspended, PreRegisterUser, PasskeyUser, PasskeyUserData } from '../user.service.interface.js'

//** GEO IP IMPORT
import geoip from 'geoip-lite2'

import { inventoryCypher } from './auth.cypher.js'

const ALGORITHM = "aes-256-gcm";

class AuthService {

  driver?: Driver
  constructor(driver?: Driver) {
    this.driver = driver
    };

    //Pre-register
    // public async preRegister(userData: PreRegisterUser, ipAddress: string): Promise<void> {
    //   const walletService: WalletService = new WalletService();
    
    //   const userId: string = nanoid();
    //   const { userName, password, email } = userData as User;

    //   //@ts-ignore
    //   const encrypted: string = await hash(password, parseInt(SALT_ROUNDS));
    
    //   const signupDate: number = Date.now();
    //   const suspended: Suspended = { until: null, reason: "" };
    
    //   const geo = geoip.lookup(ipAddress);
    //   const country: string | undefined = geo?.country || "SOKOR";
    //   const smartWallet = await walletService.createWallet();
    //   const { walletAddress, accessKey  } = smartWallet

    //   const session: Session | undefined = this.driver?.session();
    
    //   try {
    //     await session?.executeWrite(
    //       (tx: ManagedTransaction) =>
    //         tx.run(
    //           `
    //           CREATE (u:User {
    //              signupDate: $signupDate,
    //              accountType: "beats",
    //              userId: $userId,
    //              username: $userName,
    //              password: $encrypted,
    //              email: $email,
    //              smartWalletAddress: $walletAddress,
    //              playerStats: $playerStats,
    //              suspended: $suspended,
    //              country: $country,
    //              deviceId: $deviceId,
    //              inventorySize: 200
    //           })

    //           ${inventoryCypher}
    //           `,
    //           { signupDate, userId, userName, encrypted, walletAddress, playerStats, suspended, country, email }
    //         )
    //     );
    //   } catch (error: any) {
    //     // Handle unique constraints in the database
    //     if (error.code === "Neo.ClientError.Schema.ConstraintValidationFailed") {
    //       if (error.message.includes("username")) {
    //         throw new ValidationError(
    //           `An account already exists with the username ${userName}`,
    //           `Username ${userName} already taken`
    //         );
    //       }
    //     }
    //     throw error;
    //   } finally {
    //     await session?.close();
    //   }
    // }


    // Registers a user.
    public async register(userData: User, ipAddress: string): Promise<void> {
      const walletService = new WalletService();
      const userId = nanoid();
      const { userName, password, deviceId } = userData;
  
      const signupDate = Date.now();
      const suspended: Suspended = { until: null, reason: "" };
      const country = geoip.lookup(ipAddress)?.country || "SOKOR";
  
      // Run bcrypt hashing and wallet creation in parallel
      const [encrypted, locKey, smartWalletAddress] = await Promise.all([
          hash(password, 8), // Reduced salt rounds for performance
          hash(userName, 8),
          walletService.createWallet()
      ]);

      const { accessKey, walletAddress } = smartWalletAddress
      const encryptedAccessKey: string = encrypt(accessKey);
  
      const session = this.driver?.session();
      if (!session) throw new Error("Database session not available");
  
      try {
          await session.run(
              `
              CREATE (u:User {
                  signupDate: $signupDate,
                  accountType: "beats",
                  userId: $userId,
                  username: $userName,
                  smartWalletAddress: $walletAddress,
                  password: $encrypted,
                  accessKey: $encryptedAccessKey,
                  playerStats: $playerStats,
                  suspended: $suspended,
                  country: $country,
                  deviceId: $deviceId,
                  inventorySize: 200,
                  soul: "",
                  preferredServer: ""
              })
              ${inventoryCypher}
              `,
              { signupDate, userId, userName, encrypted, locKey, walletAddress, encryptedAccessKey, playerStats, suspended, country, deviceId }
          );
      } catch (error: any) {
          console.error("Error in register:", error);
  
          if (error.code === "Neo.ClientError.Schema.ConstraintValidationFailed" && error.message.includes("username")) {
              throw new ValidationError(`An account already exists with the username ${userName}`, "Username already taken");
          }
  
          throw error;
      } finally {
          await session.close();
      }
    }
  


    // Authenticates a user with the provided username and unencrypted password.
    public async authenticate(userName: string, unencryptedPassword: string): Promise<AuthenticateReturn> {
      const walletService: WalletService = new WalletService();
      const tokenService: TokenService = new TokenService();
      const energyService: EnergyService = new EnergyService();

      try {
          const session: Session | undefined = this.driver?.session();
          // Find the user node within a Read Transaction
          const result: QueryResult | undefined = await session?.executeRead(tx =>
              tx.run('MATCH (u:User {username: $userName}) RETURN u', { userName })
          );

          await session?.close();
          // Verify the user exists
          if (result?.records.length === 0) {
              throw new ValidationError(`User with username '${userName}' not found.`, "");
          }

          // Compare Passwords
          const user: UserData = result?.records[0].get('u');
          const encryptedPassword: string = user.properties.password;
          const correct: boolean = await compare(unencryptedPassword, encryptedPassword);
          if (!correct) {
              throw new ValidationError('Incorrect password.', "Incorrect password");
          }

          // Return User Details
          const { password, smartWalletAddress, playerStats, userId, username, ...safeProperties } = user.properties

          const walletPromise: Promise<WalletData> = walletService.getWalletBalance(smartWalletAddress);
          const [ wallet ] = await Promise.all([ walletPromise ]);

          const tokens: TokenScheme = await tokenService.generateTokens(userName);
          const { refreshToken, accessToken } = tokens as TokenScheme


          const energy = await energyService.getPlayerEnergyBeats(userName);
          
          return {
              username,
              wallet,
              safeProperties,
              playerStats,
              energy,
              uuid: userId,
              refreshToken,
              accessToken,
              message: 'You are now logged in',
              success: 'OK',
              loginType: 'beats',
  

          } as AuthenticateReturn
      } catch (error: any) {
          console.log(error)
          throw error;
      }
    }



    public async passkeyRegister(userData: PasskeyUser, ipAddress: string = "") {
      const walletService = new WalletService();
      const userId = nanoid();
      const signupDate = Date.now();
      const suspended: Suspended = { until: null, reason: "" };
      const { userName, deviceId = "debug", id, publicKey, counter } = userData;
      const country = geoip.lookup(ipAddress)?.country || "SOKOR";
  
      // Run hashing and wallet creation in parallel
      const [locKey, smartWalletAddress] = await Promise.all([
          hash(userName, 8), // Reduced salt rounds for performance
          walletService.createWallet()
      ]);

      const { accessKey, walletAddress } = smartWalletAddress
      const encryptedAccessKey: string = encrypt(accessKey);
  
      const session = this.driver?.session();
      if (!session) throw new Error("Database session not available");
  
      try {
          await session.run(
              `
              CREATE (u:User {
                  signupDate: $signupDate,
                  accountType: "passkey",
                  userId: $userId,
                  username: $userName,
                  locKey: $locKey,
                  smartWalletAddress: $walletAddress,
                  accessKey: $encryptedAccessKey,
                  playerStats: $playerStats,
                  suspended: $suspended,
                  country: $country,
                  deviceId: $deviceId,
                  passKeyId: $id,
                  publicKey: $publicKey,
                  counter: $counter,
                  inventorySize: 200,
                  soul: "",
                  preferredServer: ""
              })
              ${inventoryCypher}
              `,
              { signupDate, userId, userName, locKey, walletAddress, playerStats, suspended, country, deviceId, id, publicKey, counter, encryptedAccessKey }
          );
      } catch (error: any) {
          console.error("Error in passkeyRegister:", error);
  
          if (error.code === "Neo.ClientError.Schema.ConstraintValidationFailed" && error.message.includes("username")) {
              throw new ValidationError(`An account already exists with the username ${userName}`, "Username already taken");
          }
  
          throw error;
      } finally {
          await session.close();
      }
    }
  


    public async getPasskeyUserData(userName: string) {
      try {
          const session: Session | undefined = this.driver?.session();
          // Find the user node within a Read Transaction
          const result: QueryResult | undefined = await session?.executeRead(tx =>
              tx.run('MATCH (u:User {username: $userName}) RETURN u', { userName })
          );

          await session?.close();
          // Verify the user exists
          if (result?.records.length === 0) {
              throw new ValidationError(`User with username '${userName}' not found.`, "");
          }

          // Compare Passwords
          const user: PasskeyUserData = result?.records[0].get('u');
          const {  ...safeProperties } = user.properties
          const { publicKey, counter,  } = user.properties

          // Return User Details

          return { publicKey, counter, safeProperties }
      } catch (error: any) {
          console.log(error)
          throw error;
      }
    }
    

    public async validateSession(token: string): Promise<ValidateSessionReturn | null> { {
          try {
            // Create a new instance of the needed services class
            const walletService: WalletService = new WalletService();
            const tokenService: TokenService = new TokenService();
            const energyService: EnergyService = new EnergyService();

      
            const accessRefresh: TokenScheme = await tokenService.verifyRefreshToken(token);

            const { userName, accessToken, refreshToken  } = accessRefresh as  TokenScheme;
      
            // Open a new session
            const session:Session | undefined = this.driver?.session();
            const result :QueryResult | undefined = await session?.executeRead(tx =>
              tx.run(`MATCH (u:User {username: $userName}) RETURN u`, { userName })
            );
      
            // Close the session
            await session?.close();
            // Verify the user exists
            if (result?.records.length === 0) {
              throw new ValidationError(`User with username '${userName}' not found.`, "");
            }
            
            const userData: UserData = result?.records[0].get('u');
            const { smartWalletAddress, playerStats, password, userId, username, ...safeProperties } = userData.properties;
            
            // Import the user's smart wallet using the WalletService class
            const walletPromise: Promise<WalletData> = walletService.getWalletBalance(smartWalletAddress);
      
            // const statsPromise = profileService.getStats(username);
            const [ walletSmart ] = await Promise.all([walletPromise]);

            const energy = await energyService.getPlayerEnergyBeats(userName);
      
            // Return an object containing the user's smart wallet, safe properties, success message, and JWT token
            return {
              username,
              wallet: walletSmart,
              safeProperties,
              playerStats,
              energy,
              uuid: userId,
              accessToken,
              refreshToken,
              message: "You are now logged-in",
              success: "OK",
              loginType: 'beats',} as ValidateSessionReturn
            } catch (error: any) {
              console.error("Error validating session:", error);
              if (error instanceof ValidationError) {
                  return null; // Or handle it gracefully here
              }
              throw error; // Re-throw if it's an unexpected error
          }
    }
    }



    // public async googleRegister(body: GoogleRegister , ipAddress: string): Promise<void | ValidationError> {
    //   const walletService: WalletService = new WalletService();
    //   const googleService: GoogleService = new GoogleService();

    //   const { serverToken, deviceId } = body
    //   const playerInfo: PlayerInfo = await googleService.googleAuth(serverToken);
    //   const { displayName, playerId } = playerInfo as PlayerInfo;

    //   const userName: string = displayName;
    //   const signupDate: number = Date.now()
    //   const suspended: Suspended = { until: null, reason: "" };

    //   const geo = geoip.lookup(ipAddress);
    //   const country: string | undefined = geo?.country
    //   const session: Session | undefined = this.driver?.session();

    //   try {
    //     const password: string = await nanoid()
    //     const encrypted: string = await hash(password, parseInt(SALT_ROUNDS));
    //     const locKey: string = await hash(userName, parseInt(SALT_ROUNDS));
    //     const smartWallet = await walletService.createWallet(userName)

    //     const smartWalletAddress: string = smartWallet;

    //     await session?.executeWrite(
    //       (tx: ManagedTransaction) => tx.run(
    //           `
    //           CREATE (u:User {
    //             signupDate: $signupDate,
    //             accountType: "google",
    //             userId: $playerId,
    //             username: $userName,
    //             password: $encrypted,
    //             locKey: $locKey
    //             smartWalletAddress: $smartWalletAddress
    //             playerStats: $playerStats,
    //             suspended: $suspended,
    //             country: "SOKOR",
    //             deviceId: $deviceId,
    //             inventorySize: 200
    //           })

    //           ${inventoryCypher}
    //         `,
    //         { signupDate, userName, encrypted, smartWalletAddress, playerStats, suspended, country, deviceId, locKey, playerId }
    //         ) 
    //       )
    
    //       // Close the session
    //       await session?.close()
    
    //     } catch (error: any) {
    //       console.log(error)
    //       // Handle unique constraints in the database
    //       if (error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
    //         if (error.message.includes('userId')) {
    //           return new ValidationError(`An account already exists`,'An account already exists')}
    //         }

    //       if (error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
    //         if (error.message.includes('username')) {
    //             return new ValidationError(`An account already exists`,'An account already exists')}
    //         }
    //         throw error
            
    //       } finally {
    //         await session?.close()
    //       }
    // }


    // public async googleLogin(token: string): Promise<AuthenticateReturn | ValidationError> {
    //   const googleService: GoogleService = new GoogleService();
    //   const playerInfo: PlayerInfo = await googleService.googleAuth(token);
    //   const energyService: EnergyService = new EnergyService();
    //   const { playerId } = playerInfo as PlayerInfo;


    //   const walletService: WalletService = new WalletService();
    //   const tokenService: TokenService = new TokenService();

    //   try {
    //     const session: Session | undefined = this.driver?.session();
    //     // Find the user node within a Read Transaction
    //     const result: QueryResult | undefined = await session?.executeRead((tx: ManagedTransaction) =>
    //         tx.run('MATCH (u:User {userId: $playerId}) RETURN u', { playerId })
    //     );

    //     await session?.close();
    //     // Verify the user exists
    //     if (result?.records.length === 0) {
    //         console.log('none')
    //         return new ValidationError(`User with playerId '${playerId}' not found.`, "");
    //     }

    //     // Compare Passwords
    //     const user: UserData = result?.records[0].get('u');

    //     // Return User Details
    //     const { password, smartWalletAddress, playerStats, userId, username, ...safeProperties } = user.properties

    //     const walletPromise: Promise<WalletData> = walletService.getWalletBalance(smartWalletAddress);
    //     const [ wallet ] = await Promise.all([walletPromise ]);

    //     const tokens: TokenScheme = await tokenService.generateTokens(playerId);
    //     const { refreshToken, accessToken } = tokens as TokenScheme

    //     const energy = await energyService.getPlayerEnergyBeats(username);
    //     return {
    //         username,
    //         wallet,
    //         safeProperties,
    //         playerStats,
    //         energy,
    //         uuid: userId,
    //         refreshToken,
    //         accessToken,
    //         message: 'You are now logged in',
    //         success: 'OK',
    //         loginType: 'google'

    //     } as AuthenticateReturn

    //   } catch(error: any) {
    //     throw error

    //   }

    // }
};

export default AuthService



export function encrypt(text: string): string {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
    throw new Error("Missing or invalid ENCRYPTION_KEY (must be 32 bytes)");
  }

    const iv = crypto.randomBytes(12); // GCM standard IV size
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    const authTag = cipher.getAuthTag().toString("base64");

    return `${encrypted}:${iv.toString("base64")}:${authTag}`;
}


export function decrypt(encrypted: string): string {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
    throw new Error("Missing or invalid ENCRYPTION_KEY (must be 32 bytes)");
  }
    const [cipherText, ivB64, authTagB64] = encrypted.split(":");
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(ENCRYPTION_KEY),
        Buffer.from(ivB64, "base64")
    );

    decipher.setAuthTag(Buffer.from(authTagB64, "base64"));

    let decrypted = decipher.update(cipherText, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}