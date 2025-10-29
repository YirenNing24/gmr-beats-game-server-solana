/**
 * Represents the data required to redeem a bundle.
 *
 * @interface RedeemBundle
 * @property {number} bundleId - The ID of the bundle to be redeemed.
 * @property {number} amount - The amount of the bundle to be redeemed.
 */
export interface RedeemBundle {
    bundleId: number;
    amount: number;
}

/**
 * Represents the rewards obtained from redeeming a bundle.
 *
 * @interface BundleRewards
 * @property {Object[]} tokenReward - An array of token rewards.
 * @property {string} tokenReward[].contractAddress - The contract address of the token reward.
 * @property {string | number} tokenReward[].quantityPerReward - The quantity of tokens per reward.
 * @property {Object[]} cardRewards - An array of card rewards.
 * @property {string | number | bigint} cardRewards[].tokenId - The token ID of the card reward.
 * @property {string} cardRewards[].contractAddress - The contract address of the card reward.
 * @property {string | number | bigint} cardRewards[].quantityPerReward - The quantity of cards per reward.
 */
export interface BundleRewards {
    tokenReward: {
        contractAddress: string;
        quantityPerReward: string | number;
    }[];
    cardRewards: {
        tokenId: string | number | bigint;
        contractAddress: string;
        quantityPerReward: string | number | bigint;
    }[];
}



export interface PackDataItem {
    child: boolean;
    description: string;
    id: string;
    image: string;
    name: string;
    quantity: number;
    type: string;
    uploader: string;
    uri: string;
}

export interface PackData {
	[key: string]: PackDataItem;
}

export interface OpenPackData {
    child: boolean;
    currencyName: string;
    description: string;
    endTime: string;
    id: string;
    image: string;
    lister: string;
    listingId: number;
    name: string;
    pricePerToken: number;
    quantity: number;
    startTime: string;
    tokenId: string;
    type: string;
    uploader: string;
    uri: string;
}


export interface CardPackRate {
    cardPackData: CardNameWeight[];
    packName: string;

}


export interface CardNameWeight {
    cardName: string;
    weight: number;
}