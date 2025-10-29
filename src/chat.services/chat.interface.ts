/**
 * Represents the result of an operation.
 *
 * @interface Result
 * @property {string} id - The ID associated with the result.
 * @property {string} message - The message describing the result.
 * @property {string} roomId - The ID of the associated room.
 * @property {number} ts - The timestamp associated with the result.
 * @property {boolean} seen - Whether the message has been seen
 */
export interface Result {
  id: string;
  message: string;
  roomName: string;
  members: string[]
  ts: number;
  seen: boolean;
}


/**
 * Represents the result of an operation.
 *
 * @interface Result
 * @property {string} id - The ID associated with the result.
 * @property {string} message - The message describing the result.
 * @property {string} roomId - The ID of the associated room.
 * @property {number} ts - The timestamp associated with the result.
 * @property {boolean} seen - Whether the message has been seen
 */
export interface GroupResult {
  id: string;
  group: boolean;
  members: string[]
  message: string;
  roomId: string;
  seen: boolean;
  sender: string;
  ts: number;

}


/**
* Represents data about the sender.
*
* @interface SenderData
* @property {string} username - The username of the sender.
* @property {number} level - The level of the sender.
* @property {string} rank - The rank of the sender.
*/
export interface SenderData {
  username: string;
  level: number;
  rank: string;
}

/**
* Represents a new message.
*
* @interface NewMessage
* @property {string} id - The ID of the new message.
* @property {string} message - The content of the message.
* @property {string} roomId - The ID of the associated room.
* @property {SenderData} sender - Data about the sender of the message.
* @property {string} receiver - The username of the message receiver.
* @property {number} ts - The timestamp of the message.
* @property {number} timestamp - Additional timestamp associated with the message.
*/
export interface NewMessage {
  id?: string;
  message: string;
  roomId?: string;
  group?: boolean
  sender?: SenderData;
  receiver: string;
  ts: number;
  timestamp: number;
  voiceMessage?: string;
}

/**
* Represents a private message.
*
* @interface PrivateMessage
* @property {string} id - The ID of the private message.
* @property {string} message - The content of the private message.
* @property {string} receiver - The username of the message receiver.
* @property {string} roomId - The ID of the associated room.
* @property {boolean} seen - Indicates whether the message has been seen by the receiver.
* @property {SenderData} sender - Data about the sender of the private message.
* @property {number} ts - The timestamp of the private message.
*/
export interface PrivateMessage {
  id: string;
  message: string;
  receiver: string;
  roomId: string;
  seen: boolean;
  sender: SenderData;
  ts: number;
}


export interface GroupChatData {
  name: string;
  members: string[];
}