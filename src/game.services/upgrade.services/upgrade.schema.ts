//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

//
/**
 * Schema for validating the body of a Beats login request.
 *
 * @type {Object}
 * @property {Object} body - The body of the request.
 * @property {string} body.cardUri - The URI of the card.
 * @property {Object[]} body.cardUpgrade - The array of card upgrade items.
 * @property {string} body.cardUpgrade[].uri - The URI of the card upgrade item.
 * @property {string} body.cardUpgrade[].id - The ID of the card upgrade item.
 * @property {number} body.cardUpgrade[].quantityConsumed - The quantity consumed of the card upgrade item.
 * @property {Object} headers - The headers of the request.
 * @property {string} headers.authorization - The authorization header.
 */
export const cardUpgradeSchema = {
    body: t.Object({
        cardUri: t.String(),
        cardId: t.String(),
        cardUpgrade: t.Array(
            t.Object({
                uri: t.String(),
                id: t.String(),
                quantityConsumed: t.Number()
            })
        )
    }),
    headers: t.Object({ authorization: t.String() })
};
