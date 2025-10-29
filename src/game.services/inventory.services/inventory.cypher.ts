/**
 * Cypher query string for opening a user's card inventory.
 * This query matches a user who owns cards and returns the URI, card object, and relationship type for each card.
 * @param {string} userName - The username of the user whose card inventory is being opened.
 * @returns {string} - Cypher query string
 */
export const inventoryOpenCardCypher = `
    MATCH (u:User {username: $userName})-[:INVENTORY|EQUIPPED]->(c:Card)
    OPTIONAL MATCH (u)-[r]->(c)
    RETURN c.uri as uri, c as card, TYPE(r) as relationshipType`;


export const packInventoryOpenCypher = `
    MATCH (u:User {username: $userName})-[:OWNED]->(p:Pack)
    OPTIONAL MATCH (u)-[r]->(c)
    RETURN c.uri as uri, c as cardPack, TYPE(r) as relationshipType`;


export const openCardUpgradeCypher = `
    MATCH (u:User{username: $userName})-[:OWNED]->(c:CardUpgrade)
    OPTIONAL MATCH (u)-[r]->(c)
    RETURN c as cardUpgrade`;
    
/**
 * Cypher query string for updating a user's card inventory.
 * This query removes the BAGGED relationship and adds an EQUIPPED relationship for a card owned by the user with the specified URI.
 * @param {string} userName - The username of the user whose inventory is being updated.
 * @param {string} uri - The URI of the card to be updated.
 * @returns {string} - Cypher query string
 */
export const equipItemCypher: string =`
  MATCH (u:User {username: $userName})-[o:INVENTORY]->(c:Card {uri: $uri})
  WHERE EXISTS((u)-[:INVENTORY]->(c))
  DELETE o
  CREATE (u)-[:EQUIPPED]->(c)
  `;

/**
 * Cypher query string for removing the equipped status of a card and reinstating it in the user's inventory.
 * This query matches a user who has equipped the card with the specified URI,
 * removes the EQUIPPED relationship, and creates an INVENTORY relationship.
 * It returns the count of cards that were removed from the equipped status.
 * 
 * @param {string} $userName - The username of the user whose inventory is being updated.
 * @param {string} $uri - The URI of the card to be updated.
 * @returns {string} - Cypher query string
 */
export const unequipItemCypher: string = `
  MATCH (u:User {username: $userName})-[e:EQUIPPED]->(c:Card {uri: $uri})
  DELETE e
  CREATE (u)-[:INVENTORY]->(c)
`;



  // MATCH (u:User {username: "nashar4"})-[r:INVENTORY]->(c:Card {id: "5"})
// DELETE r;

/**
 * Cypher query string for checking the remaining inventory size of a user.
 * This query counts the number of cards in the user's inventory and calculates the remaining inventory size based on the user's inventorySize property.
 * @param {string} userName - The username of the user whose inventory size is being checked.
 * @returns {string} - Cypher query string
 */
export const checkInventorySizeCypher = `
  MATCH (u:User{username: $userName})-[:INVENTORY]->(c:Card)
  WITH COUNT(c) AS cardCount, u.inventorySize AS inventorySize
  RETURN inventorySize - cardCount AS remainingSize`;


