
/**
 * Personal mission interface.
 *
 * @interface DailyMission
 * @property {string} name - The name of the personal mission.
 * @property {string} description - The description of the personal mission.
 * @property {DailyMissionRequirement} requirement - The requirement of the personal mission.
 */
export interface DailyMission {
	name: string;
	missionType: 'daily';
	description: string;
	requirement: DailyMissionRequirement;
}

/**
 * Personal mission requirement interface.
 * 
 * @interface DailyMissionRequirement
 * @property {Object} criteria - The criteria of the personal mission requirement.
 * @property {string} criteria.type - The type of the criteria.
 * @property {number} criteria.value - The value of the criteria.
 * @property {string} criteria.description - The description of the criteria.
 */
interface DailyMissionRequirement {
	criteria: {
		type: "login";
		value: number;
		group?: string;
		description: string;
        reward: { name: string, cards?: Array<any>, beats?: number, amount: number };
	};
}

/**
 * Personal mission interface.
 *
 * @interface PersonalMission
 * @property {string} name - The name of the personal mission.
 * @property {string} description - The description of the personal mission.
 * @property {PersonalMissionRequirement} requirement - The requirement of the personal mission.
 */
export interface PersonalMission {
	name: string;
	missionType: 'personal';
	description: string;
	requirement: PersonalMissionRequirement;
}

/**
 * Personal mission requirement interface.
 * 
 * @interface PersonalMissionRequirement
 * @property {Object} criteria - The criteria of the personal mission requirement.
 * @property {string} criteria.type - The type of the criteria.
 * @property {number} criteria.value - The value of the criteria.
 * @property {string} criteria.description - The description of the criteria.
 */
interface PersonalMissionRequirement {
	criteria: {
		type: "uniqueSongs" | "score";
		value: number;
		group?: string;
		description: string;
        reward: { name: string, cards?: Array<any>, beats?: number, amount: number };
	};
}





export interface GetDailyMission extends DailyMission {
	claimed: boolean;
	elligible: boolean;
}


export interface GetPersonalMission extends PersonalMission {
	claimed: boolean;
	elligible: boolean;
}



/**
 * Reward interface.
 * 
 * @interface Reward
 * @property {string} name - The name of the reward.
 * @property {Array<any>} [cards] - The list of cards in the reward.
 * @property {number} beats - The number of beats in the reward.
 * @property {number} amount - The amount of the reward.
 */
export interface Reward {
	name: string;
	cards?: Array<any>;
	beats?: number;
	amount: number;
}


/**
 * Collection mission interface.
 *
 * @interface CollectionMission
 * @property {string} name - The name of the collection mission.
 * @property {string} description - The description of the collection mission.
 * @property {CollectionMissionRequirement} requirement - The requirement of the collection mission.
 */
export interface CollectionMission {
	name: string;
	missionType: 'collection';
	description: string;
	requirement: CollectionMissionRequirement;
}

/**
 * Collection mission requirement interface.
 *
 * @interface CollectionMissionRequirement
 * @property {Object} criteria - The criteria of the collection mission requirement.
 * @property {string} criteria.type - The type of the criteria (e.g., "random" or "specificGroup").
 * @property {number} criteria.value - The number of cards required to complete the mission.
 * @property {string} [criteria.group] - The specific group of cards required (if applicable).
 * @property {string} criteria.description - The description of the criteria.
 * @property {string} criteria.reward - The reward for completing the mission.
 */
interface CollectionMissionRequirement {
	criteria: {
		type: "random" | "specificGroup";
		value: number;
		group?: string; // Optional, only needed for specific groups
		description: string;
        reward: { name: string, cards?: Array<any>, beats?: number, amount: number };
	};
}


/**
 * User missions interface.
 * 
 * @interface UserMissions
 * @property {string} username - The username of the user.
 * @property {CompletedMission[]} completedMissions - The list of completed missions.
 * @property {string} createdAt - The date and time the user missions were created.
 * @property {string} updatedAt - The date and time the user missions were last updated.  
 */
export interface UserMissions {
	username: string;
	completedMissions: CompletedMission[];
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
}

/**
 * Completed mission interface.
 * 
 * @interface CompletedMission
 * @property {string} missionName - The name of the completed mission.
 * @property {string} completedAt - The date and time the mission was completed.
 * @property {boolean} rewardClaimed - Indicates whether the reward has been claimed.
 */
export interface CompletedMission {
	missionName: string;
	completedAt: string; // ISO date string
	rewardClaimed: boolean;
}