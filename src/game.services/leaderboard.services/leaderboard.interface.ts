/**
 * Represents the statistics of a classic score, including user information, score details, and note statistics.
 *
 * @interface ClassicScoreStats
 * @property {string} difficulty - The difficulty level of the score.
 * @property {number} score - The score achieved.
 * @property {number} combo - The total combo achieved during the score.
 * @property {number} maxCombo - The maximum combo achieved.
 * @property {number} accuracy - The accuracy of the score.
 * @property {boolean} finished - Indicates if the score was completed.
 * @property {string} songName - The name of the song for the score.
 * @property {string} artist - The artist of the song.
 * @property {number} perfect - The number of perfect notes hit.
 * @property {number} veryGood - The number of very good notes hit.
 * @property {number} good - The number of good notes hit.
 * @property {number} bad - The number of bad notes hit.
 * @property {number} miss - The number of missed notes.
 * @property {string} username - The username of the player who achieved the score.
 * @property {number} peerId - The unique identifier for the player.
 * @property {Date} timestamp - The date and time when the score was achieved.
 */
export interface ClassicScoreStats {
    difficulty: string;
    score: number;
    combo: number;
    maxCombo: number;
    accuracy: number;
    finished: boolean;
    songName: string;
    artist: string;
    perfect: number;
    veryGood: number;
    good: number;
    bad: number;
    miss: number;
    username: string;
    gameId: string;

}

export interface savedClassicScoreStats extends ClassicScoreStats {
    timestamp: string
    image: string

}

/**
 * Represents the request parameters for retrieving classic mode leaderboard.
 *
 * @interface ClassicLeaderboardRequest
 * @property {string} gameMode - The game mode for which the leaderboard is requested.
 * @property {string} songName - The name of the song for the leaderboard.
 * @property {string} period - The period for which the leaderboard is requested.
 * @property {string} difficulty - The difficulty level for the leaderboard.
 */
export interface ClassicLeaderboardRequest {
    gameMode: string;
    songName: string;
    period: string;
    difficulty: string;
}

/**
 * Represents a request to retrieve a score by peer ID.
 *
 * @interface ScorePeerId
 * @property {string} peerId - The unique identifier for the player.
 */
export interface ScorePeerId { 
    peerId: string;
}

/**
 * Represents the query parameters for retrieving leaderboard data.
 *
 * @interface LeaderboardQuery
 * @property {string} gameMode - The game mode for which the leaderboard is requested.
 * @property {string} songName - The name of the song for the leaderboard.
 * @property {string} period - The period for which the leaderboard is requested.
 * @property {string} difficulty - The difficulty level for the leaderboard.
 */
export interface LeaderboardQuery {
    // gameMode: string; 
    songName: string; 
    period: string;   
    difficulty: string; 
}
