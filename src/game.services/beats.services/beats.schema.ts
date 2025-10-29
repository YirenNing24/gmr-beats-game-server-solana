//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

//
/**
 * Schema for validating the body of a Beats login request.
 *
 * @type {Object}
 * @property {Object} body - The body of the request.
 * @property {string} body.username - The username for login.
 * @property {string} body.password - The password for login.
 */
export const BeatsActivitySchema = {
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ activity: t.String() }),
}


export const GetActivitySchema = {
    headers: t.Object({ authorization: t.String() }),
    body: t.Array(t.String()),
}
