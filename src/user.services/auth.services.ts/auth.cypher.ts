export const inventoryCypher: string = `
 CREATE (x:X_IN {
    Esha: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""},
    Nizz: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""},
    Nova: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""},
    Hannah: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""},
    Aria: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""}
 })

 CREATE (g:GREATGUYS {
    DongHwi: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""},
    HoRyeong: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""},
    BaekGyeol: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""}
 })

 CREATE (i:ICU {
    Abin: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""},
    Naye: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""},
    ChaeI: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""},
    Miku: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""}
 })

 CREATE (r:IROHM {
    Vocals: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""},
    Instrumental: {uri: "", tokenId: "", contractAddress: "", group: "", slot: ""}
 })

 CREATE (u)-[:INVENTORY]->(x)
 CREATE (u)-[:INVENTORY]->(g)
 CREATE (u)-[:INVENTORY]->(i)
 CREATE (u)-[:INVENTORY]->(r)
`;

