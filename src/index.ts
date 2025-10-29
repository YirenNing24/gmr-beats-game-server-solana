import app from "./app";
import { APP_PORT } from "./config/constants";


const port: number = APP_PORT;
const hostname: string = 'localhost'


app.listen({ port }, async () => {
    console.log(`Beats game HTTP server is running on port http://${hostname}:${port}/`);
    }
);
