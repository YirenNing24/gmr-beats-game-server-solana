/**
 * Represents data of a card in the store.
 *
 * @interface StoreCardData
 * @property {string} name - Name of the card.
 * @property {string} description - Description of the card.
 * @property {string} group - Group to which the card belongs.
 * @property {string} era - Era of the card.
 * @property {string} scoreBoost - Score boost of the card.
 * @property {string} healBoost - Heal boost of the card.
 * @property {string} skill - Skill of the card.
 * @property {string} stars - Number of stars on the card.
 * @property {string} slot - Slot of the card.
 * @property {string} tier - Tier of the card.
 * @property {string} boostCount - Number of boost counts.
 * @property {string} awakenCount - Number of awaken counts.
 * @property {boolean} breakthrough - Indicates if the card has undergone breakthrough.
 * @property {string} artist - Artist of the card.
 * @property {string} position - Position of the card.
 * @property {string} position2 - Secondary position of the card.
 * @property {string} rarity - Rarity of the card.
 * @property {string} level - Level of the card.
 * @property {string} experience - Experience of the card.
 * @property {string} image - URL of the image of the card.
 * @property {string} uri - URI of the card.
 * @property {string} owner - Owner of the card.
 * @property {string} tokenId - Token ID of the card.
 * @property {string} id - Unique ID of the card.
 * @property {number} listingId - Listing ID of the card.
 * @property {string} cardAddress - Address of the card.
 * @property {string} uploader - Uploader of the card.
 * @property {string} supply - Total supply of the card.
 * @property {string} quantity - Quantity of the card.
 * @property {string} quantityOwned - Quantity owned of the card.
 * @property {string} startTime - Start time of the listing.
 * @property {string} endTime - End time of the listing.
 * @property {string} lister - Lister of the card.
 * @property {boolean} sold - Indicates if the card is sold.
 * @property {number} pricePerToken - Price per token of the card.
 * @property {string} currencyName - Name of the currency.
 */
export interface StoreCardData {
    name: string;
    description: string;
    group: string;
    era: string;
    scoreBoost: string;
    healBoost: string;
    skill: string;
    stars: string;
    slot: string;
    tier: string;
    boostCount: string;
    awakenCount: string;
    breakthrough: boolean;
    artist: string; 
    position: string;
    position2: string;
    rarity: string;
    level: string;
    experience: string;
    type: "ERC1155" | "ERC721" | "metaplex";
    image: string;
    imageByte: string;
    uri: string;
    owner: string;
    tokenId: string
    id: string;
    listingId: number | string;
    cardAddress: string;
    uploader: string;
    supply: string;
    quantity: 1
    quantityOwned: string
    startTime: string;
    endTime?: string;
    lister: string;
    pricePerToken: number
    currencyName: string
}


/**
 * Interface for buying card data.
 * @interface BuyCardData
 * @property {string} uri - URI of the card.
 * @property {number} listingId - Listing ID of the card.
 * @property {string} price - Price of the card.
 */
export interface BuyCardData {
    uri: string;
    listingId: number;
    price: string;
}




/**
 * Interface for buying card upgrade data.
 * @interface BuyCardUpgradeData
 * @property {string} uri - URI of the upgrade.
 * @property {number} listingId - Listing ID of the upgrade.
 * @property {string} quantity - Quantity of the upgrade.
 */
export interface BuyCardUpgradeData {
    uri: string;
    listingId: string;
    quantity: string
    price: string
}



/**
 * Represents data of a card upgrade in the store.
 *
 * @interface StoreCardUpgradeData
 * @property {string} currencyName - Name of the currency.
 * @property {string} editionAddress - Address of the edition.
 * @property {string} endTime - End time of the upgrade.
 * @property {number} experience - Experience of the upgrade.
 * @property {string} id - Unique ID of the upgrade.
 * @property {string} image - URL of the image of the upgrade.
 * @property {string} lister - Lister of the upgrade.
 * @property {number} listingId - Listing ID of the upgrade.
 * @property {boolean} minted - Indicates if the upgrade is minted.
 * @property {string} owner - Owner of the upgrade.
 * @property {number} pricePerToken - Price per token of the upgrade.
 * @property {number} quantity - Quantity of the upgrade.
 * @property {string} quantityOwned - Quantity owned of the upgrade.
 * @property {string} startTime - Start time of the upgrade.
 * @property {string} supply - Total supply of the upgrade.
 * @property {string} tier - Tier of the upgrade.
 * @property {string} tokenId - Token ID of the upgrade.
 * @property {string} type - Type of the upgrade.
 * @property {string} uploader - Uploader of the upgrade.
 * @property {string} uploaderBeats - Uploader beats of the upgrade.
 * @property {string} uri - URI of the upgrade.
 */
export interface StoreCardUpgradeData {
    currencyName: string;
    editionAddress: string;
    endTime: string;
    experience: number;
    id: string;
    image: string;
    lister: string;
    listingId: number;
    minted: boolean;
    owner: string;
    pricePerToken: number;
    quantity: number;
    quantityOwned: string;
    startTime: string;
    supply: string;
    tier: string;
    tokenId: string;
    type: string;
    uploader: string;
    uploaderBeats: string;
    uri: string;
}


export interface CardUpgradeAsset {
	id: string;
	uri: string;
	name: string;
	image: string;
	experience: number;
	itemType: string;
	minted: boolean;
	quantity: number;
	tier: string;
	uploader: string;
}




export interface StorePackData {
    currencyName: string;
    description: string;
    endTime: string; // Consider using a Date type if you need date manipulation
    id: string;
    image: string;
    lister: string;
    listingId: number;
    name: string;
    pricePerToken: number;
    quantity: number;
    startTime: string; // Consider using a Date type if you need date manipulation
    tokenId: string;
    type: string;
    uploader: string;
    uri: string;
}

