//** ELYSIA IMPORTS
import { ElysiaWS } from "elysia/ws";

//** MEMGRAPH IMPORTS
import { getDriver } from "../../db/memgraph";
import { Driver, ManagedTransaction, Session } from "neo4j-driver";

//** TOKEN SERVICE IMPORT
import TokenService from "../token.services/token.service";

//** OUTPUTS
import { SuccessMessage } from "../../outputs/success.message";



class ServerService {
	websocket?: ElysiaWS<any>;

	constructor(websocket?: ElysiaWS<any>) {
		this.websocket = websocket;
	}

    public async checkLatency(message: { type: string, timestamp: number }): Promise<void> {
        try {
            const ws = this.websocket;
    
            const clientTimestamp = message.timestamp; // From client (should be in ms)
            const serverTimestamp = Date.now(); // Server time in ms
    
            // Prepare response with server's current time
            const serverTimePing = [{ 
                "type": "pong", 
                "timestamp": clientTimestamp,  // Echo back the client's timestamp
                "server_time": serverTimestamp // Include server's timestamp for debugging
            }];
    
            const stringifyServerTime: string = JSON.stringify(serverTimePing);
            ws?.send(stringifyServerTime);
    
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }


    public async savePreferredServer(token: string, server: { link: string }): Promise<SuccessMessage> {
        const tokenService = new TokenService();
        try {
            const username: string = await tokenService.verifyAccessToken(token);
            const { link } = server;

            const driver: Driver = getDriver();
            const session: Session = driver.session();

            await session.executeWrite((tx: ManagedTransaction) =>
                tx.run(
                    `MATCH (u:User {username: $username}) 
                     SET u.preferredServer = $link
                     RETURN u`
                    ,
                    { username, link }
                )
            );

            return new SuccessMessage("Preferred server saved successfully.");
        } catch(error: any) {
            console.log(error);
            throw error;
        }
    }




    
 
}

export default ServerService