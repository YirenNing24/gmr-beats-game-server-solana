import { CardMetaData } from "../inventory.services/inventory.interface";

/**
 * Represents the status of a player.
 *
 * @interface PlayerStatus
 * @property {string} username - The username of the player.
 * @property {boolean} status - The online status of the player (true for online, false for offline).
 * @property {string} activity - The current activity of the player.
 * @property {number} lastOnline - The timestamp indicating when the player was last online.
 * @property {string} userAgent - The user agent string of the player's device.
 * @property {string} osName - The name of the operating system running on the player's device.
 * @property {string} ipAddress - The IP address of the player's device.
 * @property {string} id - The unique identifier of the player status record.
 */
export interface PlayerStatus {
    username: string;
    status: boolean;
    activity: string;
    lastOnline: number;
    userAgent: string;
    osName: string;
    ipAddress: string;
    id: string;
}

/**
 * Represents the stat points of a player for different roles.
 *
 * @interface StatPoints
 * @property {number} mainVocalist - The stat points for the main vocalist role.
 * @property {number} rapper - The stat points for the rapper role.
 * @property {number} leadDancer - The stat points for the lead dancer role.
 * @property {number} leadVocalist - The stat points for the lead vocalist role.
 * @property {number} mainDancer - The stat points for the main dancer role.
 * @property {number} visual - The stat points for the visual role.
 * @property {number} leadRapper - The stat points for the lead rapper role.
 */
export interface StatPoints {
    mainVocalist: number;
    rapper: number;
    leadDancer: number;
    leadVocalist: number;
    mainDancer: number;
    visual: number;
    leadRapper: number;
}

/**
 * Represents the result when a stats update fails.
 *
 * @interface UpdateStatsFailed
 * @property {boolean} success - Indicates whether the update failed.
 * @property {string} message - A message providing details about the failure.
 */
export interface UpdateStatsFailed {
    success: boolean;
    message: string;
  }

  /**
 * Represents the profile picture of a user.
 *
 * @interface ProfilePicture
 * @property {string} userName - The username of the user.
 * @property {string} fileFormat - The file format of the profile picture.
 * @property {number[]} profilePicture - The binary data of the profile picture.
 * @property {number} uploadedAt - The timestamp indicating when the profile picture was uploaded.
 * @property {number} fileSize - The size of the profile picture file in bytes.
 */
export interface ProfilePicture {
    userName: string;
    fileFormat: string;
    profilePicture: string;
    uploadedAt: number;
    fileSize: number;
    likes: PictureLikes[];
    id?: string
}


export interface PictureLikes {
    userName?: string;
    timestamp?: number;
    likeId: string; 
}

/**
 * Represents metadata for a soul.
 *
 * @interface SoulMetaData
 * @property {string} genre1 - The primary genre of the soul.
 * @property {string} genre2 - The secondary genre of the soul.
 * @property {string} genre3 - The tertiary genre of the soul.
 * @property {string} animal1 - The associated animal of the soul.
 * @property {string} horoscope - The associated horoscope of the soul.
 */
export interface SoulMetaData {
	genre1: string;
	genre2: string;
	genre3: string;
	animal1: string;
    animal2: string;
    animal3: string;
	horoscope: string;
    id?: string
    ownership?: string[];
    horoscopeMatch?: string[];
    animalMatch?: string[];
    weeklyFirst?: string[];
}

/**
 * Represents the count of cards in different groups.
 *
 * @interface GroupCardCount
 * @property {number} [group] - The count of cards in the specified group.
 */
export interface GroupCardCount {
	[group: string]: number;
}

/**
 * Represents a collection of cards belonging to a group.
 *
 * @interface GroupCollection
 * @property {string} group - The name of the group.
 */
export interface GroupCollection {
	group: string;
}

/**
 * Represents a collection of cards with metadata and count.
 *
 * @interface CardCollection
 * @property {CardMetaData} card - The metadata of the card.
 * @property {string} name - The name of the card.
 * @property {number} count - The count of cards with the same name.
 */
export interface CardCollection {
	card: CardMetaData;
	name: string;
	count: number;
}


/**
 * Represents buffer data in string format.
 *
 * @interface BufferData
 * @property {string} bufferData - The raw data in string format.
 */
export interface BufferData {
    bufferData: string;
  }
  
  /**
   * Represents a note created by a user with optional metadata.
   *
   * @interface MyNote
   * @property {string} [userName] - The username of the person who created the note. Optional.
   * @property {string} note - The content of the note.
   * @property {number} [createdAt] - The timestamp when the note was created. Optional.
   * @property {number} [updatedAt] - The timestamp when the note was last updated. Optional.
   */
  export interface MyNote {
    userName?: string;
    note: string;
    createdAt?: number;
    updatedAt?: number;
  }
  
