export const followCypher: string = `
    MATCH (u:User {username: $userName}) 
    MATCH (p:User {username: $userToFollow})
    MERGE (u)-[r:FOLLOW]->(p)
    ON CREATE SET u.createdAt = timestamp()
    RETURN p 
    {.*, 
    followed: true} 
    AS follow
    `

export const getFollowersFollowingCountCypher: string =           `
    MATCH (u:User {username: $username})
    OPTIONAL MATCH (u)-[:FOLLOW]->(following:User)
    OPTIONAL MATCH (follower:User)-[:FOLLOW]->(u)
    RETURN COUNT(DISTINCT following) as followingCount, COUNT(DISTINCT follower) as followerCount
    `


export const getFollowersFollowingCypher: string =           `
MATCH (u:User {username: $username})
OPTIONAL MATCH (u)-[:FOLLOW]->(following:User)
OPTIONAL MATCH (follower:User)-[:FOLLOW]->(u)
RETURN 
  COLLECT(DISTINCT { username: following.username, level: following.level, playerStats: following.playerStats }) as followingUsers,
  COLLECT(DISTINCT { username: follower.username, level: follower.level, playerStats: follower.playerStats }) as followerUsers
`

export const followingCypher: string =
`
MATCH (u:User {username: $userName})
MATCH (v:User {username: $viewUsername})
OPTIONAL MATCH (v:User)-[r1:FOLLOW]->(u)
OPTIONAL MATCH (u:User)-[r2:FOLLOW]->(v)

RETURN v AS user, 
  v.smartWalletAddress AS smartWalletAddress,
  CASE WHEN r2 IS NOT NULL THEN true ELSE false END AS followsUser, 
  CASE WHEN r1 IS NOT NULL THEN true ELSE false END AS followedByUser
`