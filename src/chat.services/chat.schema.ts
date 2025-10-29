//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";


export interface GroupChatData {
    name: string;
    members: string[];
  }



export const newGroupChatSchema = {
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ 
        name: t.String(), 
        members: t.Array(t.String()) 
    })
}
