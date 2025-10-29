import { t } from "elysia";

/**
 * Schema for validating SoulMetaData.
 *
 * @type {Object}
 * @property {string} genre1 - The first genre.
 * @property {string} genre2 - The second genre.
 * @property {string} genre3 - The third genre.
 * @property {string} animal1 - The first animal.
 * @property {string} horoscope - The horoscope.
 */
export const soulMetaDataSchema = {
    headers: t.Object({ 
        authorization: t.String() }), 
    body: t.Object({
        genre1: t?.String(),
        genre2: t?.String(),
        genre3: t?.String(),
        animal1: t?.String(),
        animal2: t?.String(),
        animal3: t?.String(),
        horoscope: t?.String(),
        id: t?.String(),

    })
}

//
export const claimCardOwnershipRewardSchema = {
    headers: t.Object({ 
        authorization: t.String() }), 
    body: t.Object({
        name: t.String()
    })

}


export const claimMissionRewardSchema = {
    headers: t.Object({ 
        authorization: t.String() 
    }), 
    body: t.Object({
        id: t.String(),
        username: t.String(),                      // User's name
        type: t.String(),      // Type of mission (optional, only "song" is allowed)
        songName: t.String(),          // Name of the song (optional)
        songRewardType: t.String(), // Type of reward (optional, only "first" is allowed)
        reward: t.String(),            // The reward being claimed (optional)
        rewardName: t.String(),        // Name of the reward (optional)
        claimed: t.Boolean(),          // Status of whether the reward is claimed (optional)         // Timestamp of when the reward was claimed (optional)
        eligible: t.Boolean(),         // Status of eligibility for the reward (optional)
    })
};



/**
 * Schema for validating personal mission data.
 * 
 * @property {Object} headers - The headers object.
 * @property {string} headers.authorization - The authorization token.
 * 
 * @property {Object} body - The body object containing mission details.
 * @property {string} body.name - The name of the mission.
 * @property {'personal'} body.missionType - The type of the mission, which is always 'personal'.
 * @property {string} body.description - The description of the mission.
 * 
 * @property {Object} body.requirement - The requirement object for the mission.
 * @property {Object} body.requirement.criteria - The criteria object for the mission.
 * @property {'uniqueSongs' | 'score'} body.requirement.criteria.type - The type of criteria, which can be either 'uniqueSongs' or 'score'.
 * @property {number} body.requirement.criteria.value - The value associated with the criteria.
 * @property {string} [body.requirement.criteria.group] - An optional group identifier.
 * @property {string} body.requirement.criteria.description - The description of the criteria.
 * 
 * @property {Object} body.requirement.criteria.reward - The reward object for completing the mission.
 * @property {string} body.requirement.criteria.reward.name - The name of the reward.
 * @property {Array<any>} [body.requirement.criteria.reward.cards] - An optional array of cards included in the reward.
 * @property {number} [body.requirement.criteria.reward.beats] - An optional number of beats included in the reward.
 * @property {number} body.requirement.criteria.reward.amount - The amount of the reward.
 */
export const personalMissionSchema = {
	headers: t.Object({
		authorization: t.String()
	}),
	body: t.Object({
		name: t.String()
	})
};



