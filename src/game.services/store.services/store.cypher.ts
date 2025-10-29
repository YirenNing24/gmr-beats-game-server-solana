/**
 * Cypher query to retrieve user and the count of bagged cards for a given username.
 * @param $username The username of the user whose bagged cards are to be retrieved.
 */
export const buyCardCypher: string = `
MATCH (u:User {username: $username})
OPTIONAL MATCH (u)-[:INVENTORY]->(c:Card)
WITH u, COUNT(c) as inventoryCurrentSize
RETURN u, inventoryCurrentSize`;


/**
 * Cypher query to retrieve valid cards that are listed in the CardStore.
 */
export const getValidCards: string = `
    MATCH (c:Card)-[:LISTED]->(:CardStore)
    RETURN c`;


/**
 * Cypher query to retrieve valid cards that are listed in the CardStore.
 */
export const getValidCardPacks: string = `
    MATCH (c:Pack)-[:LISTED]->(:PackStore)
    RETURN c`;

/**
 * Cypher query to retrieve valid card upgrade items that are not packed and have a valid lister.
 */
export const getValidCardUpgrades: string = `
    MATCH (c:CardUpgrade)-[:LISTED]->(:CardUpgradeStore)
    RETURN c`;

export const buyCardUpgradeCypher: string = `
    MATCH (u:User {username: $username})
    RETURN u`;