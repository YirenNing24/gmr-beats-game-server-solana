//* ELYSIA
import Elysia from "elysia";
import { cors } from '@elysiajs/cors'

//* DATABASES
import { initDriver } from './db/memgraph';
import { mongoDBClient } from "./db/mongodb.client.js";
//* INITIALIZERS
import { NEO4J_PASSWORD, NEO4J_URI, NEO4J_USERNAME } from './config/constants.js';
import routes from "./routes/index";


// Initialize Elysia app
const app = new Elysia({
  serve: {
    idleTimeout: 60
  }
})

  

//@ts-ignore
  .use(cors({
    methods: ["GET", "POST", "HEAD", "PUT", "OPTIONS"],
    allowedHeaders: [
      "content-Type",
      "authorization",
      "origin",
      "x-Requested-with",
      "accept",
    ],
    credentials: true,
    maxAge: 600,
  }))


  async function initMongoDB(): Promise<void> {
    try {
      console.log("Connecting to MongoDB...");
      await mongoDBClient.connect();
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      process.exit(1); 
    }
  }


  async function startServer() {
    await initMongoDB(); 
  }



routes(app)

initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD);
startServer()

export default app