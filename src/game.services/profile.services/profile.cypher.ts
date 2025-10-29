/**
 * Cypher query to upload a profile picture for a user.
 * 
 * @param {string} $userName - The username of the user.
 * @param {number[]} $profilePictures - The binary data of the profile picture.
 * @returns {string} The Cypher query to upload the profile picture.
 */
export const uploadProfilePicCypher: string = `
    MATCH (u:User {username: $userName})
    SET u.profilePictures = coalesce(u.profilePictures, []) + $profilePictures
    RETURN u
`;



