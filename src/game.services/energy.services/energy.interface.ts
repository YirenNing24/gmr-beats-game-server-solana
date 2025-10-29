

/**
 * Interface for the EnergyBottleBasic object
 * @name EnergyBottleBasic
 * @interface
 * @property {string} name - The name of the energy bottle.
 * @property {string} description - The description of the energy bottle.
 * @property {string} rechargeAmount - The amount of energy the bottle recharges.
 * @property {string} tier - The tier of the energy bottle.
 * @property {string} quantityOwned - The quantity of the energy bottle owned.
 */
export interface EnergyBottleMetadata {
    name: string;
    description: string;
    rechargeAmount: string;
    tier: string;
}

export interface EnergyBottleNFT {
    metadata: EnergyBottleMetadata;
    owner: string;
    type: "ERC1155";
    supply: string;
    quantityOwned?: string;
  }