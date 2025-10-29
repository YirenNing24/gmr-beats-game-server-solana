//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";




export const ClassicLeaderboardRequestSchema = {
    body: t.Object({ username: t.String(), password: t.String() })
}