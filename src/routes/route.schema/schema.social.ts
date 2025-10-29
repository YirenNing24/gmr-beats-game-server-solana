//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

export const viewProfileSchema = {
    headers: t.Object({ authorization: t.String() }), 
    params: t.Object({ username: t.String()
    })
}

export const followResponseSchema = {
    headers: t.Object({ authorization: t.String() }), 
    body: t.Object({ 
        toFollow: t.String()
    })
}

export const unFollowResponseSchema = {
    headers: t.Object({ authorization: t.String() }), 
    body: t.Object({ 
        toUnfollow: t.String()
    })
}

export const getMutualConversationSchema = {
    headers: t.Object({ authorization: t.String() }), 
    params: t.Object({ 
        conversingUsername: t.String(),
    })
}

export const setOnlineStatusSchema = {
    headers: t.Object({ authorization: t.String() }), 
    body: t.Object({ 
        activity: t.String(),
        userAgent: t.String(),
        osName: t.String(),
    })
}

