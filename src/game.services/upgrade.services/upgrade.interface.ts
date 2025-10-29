/**
 * Represents data required to upgrade a card.
 * @interface UpgradeCardData
 * @property {string} uri - The URI of the card.
 */
export interface UpgradeCardData {
    uri: string
    upgradeItemUri: string
}

/**
 * Represents the result of checking whether a card can level up.
 * @interface CanLevelUp
 * @property {boolean} levelUp - Indicates whether the card can level up (`true`) or not (`false`).
 */
export interface CanLevelUp {
    levelUp: boolean
}


export interface CardUpgradeItem {
    uri: string;
    id: string;
    quantityConsumed: number;
}

export interface CardUpgradeData {
    cardUri: string;
    cardId: string;
    cardUpgrade: CardUpgradeItem[];
}

export interface CardUpgradeUpdate {
    id: string;
    uri: string;
    remainingQuantity: number;
    quantityConsumed: number;
}
