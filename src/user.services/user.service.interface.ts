//**  TYPE INTERFACE
/**
 * Represents the return data structure for validating a user session.
 *
 * @interface ValidateSessionReturn
 * @property {string} username - The username of the validated user session.
 * @property {WalletData} wallet - User wallet information.
 * @property {SafeProperties} safeProperties - Safe user properties.
 * @property {PlayerStats} playerStats - Player statistics.
 * @property {number} energy - User energy level.
 * @property {string} uuid - Unique identifier for the user.
 * @property {string} accessToken - The access token associated with the user session.
 * @property {string} message - A message indicating the result of the session validation.
 * @property {string} success - A string indicating the success status of the session validation.
 */
export interface ValidateSessionReturn {
  username: string;
  wallet: WalletData;
  safeProperties: SafeProperties;
  playerStats: PlayerStats;
  energy: { energy: number, timeUntilNextRecharge: number | null };
  uuid: string;
  accessToken: string;
  refreshToken: string;
  message: string;
  success: string;
}
/**
 * Represents the return data structure for authenticating a user.
 *
 * @interface AuthenticateReturn
 * @property {string} username - The username of the authenticated user.
 * @property {WalletData} wallet - User wallet information.
 * @property {SafeProperties} safeProperties - Safe user properties.
 * @property {PlayerStats} playerStats - Player statistics.
 * @property {number} energy - User energy level.
 * @property {string} uuid - Unique identifier for the user.
 * @property {string} refreshToken - refreshToken token for the user session.
 * @property {string} AccessToken - AccessToken token for the user session.
 * @property {string} loginType - The type of login or authentication the client used.
 * @property {string} message - A message indicating the result of the authentication.
 * @property {string} success - A string indicating the success status of the authentication.
 */
export interface AuthenticateReturn {
  username: string;
  wallet: WalletData;
  safeProperties: SafeProperties;
  playerStats: PlayerStats;
  energy?: { energy: number, timeUntilNextRecharge: number | null };
  uuid: string;
  refreshToken: string;
  accessToken: string;
  message: string;
  success: string;
}

  
  /**
   * Represents an item within a card inventory.
   *
   * @interface CardInventoryItem
   * @property {string | undefined} Item - The item within the card inventory. It may be a string or undefined.
   */
export interface CardInventoryItem {
    Item: string | null;
  }
  
  /**
   * Represents a card inventory with dynamic keys.
   *
   * @interface CardInventory
   * @property {CardInventoryItem | undefined} key - The key represents a specific slot in the card inventory.
   * @description The value associated with each key is either a CardInventoryItem or undefined.
   */
export interface CardInventory {
    [key: string]: CardInventoryItem | null;
  }
  
  /**
   * Represents an item with stack information within a power-up inventory.
   *
   * @interface PowerUpInventoryItem
   * @property {string} Item - The item within the power-up inventory.
   * @property {number} Stack - The stack quantity of the item.
   */
export interface PowerUpInventoryItem {
    Item: string | null;
    Stack: number | null;
  }
  
  /**
   * Represents a power-up inventory with dynamic keys.
   *
   * @interface PowerUpInventory
   * @property {PowerUpInventoryItem | undefined} key - The key represents a specific slot in the power-up inventory.
   * @description The value associated with each key is either a PowerUpInventoryItem or undefined.
   */
export interface PowerUpInventory {
    [key: string]: PowerUpInventoryItem | null;
  }
  
  /**
   * Represents the statistical data of a player in the game.
   *
   * @interface PlayerStats
   * @property {number} level - The player's level.
   * @property {number} playerExp - The player's experience points.
   * @property {number} availStatPoints - The available stat points for the player.
   * @property {string} rank - The player's rank in the game.
   * @property {Object} statPointsSaved - The saved stat points for different attributes.
   * @property {number} statPointsSaved.mainVocalist - Stat points saved for the main vocalist attribute.
   * @property {number} statPointsSaved.rapper - Stat points saved for the rapper attribute.
   * @property {number} statPointsSaved.leadDancer - Stat points saved for the lead dancer attribute.
   * @property {number} statPointsSaved.leadVocalist - Stat points saved for the lead vocalist attribute.
   * @property {number} statPointsSaved.mainDancer - Stat points saved for the main dancer attribute.
   * @property {number} statPointsSaved.visual - Stat points saved for the visual attribute.
   * @property {number} statPointsSaved.leadRapper - Stat points saved for the lead rapper attribute.
   */
