/**
 * Represents a card inventory where the keys are strings and values are objects
 * containing an 'Item' property.
 * @interface
 */
export interface CardInventory {
  [key: string]: {
    Item: null | string; // Change 'any' to the appropriate type for 'Item'
  };
}

/**
 * Represents a power-up inventory where the keys are strings and values are objects
 * containing 'Item' and 'Stack' properties.
 * @interface
 */
export interface PowerUpInventory {
  [key: string]: {
    Item: null | string; // Change 'any' to the appropriate type for 'Item'
    Stack: null| number; // Change 'any' to the appropriate type for 'Stack'
  };
}

export type EquipInventory = Array<IveEquip>;

/**
 * Represents player statistics including level, experience, available stat points, rank,
 * and saved stat points for various roles.
 * @interface
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
};

/**
 * Represents inventory equipment slot for members of the group IVE, including strings for each member.
 * @interface
 */
export interface IveEquip {
  IveEquip: {
    [key: string]: Member;
  };
}

export interface Member{
  Equipped: boolean;
  Item: string | null;
}

export const iveEquip: IveEquip = {
  "IveEquip":{
     "Wonyoung":{
        "Equipped": false,
        "Item": null,

     },
     "Yujin":{
        "Equipped": false,
        "Item": null,

     },
     "Rei":{
        "Equipped": false,
        "Item": null,

     },
     "Liz":{
        "Equipped": false,
        "Item": null,

     },
     "Gaeul":{
        "Equipped": false,
        "Item": null,

     },
     "Leeseo":{
        "Equipped": false,
        "Item": null,
     }
  }
}


export const equipInventory: EquipInventory = [
  iveEquip,
]


export const cardInventory: CardInventory =  {
    "Inv1": { "Item": null },
    "Inv2": { "Item": null },
    "Inv3": { "Item": null },
    "Inv4": { "Item": null },
    "Inv5": { "Item": null },
    "Inv6": { "Item": null },
    "Inv7": { "Item": null },
    "Inv8": { "Item": null },
    "Inv9": { "Item": null },
    "Inv10": { "Item": null },
    "Inv11": { "Item": null },
    "Inv12": { "Item": null },
    "Inv13": { "Item": null },
    "Inv14": { "Item": null },
    "Inv15": { "Item": null },
    "Inv16": { "Item": null },
    "Inv17": { "Item": null },
    "Inv18": { "Item": null },
    "Inv19": { "Item": null },
    "Inv20": { "Item": null },
    "Inv21": { "Item": null },
    "Inv22": { "Item": null },
    "Inv23": { "Item": null },
    "Inv24": { "Item": null },
    "Inv25": { "Item": null },
    "Inv26": { "Item": null },
    "Inv27": { "Item": null },
    "Inv28": { "Item": null },
    "Inv29": { "Item": null },
    "Inv30": { "Item": null },
    "Inv31": { "Item": null },
    "Inv32": { "Item": null },
    "Inv33": { "Item": null },
    "Inv34": { "Item": null },
    "Inv35": { "Item": null },
    "Inv36": { "Item": null },
    "Inv37": { "Item": null },
    "Inv38": { "Item": null },
    "Inv39": { "Item": null },
    "Inv40": { "Item": null },
    "Inv41": { "Item": null },
    "Inv42": { "Item": null },
    "Inv43": { "Item": null },
    "Inv44": { "Item": null },
    "Inv45": { "Item": null },
    "Inv46": { "Item": null },
    "Inv47": { "Item": null },
    "Inv48": { "Item": null },
    "Inv49": { "Item": null },
    "Inv50": { "Item": null },
    "Inv51": { "Item": null },
    "Inv52": { "Item": null },
    "Inv53": { "Item": null },
    "Inv54": { "Item": null },
    "Inv55": { "Item": null },
    "Inv56": { "Item": null },
    "Inv57": { "Item": null },
    "Inv58": { "Item": null },
    "Inv59": { "Item": null },
    "Inv60": { "Item": null },
    "Inv61": { "Item": null },
    "Inv62": { "Item": null },
    "Inv63": { "Item": null },
    "Inv64": { "Item": null },
    "Inv65": { "Item": null },
    "Inv66": { "Item": null },
    "Inv67": { "Item": null },
    "Inv68": { "Item": null },
    "Inv69": { "Item": null },
    "Inv70": { "Item": null },
    "Inv71": { "Item": null },
    "Inv72": { "Item": null },
    "Inv73": { "Item": null },
    "Inv74": { "Item": null },
    "Inv75": { "Item": null },
    "Inv76": { "Item": null },
    "Inv77": { "Item": null },
    "Inv78": { "Item": null },
    "Inv79": { "Item": null },
    "Inv80": { "Item": null },
    "Inv81": { "Item": null },
    "Inv82": { "Item": null },
    "Inv83": { "Item": null },
    "Inv84": { "Item": null },
    "Inv85": { "Item": null },
    "Inv86": { "Item": null },
    "Inv87": { "Item": null },
    "Inv88": { "Item": null },
    "Inv89": { "Item": null },
    "Inv90": { "Item": null },
    "Inv91": { "Item": null },
    "Inv92": { "Item": null },
    "Inv93": { "Item": null },
    "Inv94": { "Item": null },
    "Inv95": { "Item": null },
    "Inv96": { "Item": null },
    "Inv97": { "Item": null },
    "Inv98": { "Item": null },
    "Inv99": { "Item": null },
    "Inv100": { "Item": null },
    "Inv101": { "Item": null },
    "Inv102": { "Item": null },
    "Inv103": { "Item": null },
    "Inv104": { "Item": null },
    "Inv105": { "Item": null },
    "Inv106": { "Item": null },
    "Inv107": { "Item": null },
    "Inv108": { "Item": null },
    "Inv109": { "Item": null },
    "Inv110": { "Item": null },
    "Inv111": { "Item": null },
    "Inv112": { "Item": null },
    "Inv113": { "Item": null },
    "Inv114": { "Item": null },
    "Inv115": { "Item": null },
    "Inv116": { "Item": null },
    "Inv117": { "Item": null },
    "Inv118": { "Item": null },
    "Inv119": { "Item": null },
    "Inv120": { "Item": null },
    "Inv121": { "Item": null },
    "Inv122": { "Item": null },
    "Inv123": { "Item": null },
    "Inv124": { "Item": null },
    "Inv125": { "Item": null },
    "Inv126": { "Item": null },
    "Inv127": { "Item": null },
    "Inv128": { "Item": null },
    "Inv129": { "Item": null },
    "Inv130": { "Item": null },
    "Inv131": { "Item": null },
    "Inv132": { "Item": null },
    "Inv133": { "Item": null },
    "Inv134": { "Item": null },
    "Inv135": { "Item": null },
    "Inv136": { "Item": null },
    "Inv137": { "Item": null },
    "Inv138": { "Item": null },
    "Inv139": { "Item": null },
    "Inv140": { "Item": null },
    "Inv141": { "Item": null },
    "Inv142": { "Item": null },
    "Inv143": { "Item": null },
    "Inv144": { "Item": null },
    "Inv145": { "Item": null },
    "Inv146": { "Item": null },
    "Inv147": { "Item": null },
    "Inv148": { "Item": null },
    "Inv149": { "Item": null },
    "Inv150": { "Item": null }
};


