//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";


/**
 * Schema for validating the body of a Beats login request.
 * @type {Object}
 * @property {Object} headers - The headers of the request.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object[]} body - The body of the request.
 * @property {string} body.uri - The uri of the card saved on IPFS which contains the cards metadata.
 * @property {string} body.tokenId - The token ID of the card.
 * @property {string} body.contractAddress - The contract address of the card.
 * @property {string} body.group - The group of the card.
 * @property {string} body.slot - The slot of the card.
 */
export const equipItemSchema = {
    headers: t.Object({ 
        authorization: t.String() }),
    body: t.Array(t.Object({ 
        uri: t.String(), 
        tokenId: t.String(),
        contractAddress: t.String(),
        group: t.String(),
        slot: t.String(),
        name: t.String()
     }
    ))
}



export interface UpdateInventoryData {
    uri: string;
    tokenId: string;
    contractAddress: string;
    group: string;
    slot: string;
  }
export const cardGroupSchema = {
    headers: t.Object({ 
        "x-api-key": t.String()
    }), 

}