export interface PlayerStats {
    level: number;
    playerExp: number;
    availStatPoints: number;
    rank: string;
    statPointsSaved: {
      mainVocalist: number;
      rapper: number;
      leadDancer: number;
      leadVocalist: number;
      mainDancer: number;
      visual: number;
      leadRapper: number;
    };
  }
  
  /**
   * Represents the data structure for safe user properties.
   * 
   * @interface SafeProperties
   * @property {boolean} anon - Indicates if the user is anonymous.
   * @property {number} createdAt - The timestamp of user creation.
   * @property {string} email - The user's email.
   * @property {string} firstName - The user's first name.
   * @property {string} lastName - The user's last name.
   * @property {string[]} profilePics - Array of profile picture filenames.
   * @property {string} userId - The user ID.
   * @property {string} username - The username.
   */
export interface SafeProperties {
    signupDate: number;
  }
  
  /**
   * Represents user data in the system.
   *
   * @interface UserData
   * @property {Object} properties - The user's properties.
   * @property {boolean} properties.anon - Indicates if the user is anonymous.
   * @property {CardInventory} properties.cardInventory - The user's card inventory.
   * @property {number} properties.createdAt - The timestamp of user creation.
   * @property {string} properties.email - The user's email address.
   * @property {string} properties.firstName - The user's first name.
   * @property {string} properties.lastName - The user's last name.
   * @property {string} properties.localWallet - The local wallet information of the user.
   * @property {string} properties.localWalletKey - The key associated with the local wallet.
   * @property {string} properties.password - The user's password.
   * @property {PlayerStats} properties.playerStats - The statistical data of the player.
   * @property {PowerUpInventory} properties.powerUpInventory - The user's power-up inventory.
   * @property {string[]} properties.profilePics - Array of profile picture filenames.
   * @property {string} properties.userId - The unique identifier for the user.
   * @property {string} properties.username - The username chosen by the user.
   */
export interface UserData {
    properties: {
      signupDate: number
      accountType: "beats",
      userId: string;
      username: string;
      password: string;
      localWallet: string;
      localWalletKey: string;
      playerStats: PlayerStats;
      suspended: Suspended
      country: string;
      deviceId: string;
      inventorySize: any;
      smartWalletAddress: string;
      encryptedAccessKey: string;
      preferredServer: string;
    };
  }

  export interface PasskeyUserData extends UserData {
    properties: UserData["properties"] & {
      id: string;
      publicKey: Uint8Array;
      counter: number;
    };
  }
  /**
   * Represents data related to a user's wallet.
   *
   * @interface WalletData
   * @property {string} smartWalletAddress - The address of the smart wallet.
   * @property {string} beatsBalance - The balance in beats.
   * @property {string} gmrBalance - The balance in kmr.
   * @property {string} nativeBalance - The native balance.
   */
export interface WalletData {
    smartWalletAddress: string;
    beatsBalance: string;
    nativeBalance: string;
    apeBalance: string;
  }
  
export interface LocalWallet {
    address: string;
    id: string;
    version: number;
    crypto: {
      cipher: string;
      cipherparams: {
        iv: string;
      };
      ciphertext: string;
      kdf: string;
      kdfparams: {
        salt: string;
        n: number;
        dklen: number;
        p: number;
        r: number;
      };
      mac: string;
    };
  }

/**
 * Represents a user in the system.
 *
 * @interface User
 * @property {string} userName - The username of the user.
 * @property {string} password - The password of the user.
 * @property {string} deviceId - The device identifier of the user.
 */