export const powerUpInventory: PowerUpInventory = {
    "Inv1": {
      "Item": null,
      "Stack": null
    },
    "Inv2": {
      "Item": null,
      "Stack": null
    },
    "Inv3": {
      "Item": null,
      "Stack": null
    },
    "Inv4": {
      "Item": null,
      "Stack": null
    },
    "Inv5": {
      "Item": null,
      "Stack": null
    },
    "Inv6": {
      "Item": null,
      "Stack": null
    },
    "Inv7": {
      "Item": null,
      "Stack": null
    },
    "Inv8": {
      "Item": null,
      "Stack": null
    },
    "Inv9": {
      "Item": null,
      "Stack": null
    },
    "Inv10": {
      "Item": null,
      "Stack": null
    },
    "Inv11": {
      "Item": null,
      "Stack": null
    },
    "Inv12": {
      "Item": null,
      "Stack": null
    },
    "Inv13": {
      "Item": null,
      "Stack": null
    },
    "Inv14": {
      "Item": null,
      "Stack": null
    },
    "Inv15": {
      "Item": null,
      "Stack": null
    },
    "Inv16": {
      "Item": null,
      "Stack": null
    },
    "Inv17": {
      "Item": null,
      "Stack": null
    },
    "Inv18": {
      "Item": null,
      "Stack": null
    },
    "Inv19": {
      "Item": null,
      "Stack": null
    },
    "Inv20": {
      "Item": null,
      "Stack": null
    },
    "Inv21": {
      "Item": null,
      "Stack": null
    },
    "Inv22": {
      "Item": null,
      "Stack": null
    },
    "Inv23": {
      "Item": null,
      "Stack": null
    },
    "Inv24": {
      "Item": null,
      "Stack": null
    },
    "Inv25": {
      "Item": null,
      "Stack": null
    },
    "Inv26": {
      "Item": null,
      "Stack": null
    },
    "Inv27": {
      "Item": null,
      "Stack": null
    },
    "Inv28": {
      "Item": null,
      "Stack": null
    },
    "Inv29": {
      "Item": null,
      "Stack": null
    },
    "Inv30": {
      "Item": null,
      "Stack": null
    },
    "Inv31": {
      "Item": null,
      "Stack": null
    },
    "Inv32": {
      "Item": null,
      "Stack": null
    },
    "Inv33": {
      "Item": null,
      "Stack": null
    },
    "Inv34": {
      "Item": null,
      "Stack": null
    },
    "Inv35": {
      "Item": null,
      "Stack": null
    },
    "Inv36": {
      "Item": null,
      "Stack": null
    },
    "Inv37": {
      "Item": null,
      "Stack": null
    },
    "Inv38": {
      "Item": null,
      "Stack": null
    },
    "Inv39": {
      "Item": null,
      "Stack": null
    },
    "Inv40": {
      "Item": null,
      "Stack": null
    },
    "Inv41": {
      "Item": null,
      "Stack": null
    },
    "Inv42": {
      "Item": null,
      "Stack": null
    },
    "Inv43": {
      "Item": null,
      "Stack": null
    },
    "Inv44": {
      "Item": null,
      "Stack": null
    },
    "Inv45": {
      "Item": null,
      "Stack": null
    },
    "Inv46": {
      "Item": null,
      "Stack": null
    },
    "Inv47": {
      "Item": null,
      "Stack": null
    },
    "Inv48": {
      "Item": null,
      "Stack": null
    },
    "Inv49": {
      "Item": null,
      "Stack": null
    },
    "Inv50": {
      "Item": null,
      "Stack": null
    }
};
  
export const playerStats: PlayerStats = {
  "level": 1, "playerExp": 0, "availStatPoints": 7, "rank": "Debut",
    "statPointsSaved": {
      "mainVocalist": 1,
      "rapper": 1,
      "leadDancer": 1,
      "leadVocalist": 1,
      "mainDancer": 1,
      "visual": 1,
      "leadRapper": 1}
};