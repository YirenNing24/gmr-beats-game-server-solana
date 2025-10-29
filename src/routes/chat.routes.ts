//** ELYSIA IMPORT
import Elysia from "elysia";

//** CHAT SERVICE IMPORT
import ChatService from "../chat.services/chat.socket.service";
import { GroupResult, NewMessage } from "../chat.services/chat.interface";

//** SERVER TIME SERVICE IMPORT
import TimeService from "../game.services/time.services/time.service";

//** CONFIG IMPORT
import ValidationError from "../outputs/validation.error";
import { changeProfilePicsSchema } from "./route.schema/schema.profile";
import { SuccessMessage } from "../outputs/success.message";
import { newGroupChatSchema } from "../chat.services/chat.schema";
import { authorizationBearerSchema } from "./route.schema/schema.auth";

const chat = (app: Elysia): void => {
  // app.ws('/api/ws', {
  //     async open(ws) {
  //       try {
  //         const room: string = 'all';
  //         const authorizationHeader: string = ws.data.headers.authorization || "";

  //         if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
  //           ws.terminate();
  //           throw new ValidationError('jwt issue', 'jwt issue');
  //         }

  //         const jwtToken: string = authorizationHeader.substring(7);

  //         //@ts-ignore
  //         const chatService: ChatService = new ChatService(ws);
  //         chatService.chatRoom(room, jwtToken);
  //         ws?.subscribe('all');
  //       } catch (error: any) {
  //         throw error;
  //       }
  //     },

  //     async message(ws, message) {
  //       try {
  //         const newMessage: NewMessage = message as NewMessage;

  //         newMessage?.roomId && (await insertChats(newMessage));
  //         //@ts-ignore
  //         const timeService: TimeService = new TimeService(ws);
  //         newMessage?.timestamp && (await timeService.getServerDateTime(newMessage));
  //       } catch (error: any) {
  //         console.error('Error in WebSocket message event:', error);
  //         throw error;
  //       }
  //     }
      
  //   }
  // ), changeProfilePicsSchema
  

  // app.post('api/chat/new-group-chat', async ({ headers, body }) => {
  //   try {
  //     const authorizationHeader: string | null = headers.authorization;
  //     if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
  //       throw new Error('Bearer token not found in Authorization header');
  //     }
  //     const jwtToken: string = authorizationHeader.substring(7);

  //     const chatService: ChatService = new ChatService();
  //     const output: SuccessMessage = await chatService.createGroupChat(jwtToken, body)
  
  //     return output
  //   } catch (error: any) {
  //     return error;
  //   }

  //   }, newGroupChatSchema
  // )

  // app.get('api/chat/group-chats', async ({ headers }) => {
  //   try {
  //     const authorizationHeader: string | null = headers.authorization;
  //     if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
  //       throw new Error('Bearer token not found in Authorization header');
  //     }
  //     const jwtToken: string = authorizationHeader.substring(7);

  //     const chatService: ChatService = new ChatService();
  //     const output: GroupResult[] = await chatService.getGroupChats(jwtToken);
  
  //     return output
  //   } catch (error: any) {
  //     return error;
  //   }

  //   }, authorizationBearerSchema
  // )


};

export default chat;
