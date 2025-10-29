//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

//
/**
 * Schema for validating the body of a request related to PackData.
 *
 * @type {Object}
 * @property {Object} body - The body of the request.
 * @property {boolean} body.child - Indicates if the pack is for children.
 * @property {string} body.currencyName - The name of the currency.
 * @property {string} body.description - The description of the pack.
 * @property {string} body.endTime - The end time of the pack.
 * @property {string} body.id - The unique identifier of the pack.
 * @property {string} body.image - The image URL of the pack.
 * @property {string} body.lister - The person who listed the pack.
 * @property {number} body.listingId - The unique listing ID of the pack.
 * @property {string} body.name - The name of the pack.
 * @property {number} body.pricePerToken - The price per token for the pack.
 * @property {number} body.quantity - The quantity available in the pack.
 * @property {string} body.startTime - The start time of the pack.
 * @property {string} body.tokenId - The token ID associated with the pack.
 * @property {string} body.type - The type of the pack.
 * @property {string} body.uploader - The uploader of the pack.
 * @property {string} body.uri - The URI associated with the pack.
 */
export const packDataSchema = {
	body: t.Record(
		t.String(), // Dynamic keys like "X:IN TEST"
		t.Object({
			child: t.Boolean(),
			description: t.String(),
			id: t.String(),
			image: t.String(),
			name: t.String(),
			quantity: t.Number(),
			type: t.String(),
			uploader: t.String(),
			uri: t.String(),
		})
	),
	headers: t.Object({ authorization: t.String() }),
};
