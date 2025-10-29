import { StringLike } from "bun"

/**
 * Represents the return data structure from the card Editition Contract in the blockchain.
 *
 * @property {metadata} the CardMetaData interface.
 * @property {owner} the wallet address that owns the card NFT.
 * @property {type} the type of NFT Standard which is ERC-1155 for the card NFTs.
 * @property {supply} the number of the same NFTs minted, note each Card NFTs are uniquely minted.
 * @property {quantityOwned} the number of this card NFT owned by the owner address.
 */
export interface CardNFT {
    metadata: CardMetaData
    owner: string
    type: "ERC1155"
    supply: string
    quantityOwned?: string
  }


/**
 * Represents the card metadata interface which is the a property of the CardNFT object.
 *
 * @property {breakthrough} Card property that dictates if the card is ready to go the next tier by reaching the breakthrough level.
 * @property {skillEquipped} Card property that dictates if the card's skill is toggled by the player
 * @property {cardAddress} the contract address that minted the card.
 * @property {description} the higher level description ofthe card meant to be readable for players.
 * @property {era} the era model/design of the card, corresponds to the title track of the group's song.
 * @property {experience} the experience gained by the card.
 * @property {healboost} the health recovery boost added by the card while playing.
 * @property {id} the card's token ID relative to the contract where it was minted from.
 * @property {image} the URI of the card's image from IPFS.
 * @property {level} the current level of the card.
 * @property {name} the card's name. The naming standard is: Artist's name + Era + Rarity.
 * @property {owner} the wallet address of the owner
 * @property {position} the position of the artist in their respective group. Also corresponsds to the equip slot in the game inventory
 * @property {position} the secondary position of the artist in their respective group. Also corresponsds to the equip slot in the game inventory
 * @property {quantityOwned} the number of this card NFT owned by the owner address.
 * @property {rarity} the rarity of the card
 * @property {scoreboost} the score boost added by the card while playing
 * @property {skill} the skill that a card adds while in-game, a card doesn't always have a skill
 * @property {stars} indicates the stars a card has indicating if it's ready for breakthrough to next tier, the starts are relative to the card's level
 * @property {supply} the number of this card's duplicates
 * @property {tier} the tier of the card
 * @property {type} the type of the card's NFT standard which ERC-1155
 * @property {uri} the uri of the card saved on IPFS which contains the cards metadata
 */
export interface CardMetaData {
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
    skillEquipped: boolean;
    artist: string; 
    position: string;
    position2: string;
    rarity: string;
    level: string;
    zodiac: string;
    animal: string;
    experience: string;
    currentExperience: string;
    image: string;
    imageByte?: string;

    uri: string;
    owner: string;
    tokenId: string;
    contractAddress: string;
    id: string;
    listingId: number;
    cardAddress: string;
    uploader: string;
    supply: string;
    quantity: 1
    quantityOwned: string
    lister?: string;
    pricePerToken?: number
    currencyName?: string
    transferred?: string
 };


/**
 * Interface for updating inventory data.
 * @property {uri} the uri of the card saved on IPFS which contains the cards metadata
 * @property {tokenId} the token ID of the card
 * @property {contractAddress} the contract address of the card
 * @property {group} the group of the card
 * @property {slot} the slot of the card
 */
export interface UpdateInventoryData {
  uri: string;
  tokenId: string;
  contractAddress: string;
  group: string;
  slot: string;
  name: string;
}


/**
 * Type representing inventory card data indexed by URI.
 */
export type InventoryCardData = { [uri: string]: CardMetaData };

/**
 * Type representing an array containing two arrays of inventory card data.
 * The first array contains owned and bagged cards, and the second array contains owned and equipped cards.
 */
export type InventoryCards = [InventoryCardData[], InventoryCardData[]];



export interface CardPackData {
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



export interface UpdateData {
  uri: string;
  tokenId: string;
  contractAddress: string;
  group: string;
  slot: string;
}

interface EquippedItem {
	uri: string;
	tokenId: string;
	contractAddress: string;
	group: string;
	slot: string;
	name: string;
}

export type EquippedItemsInv = EquippedItem[];
