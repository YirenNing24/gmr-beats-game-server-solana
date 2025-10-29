//** ELYSIA IMPORTS
import app from "../app";
import { ElysiaWS } from "elysia/ws";


//** TYPE INTERFACE
import { PrivateMessage, NewMessage, Result, GroupResult, GroupChatData } from "./chat.interface";
import TokenService from "../user.services/token.services/token.service";
import { SuccessMessage } from "../outputs/success.message";
import { ManagedTransaction, QueryResult } from "neo4j-driver";
import { MongoClient } from "mongodb";
import { mongoDBClient } from "../db/mongodb.client";


const watchedRooms: Record<string, boolean> = {};
const watchedGroupRooms: Record<string, boolean> = {};

class ChatService {
	websocket?: ElysiaWS<any>;

	constructor(websocket?: ElysiaWS<any>) {
		this.websocket = websocket;
	}

	// public async chatRoom(room: string, token: string): Promise<void> {
	// 	try {
	// 		const tokenService = new TokenService();
	// 		const username: string = await tokenService.verifyAccessToken(token);

	// 		const ws = this.websocket;

	// 		// Connect to MongoDB
	// 		const client = await mongoDBClient.connect()
	// 		const db = client.db("beats");

	// 		// Watch public room
	// 		if (!watchedRooms[room]) {
	// 			const roomCollection = db.collection("chats");
	// 			const roomCursor = roomCollection.watch([
	// 				{ $match: { "fullDocument.roomId": room } },
	// 			]);

	// 			roomCursor.on("change", (change) => {
	// 				if (change.operationType === "insert") {
	// 					const roomData = JSON.stringify(change.fullDocument);
	// 					app.server?.publish("all", roomData);
	// 				}
	// 			});
	// 			watchedRooms[room] = true;
	// 		}

	// 		// Initial fetch of room data (latest 4 messages)
	// 		const roomCollection = db.collection("chats");
	// 		const recentMessages = await roomCollection
	// 			.find({ roomId: room })
	// 			.sort({ ts: -1 })
	// 			.limit(4)
	// 			.toArray();
	// 		ws?.send(JSON.stringify({ chat: recentMessages, handle: room }));

	// 		// Watch private messages for the user (by roomId and receiver)
	// 		if (!watchedRooms[username]) {
	// 			const privateCollection = db.collection("private");

	// 			const privateCursor = privateCollection.watch([
	// 				{
	// 					$match: {
	// 						$or: [
	// 							{ "fullDocument.roomId": username },
	// 							{ "fullDocument.receiver": username },
	// 						],
	// 					},
	// 				},
	// 			]);

	// 			privateCursor.on("change", (change) => {
	// 				if (change.operationType === "insert") {
	// 					const roomData = JSON.stringify(change.fullDocument);
	// 					ws?.send(roomData);
	// 				}
	// 			});

	// 			watchedRooms[username] = true;
	// 		}

	// 		// Watch group messages where the user is a member
	// 		if (!watchedGroupRooms[username]) {
	// 			const groupCollection = db.collection("group");

	// 			const groupCursor = groupCollection.watch([
	// 				{
	// 					$match: {
	// 						"fullDocument.members": username,
	// 					},
	// 				},
	// 			]);

	// 			groupCursor.on("change", (change) => {
	// 				if (change.operationType === "insert") {
	// 					const groupData = JSON.stringify(change.fullDocument);
	// 					ws?.send(groupData);
	// 				}
	// 			});

	// 			watchedGroupRooms[username] = true;
	// 		}
	// 	} catch (error: any) {
	// 		console.error("Error in chatRoom:", error);
	// 		throw error;
	// 	}
	// }
}

export default ChatService;



const sanitise = async (message: NewMessage): Promise<boolean> => {
  return !!message && message.message !== null && message.message !== "";
};

// export const insertChats = async (newMessage: NewMessage): Promise<void> => {
//   try {

//     if (await sanitise(newMessage)) {
//       const connection: rt.Connection = await getRethinkDB();

//       // Check if message.receiver has a value, if it has then the message is a private message
//       const table: string = newMessage.group ? "group" : (newMessage.receiver ? "private" : "chats");

//       insertMessage(connection, newMessage, table);
//     }
//   } catch (error: any) {
//     throw error
//   }
// };

// const insertMessage = async (connection: any, newMessage: NewMessage, table: string = "chats"): Promise<void> => {
//   try {
//     await rt.db('beats')
//     .table(table)
//     .insert({
//       ...newMessage,
//       ts: Date.now(),
//     })
//     .run(connection);
//   } catch(error: any){
//     throw error
//   }

// };
