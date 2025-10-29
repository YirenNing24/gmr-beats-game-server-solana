

export const upgradeCardDataCypher: string = `
MATCH (u:User {username: $userName})-[:INVENTORY|EQUIPPED]->(c:Card {uri: $cardUri, id: $cardId })
MATCH (u:User {username: $userName})-[:OWNED]->(cu:CardUpgrade {uri: $uri, id: $id})
RETURN c as Card, cu as CardUpgrade, u.localWallet as localWallet, u.localWalletkey as localWalletKey`
