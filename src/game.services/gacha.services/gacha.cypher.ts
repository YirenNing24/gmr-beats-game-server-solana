
export const redeemBundle: string = `
    MATCH (u:User {username: $userName}) 
    RETURN u.localWallet as localWallet, u.localWalletKey as localWalletKey`;


export const openCardpackCypher: string = `
    MATCH (u:User {username: $username})-[:OWNED]->(p:Pack {name: $name})
    WHERE p.quantity > 0
    RETURN p as pack, u.smartWalletAddress as walletAddress`;


export const deductCardpack: string = `
    MATCH (u:User {username: $username})-[:OWNED]->(p:Pack {name: $name})
    SET p.quantity = p.quantity - 1
    `;