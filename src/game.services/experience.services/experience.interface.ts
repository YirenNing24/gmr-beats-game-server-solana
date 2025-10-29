import { ClassicScoreStats } from "../leaderboard.services/leaderboard.interface";

/**
 * Represents the statistics of a player.
 *
 * @interface PlayerStats
 * @property {number} level - The player's level.
 * @property {number} playerExp - The player's experience points.
 * @property {number} availStatPoints - The available stat points for the player.
 * @property {string} rank - The player's rank.
 * @property {Object} statPointsSaved - The saved stat points for different roles.
 * @property {number} statPointsSaved.mainVocalist - The saved stat points for the main vocalist role.
 * @property {number} statPointsSaved.rapper - The saved stat points for the rapper role.
 * @property {number} statPointsSaved.leadDancer - The saved stat points for the lead dancer role.
 * @property {number} statPointsSaved.leadVocalist - The saved stat points for the lead vocalist role.
 * @property {number} statPointsSaved.mainDancer - The saved stat points for the main dancer role.
 * @property {number} statPointsSaved.visual - The saved stat points for the visual role.
 * @property {number} statPointsSaved.leadRapper - The saved stat points for the lead rapper role.
 */
export interface PlayerStats {
    level: number;
    playerExp: number;
    availStatPoints: number;
    rank: string;
    statPointsSaved: {
      mainVocalist: number;
      rapper: number;
      leadDancer: number;
      leadVocalist: number;
      mainDancer: number;
      visual: number;
      leadRapper: number;
    };
  }

/**
 * Represents the result of a level up operation.
 *
 * @interface LevelUpResult
 * @property {number} currentLevel - The player's current level after leveling up.
 * @property {number} currentExperience - The player's current experience points after leveling up.
 */
export interface LevelUpResult {
    currentLevel: number;
    currentExperience: number;
    experienceGained: number;
    beatsReward?: number | null;
    stats: PlayerStats;
    previousHighscore?: number;
    score: ClassicScoreStats
}