export interface User {
  deviceId: string
  userName: string
  password: string | ""
  email?: string
}


export interface PasskeyUser extends User {
  id: string
  publicKey: Uint8Array
  counter: number
}


/**
 * Represents a user in the system.
 *
 * @interface PreRegisterUser
 * @property {string} userName - The username of the user.
 * @property {string} password - The password of the user.
 * @property {string} deviceId - The device identifier of the user.
 */
export interface PreRegisterUser {
  userName: string
  password: string
  email?: string
}

/**
 * Represents the token scheme containing both a refresh token and an access token.
 *
 * @interface TokenScheme
 * @property {string} refreshToken - The refresh token used for obtaining a new access token.
 * @property {string} accessToken - The access token used for authentication and authorization.
 * @property {string} username - The username associated with the tokens.
 */
export interface TokenScheme {
  refreshToken: string
  accessToken: string
  userName: string
}

/**
 * Represents the structure of access and refresh tokens.
 *
 * @interface AccessRefresh
 * @property {string} accessToken - The access token used for authentication and authorization.
 * @property {string} userName - The username associated with the tokens.
 */
export interface AccessRefresh {
  accessToken: string;
  userName: string;
}

/**
 * Represents the player's level information.
 *
 * @interface PlayerLevel
 * @property {string} kind - The type of player level.
 * @property {number} level - The player's current level.
 * @property {string} minExperiencePoints - The minimum experience points for the current level.
 * @property {string} maxExperiencePoints - The maximum experience points for the current level.
 */
interface PlayerLevel {
  kind: string;
  level: number;
  minExperiencePoints: string;
  maxExperiencePoints: string;
}

/**
 * Represents the profile settings of a player.
 *
 * @interface ProfileSettings
 * @property {string} kind - The type of profile settings.
 * @property {boolean} profileVisible - Indicates if the player's profile is visible.
 * @property {string} friendsListVisibility - The visibility of the friends list.
 */
interface ProfileSettings {
  kind: string;
  profileVisible: boolean;
  friendsListVisibility: string;
}

/**
 * Represents information about a player's experience.
 *
 * @interface PlayerExperienceInfo
 * @property {string} kind - The type of player experience information.
 * @property {string} currentExperiencePoints - The current experience points of the player.
 * @property {PlayerLevel} currentLevel - The player's current level information.
 * @property {PlayerLevel} nextLevel - The player's next level information.
 */
interface PlayerExperienceInfo {
  kind: string;
  currentExperiencePoints: string;
  currentLevel: PlayerLevel;
  nextLevel: PlayerLevel;
}

/**
 * Represents information about a player.
 *
 * @interface PlayerInfo
 * @property {string} kind - The type of player information.
 * @property {string} playerId - The unique identifier of the player.
 * @property {string} displayName - The display name of the player.
 * @property {string} avatarImageUrl - The URL of the player's avatar image.
 * @property {string} bannerUrlPortrait - The URL of the player's portrait banner.
 * @property {string} bannerUrlLandscape - The URL of the player's landscape banner.
 * @property {ProfileSettings} profileSettings - The player's profile settings.
 * @property {PlayerExperienceInfo} experienceInfo - The player's experience information.
 * @property {string} title - The title associated with the player.
 */
export interface PlayerInfo {
  kind: string;
  playerId: string;
  displayName: string;
  avatarImageUrl: string;
  bannerUrlPortrait: string;
  bannerUrlLandscape: string;
  profileSettings: ProfileSettings;
  experienceInfo: PlayerExperienceInfo;
  title: string;
}

/**
 * Represents the result of a Google registration check.
 *
 * @interface GoogleToken
 * @property {string} serverToken - A google token generated from the client side to be exchanged for a server-token 
 */
export interface GoogleToken { 
  serverToken: string 
}

/**
 * Represents the suspension status of a player's account.
 *
 * @interface Suspended
 * @property {string} suspended - Shows a date if the account is suspended
 * @property {string} reason - Shows the reason of suspension
 */
export interface Suspended {
  until: number | null
  reason: string 
}
