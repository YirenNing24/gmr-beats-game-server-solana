//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";


export const beatsLoginSchema = {
    body: t.Object({ 
        username: t.String(), 
        password: t.String() })
}


export const newMessageSchema = {
    message: t.Object({ 
        id: t.String(), 
        message: t.String(), 
        roomdId: t.String(), 
        
        sender: t.Object({ 
            username: t.String(), 
            level: t.Number(), 
            rank: t.String()}), 
        receiver: t.String(),
        ts: t.Number()  })
}

