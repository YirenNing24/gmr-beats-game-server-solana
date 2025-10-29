//** ELYSIA IMPORT
import Elysia, { t } from "elysia";

//** SERVER SERVICE IMPORT
import ServerService from "../user.services/auth.services.ts/server.service";

//** OUTPUTS
import { SuccessMessage } from "../outputs/success.message";

//** SCHEMA IMPORTS
import { preferredServerSchema } from "../user.services/auth.services.ts/server.schema";


const server = (app: Elysia): void => {
    app.ws('/api/ping', {
        // Validate the incoming WebSocket message
        body: t.Object({ type: t.String(), timestamp: t.Number() }),
        async message(ws, message) {
            try {

                // Initialize the ServerService with the WebSocket instance
                const serverService: ServerService = new ServerService(ws);

                // Process the latency check
                serverService.checkLatency(message);

            } catch (error: any) {
                console.error('Error in WebSocket message event:', error);
                throw error;
            }
        }
        }
    )

    .post('/api/save-preferred-server', async ({ headers, body }): Promise<SuccessMessage> => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
            const serverService: ServerService = new ServerService();

            const result: SuccessMessage = await serverService.savePreferredServer(jwtToken, body);

            return result;
        }   catch (error: any) {
            console.error('Error in save-preferred-server:', error);
            throw error;
        }
    }, preferredServerSchema
    )
}

export default server;
