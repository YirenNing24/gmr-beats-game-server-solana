//** GOOGLE AUTH LIBRARY IMPORT */
import { OAuth2Client } from "google-auth-library";
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";

//** GOOGLE PASSKEY AUTH
import { generateAuthenticationOptions, verifyAuthenticationResponse, 
        VerifyAuthenticationResponseOpts, generateRegistrationOptions, 
        GenerateRegistrationOptionsOpts, verifyRegistrationResponse, VerifiedRegistrationResponse, 
        VerifiedAuthenticationResponse, PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/server";

//** TYPE INTERFACE IMPORT
import { AuthenticateReturn, PasskeyUser, PlayerInfo, TokenScheme, WalletData } from "../user.service.interface";
import { RegistrationResponseJSON, WebAuthnCredential } from "../auth.services.ts/auth.interface";

//** CONFIG IMPORT
import { ANDROID_APP_HASH, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../config/constants";

//** CLIENT IMPORT
import keydb from "../../db/keydb.client";

//** MEMGRAPH IMPORT
import { getDriver } from "../../db/memgraph";
import { Driver, ManagedTransaction, QueryResult, Session } from "neo4j-driver";

//** SERVICE IMPORT
import AuthService from "../auth.services.ts/auth.service";
import TokenService from "../token.services/token.service";
import WalletService from "../wallet.services/wallet.service";
import EnergyService from "../../game.services/energy.services/energy.service";

//** ERROR IMPORT
import ValidationError from "../../outputs/validation.error";

/**
 * Interface for the passkey authentication response
 * @interface PasskeyAuthVerify
 * @property {string} authenticatorAttachment - The authenticator attachment
 * @property {Record<string, unknown>} clientExtensionResults - The client extension results
 * @property {string} deviceId - The device ID
 * @property {string} id - The ID
 * @property {string} rawId - The raw ID
 * @property {object} response - The response object
 * @property {string} response.authenticatorData - The authenticator data
 * @property {string} response.clientDataJSON - The client data JSON
 * @property {string} response.signature - The signature
 * @property {string} response.userHandle - The user handle
 * @property {string} type - The type
 * @property {string} username - The username
 * @returns {PasskeyAuthVerify} - The passkey authentication response
 */
interface PasskeyAuthVerify {
	authenticatorAttachment: string | undefined;
	clientExtensionResults: Record<string, unknown>; // Generic object to allow flexibility
	deviceId: string;
	id: string;
	rawId: string;
	response: {
		authenticatorData: string;
		clientDataJSON: string;
		signature: string;
		userHandle: string;
	};
	type: string;
	username: string;
}



class GoogleService {

    // Authenticates the user with Google using the provided token.
    public async googleAuth(token: string): Promise<PlayerInfo> {
        try{
            const oAuth2Client = new OAuth2Client( GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
            const { tokens } = await oAuth2Client.getToken(token) as GetTokenResponse

            const apiUrl: string = 'https://games.googleapis.com/games/v1/players/me';
            const response: Response = await fetch(apiUrl, {
            method: 'GET',
            headers: { Authorization: `Bearer ${tokens.access_token}` },
            });

            const playerInfo: PlayerInfo = await response.json() as PlayerInfo ;

            return playerInfo as PlayerInfo
        } catch(error: any){
            throw error
        }
    }
    
    // Validates the Google authentication token and retrieves player information
    public async googleValidate(token: string): Promise<PlayerInfo> {
        try{
            const oAuth2Client: OAuth2Client = new OAuth2Client( GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
            const { tokens } = await oAuth2Client.getToken(token) as GetTokenResponse

            const apiUrl: string = 'https://games.googleapis.com/games/v1/players/me';
            const response: Response = await fetch(apiUrl, {
            method: 'GET',
            headers: { Authorization: `Bearer ${tokens.access_token}` },
            });

            const playerInfo: PlayerInfo = await response.json() as PlayerInfo ;

            return playerInfo as PlayerInfo
        } catch(error: any){
            throw error
        }
    }


    public async googlePassKeyAuth(username: { username: string }) {
        try {
            const existingChallenge = await keydb.GET(`passkey:challenge:${username.username}`);
            if (existingChallenge) {
                console.log(`[PasskeyAuth] Existing challenge found for ${username.username}, returning same options...`);
                return {
                    challenge: existingChallenge,
                    rpID: "beats.gmetarave.com",
                    userVerification: "required",
                    timeout: 1800000,
                    allowCredentials: [],
                };
            }
    
            const options = await generateAuthenticationOptions({
                challenge: undefined,
                rpID: "beats.gmetarave.com",
                userVerification: "required",
                timeout: 1800000,
                allowCredentials: [],
            });
    
            await keydb.SET(`passkey:challenge:${username.username}`, options.challenge);
            await keydb.EXPIRE(`passkey:challenge:${username.username}`, 120);
            console.log(`[PasskeyAuth] New challenge generated for ${username.username}`);
            
            return options;
    
        } catch (error: any) {
            console.log(error)
            throw new Error(`Error generating passkey auth options: ${error.message}`);
        }
    }
    
    


    // Method to handle the passkey authentication response
    public async googlePassKeyAuthVerify(passkeyAuthVerify: PasskeyAuthVerify) {
        const driver: Driver = getDriver();
        const authService: AuthService = new AuthService(driver);
        const walletService: WalletService = new WalletService(driver);
        const energyService: EnergyService = new EnergyService(driver);
        const tokenService: TokenService = new TokenService();
    
        try {
            const expectedChallenge = await keydb.GET(`passkey:challenge:${passkeyAuthVerify.username}`);
            console.log(`[PasskeyAuth] Expected challenge for ${passkeyAuthVerify.username}:`, expectedChallenge);
            console.log(`[PasskeyAuth] ClientDataJSON:`, atob(passkeyAuthVerify.response.clientDataJSON));

            if (expectedChallenge === null) {
                throw new ValidationError("Fingerprint login expired", "Fingerprint login expired")
            }
            

            const clientData = JSON.parse(Buffer.from(passkeyAuthVerify.response.clientDataJSON, 'base64').toString());
            console.log("Client challenge:", clientData.challenge);

            const credentialID = passkeyAuthVerify.id;
            console.log(`[PasskeyAuth] Verifying credential ID: ${credentialID} for user: ${passkeyAuthVerify.username}`);
    
            const passkeyUser = await authService.getPasskeyUserData(passkeyAuthVerify.username);
            console.log("[PasskeyAuth] Retrieved passkey user data:", passkeyUser);
    
            const { counter, publicKey } = passkeyUser;
    
            const credential: WebAuthnCredential = {
                id: credentialID,
                publicKey,
                counter
            };
    
            const { username, ...properties } = passkeyAuthVerify;
    
            if (!username) {
                throw new Error("Username is undefined during passkey authentication");
            }
    
            const verificationOptions: VerifyAuthenticationResponseOpts = {
                //@ts-ignore
                response: properties,
                expectedChallenge,
                expectedOrigin: ANDROID_APP_HASH,
                expectedRPID: 'beats.gmetarave.com',
                credential,
                requireUserVerification: true,
            };
    
            console.log(`[PasskeyAuth] Verifying WebAuthn response for ${username}...`);
            const verificationResult: VerifiedAuthenticationResponse = await verifyAuthenticationResponse(verificationOptions);
    
            console.log("[PasskeyAuth] Verification result:", verificationResult);
    
            if (verificationResult.verified) {
                // ✅ Delete the challenge after successful verification
	            await keydb.DEL(`passkey:challenge:${username}`);
                const { playerStats, smartWalletAddress, userId, ...safeProperties } = passkeyUser.safeProperties;
    
                console.log(`[PasskeyAuth] Generating tokens for ${username}...`);
                const tokens: TokenScheme = await tokenService.generateTokens(username);
                console.log("[PasskeyAuth] Tokens generated successfully");
    
                const energy = await energyService.getPlayerEnergyBeats(username);
                const walletPromise: Promise<WalletData> = walletService.getWalletBalance(smartWalletAddress);
                const [wallet] = await Promise.all([walletPromise]);
    
                console.log(`Passkey sign in complete for ${username}`);
                return {
                    username,
                    wallet,
                    safeProperties,
                    playerStats,
                    energy,
                    uuid: userId,
                    refreshToken: tokens.refreshToken,
                    accessToken: tokens.accessToken,
                    message: "You are now logged in",
                    success: 'OK',
                    loginType: 'passkey'
                } as AuthenticateReturn;
            } else {
                console.warn("[PasskeyAuth] Authentication failed:", verificationResult.authenticationInfo);
                throw new ValidationError("Authentication failed", "Fingerprint failed verification");
            }
    
        } catch (error: any) {
            console.error("Error verifying authentication response:", error);
            console.error("Context:", {
                passkeyAuthVerify,
                username: passkeyAuthVerify?.username,
            });
            throw error;
        }
    }
    
    

    public async googleRegisterPassKey(username: { username: string }) {
        try {
            
            const driver: Driver = getDriver();
            const session: Session | undefined = driver?.session();
            const playerName = username.username
            const result: QueryResult | undefined = await session?.executeRead((tx: ManagedTransaction) =>
                tx.run(
                    `MATCH (u:User {username: $playerName})
                     RETURN u.username`,
                    { playerName }
                )
            );
            if (!result || result.records.length > 0) {
                throw new ValidationError(`An account already exists with the username ${playerName}.`, "");
            }
            const registrationOptions: GenerateRegistrationOptionsOpts = {
                rpName: "beats.game", // The name of your application
                rpID: "beats.gmetarave.com", // Your domain (this should match the domain in the origin)
                userName: username.username, // The unique username of the user
    
                // Generate a unique user ID as a Uint8Array for secure registration; this might come from your database
                userID: new TextEncoder().encode("unique-user-id"), 
    
                // Generate a secure random challenge as a Uint8Array (typically generated server-side)
                challenge: new TextEncoder().encode("secure-challenge-string"), 
    
                // Display name to show in the authenticator UI
                userDisplayName: username.username, 
    
                // Timeout for the registration process (e.g., 30 seconds)
                timeout: 30000, 
    
                // Specify attestation type, for example, 'none' to skip attestation information
                attestationType: "none",
    
                // Optionally exclude credentials to prevent re-registration with existing credentials
                excludeCredentials: [
                    {
                        id: "base64url-existing-credential-id", // Ensure this ID is in Base64URL format
                        transports: ['usb', 'nfc'], // Define supported transport types (optional)
                    }
                ],

                // Authenticator selection criteria, setting platform authenticator as an example
                authenticatorSelection: {
                    authenticatorAttachment: "platform", // 'platform' for passkeys on device
                    requireResidentKey: true,
                    userVerification: "required", // Enforce user verification
                },
            };
            
            // Call the function to generate registration options
            const options = await generateRegistrationOptions(registrationOptions);
            await keydb.SET(`registerChallenge:${username.username}`, options.challenge)
            await keydb.EXPIRE(`registerChallenge:${username.username}`, 120);


            console.log(options)


            return options;
        } catch (error: any) {
            console.error("Error in googleRegisterPassKey:", error);
            throw error;
        }
    }


    public async googleVerifyPassKeyRegistration(response: RegistrationResponseJSON, ipAddress: string) {
        const driver: Driver = getDriver()
        const authService: AuthService = new AuthService(driver);
        const walletService: WalletService = new WalletService(driver);
        const energyService: EnergyService = new EnergyService(driver);
        const tokenService: TokenService = new TokenService();
        try {

            const { username, deviceId } = response
            // Retrieve the expected challenge that was stored during registration initiation
            const expectedChallenge: string = await this.getStoredChallenge(username);
            
    
            // Define the expected origin

    
            // Define the expected Relying Party ID (RP ID)
            const expectedRPID: string  = 'beats.gmetarave.com';
    
            // Define the supported algorithms (example: ES256)
            const supportedAlgorithmIDs: number[] = [-7]; // COSEAlgorithmIdentifier for ES256
            
            // Construct the verification options
            const verifyOptions = {
                response, // This is your WebAuthn response object
                expectedChallenge,
                expectedOrigin: ANDROID_APP_HASH,
                expectedRPID,
                expectedType: 'webauthn.create',
                requireUserPresence: true,
                requireUserVerification: true,
                supportedAlgorithmIDs,
            };
    
            // Perform the verification
            const result: VerifiedRegistrationResponse =  await verifyRegistrationResponse(verifyOptions);

            //@ts-ignore
            const { id, publicKey, counter } = result.registrationInfo?.credential
            //@ts-ignore
            const userData: PasskeyUser = { userName: username, deviceId, id, publicKey, counter }
            await authService.passkeyRegister(userData, ipAddress);

            const passkeyUser = await authService.getPasskeyUserData(username);
            const { playerStats, smartWalletAddress, userId, ...safeProperties  } = passkeyUser.safeProperties;
            const tokens: TokenScheme = await tokenService.generateTokens(username);
            const { refreshToken, accessToken } = tokens as TokenScheme

            const energy = await energyService.getPlayerEnergyBeats(username);
            const walletPromise: Promise<WalletData> = walletService.getWalletBalance(smartWalletAddress);
            const [ wallet ] = await Promise.all([walletPromise ]);

            return { 
                username, 
                wallet, 
                safeProperties, 
                playerStats, 
                energy, 
                uuid: userId, 
                refreshToken, 
                accessToken, 
                message: "You are now logged in", 
                success: 'OK', 
                loginType: 'passkey' } as AuthenticateReturn; 

        } catch (error: any) {
            console.error('Error in googleVerifyPassKeyRegistration:', error);
            throw error;
        }
    }


    // Function to retrieve the challenge for a user
    private async getStoredChallenge(username: string): Promise<string> {
        try {
            // Retrieve the stored challenge data from KeyDB
            const data = await keydb.GET(`registerChallenge:${username}`) as string;
            if (!data) {
                throw new Error(`No challenge found for user: ${username} or attempt has expired`);
            }
    
            return data;
        } catch (error) {
            console.error('Error retrieving stored challenge:', error);
            throw error;
        }
    }
}

export default GoogleService