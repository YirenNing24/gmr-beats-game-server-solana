import { t } from "elysia";


export const preferredServerSchema = { 
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ link: t.String() })
}