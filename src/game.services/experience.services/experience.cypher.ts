/**
 * Cypher query to save user details, including player statistics, in the database.
 * @param $userName The username of the user whose details are to be saved.
 * @param $playerStats The player statistics to be saved for the user.
 */
export const saveUserDetails: string = `MATCH (u:User {username: $username}) 
SET u.playerStats = $playerStats`;
