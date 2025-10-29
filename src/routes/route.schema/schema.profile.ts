//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

/**
 * Schema for uploading a display picture buffer.
 * @typedef {Object} uploadDpBufferSchema
 * @property {Object} headers - The request headers.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object} body - The request body.
 * @property {string} body.bufferData - The buffer data as a string.
 */
export const uploadDpBufferSchema = { 
    headers: t.Object({ authorization: t.String() }), 
    body: t.Object({
        bufferData: t.String()
    })
};

/**
 * Schema for submitting new stat points.
 * @typedef {Object} newStatPointsSchema
 * @property {Object} headers - The request headers.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object} body - The request body.
 * @property {number} body.mainVocalist - The stat points for the main vocalist.
 * @property {number} body.rapper - The stat points for the rapper.
 * @property {number} body.leadDancer - The stat points for the lead dancer.
 * @property {number} body.leadVocalist - The stat points for the lead vocalist.
 * @property {number} body.mainDancer - The stat points for the main dancer.
 * @property {number} body.visual - The stat points for the visual.
 * @property {number} body.leadRapper - The stat points for the lead rapper.
 * @property {string} body.username - The username of the player.
 */
export const newStatPointsSchema = {
    headers: t.Object({ authorization: t.String() }), 
    body: t.Object({ 
        mainVocalist: t.Number(),
        rapper: t.Number(),
        leadDancer: t.Number(),
        leadVocalist: t.Number(),
        mainDancer: t.Number(),
        visual: t.Number(),
        leadRapper: t.Number(),
        username: t.String()
    })
};

/**
 * Schema for liking a profile picture.
 * @typedef {Object} likeProfilePicturePicSchema
 * @property {Object} headers - The request headers.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object} body - The request body.
 * @property {string} body.id - The ID of the profile picture.
 */
export const likeProfilePicturePicSchema = { 
    headers: t.Object({ authorization: t.String() }), 
    body: t.Object({ 
        _id: t.String()
    })
};

/**
 * Schema for retrieving a profile picture.
 * @typedef {Object} getProfilePictureSchema
 * @property {Object} headers - The request headers.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object} params - The URL parameters.
 * @property {string} params.player_username - The username of the player whose profile picture is being retrieved.
 */
export const getProfilePictureSchema = {
    headers: t.Object({
        authorization: t.String()
    }),
    params: t.Object({
        player_username: t?.String()
    })
};


export const updateMyNotesSchema = { 
    headers: t.Object({ authorization: t.String() }), 
    body: t.Object({ 
        note: t.String()
    })
};


export const getProfilePicsSchema = {
    headers: t.Object({ authorization: t.String() }), 
    body: t.Array(t.String())

}

export const changeProfilePicsSchema = {
    headers: t.Object({ authorization: t.String() }), 
    body: t.Object({ _id: t.String() })

}