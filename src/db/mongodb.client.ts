import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGO_HOST, MONGO_SOCKET_TIMEOUT_MS, MONGO_TIMEOUT_MS, MONGO_TLS } from "../config/constants";

// Convert MONGO_TLS to boolean
const tlsEnabled: boolean = MONGO_TLS === "true"; // Explicit conversion

// Connection URI with environment variables
const uri: string = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}`;
// const uri = "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const mongoDBClient = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
	// ✅ Enable TLS if needed
	tlsAllowInvalidCertificates: tlsEnabled,
	tls: tlsEnabled,

	// ✅ Increase timeouts to handle network fluctuations
	connectTimeoutMS: 30000, // 30 sec to establish a connection
	socketTimeoutMS: 60000, // 60 sec for socket operations
	serverSelectionTimeoutMS: 15000, // 15 sec to find a server
	heartbeatFrequencyMS: 10000, // Send heartbeats every 10s

	// ✅ Connection Pooling (reuse instead of reconnecting)
	minPoolSize: 10, // Keep at least 10 connections
	maxPoolSize: 100, // Limit max connections
	maxIdleTimeMS: 60000, // Close idle connections after 60 sec

	// ✅ Retry Mechanisms for Better Stability
	retryWrites: true, // Auto-retry failed writes
	retryReads: true, // Auto-retry failed reads
	timeoutMS: MONGO_TIMEOUT_MS, // 30 sec for operations
	waitQueueTimeoutMS: 5000, // 5 sec for waiting for a connection
	

	// ✅ Automatic Compression (reduces network usage)
});






// 


// async function run() {
// 	try {
// 		// Connect the client to the server (optional starting in v4.7)
// 		await mongoDBClient.connect();

// 		try {
// 			// Attempt to drop the collection
// 			await mongoDBClient.db("admin").createCollection("tite")
// 			console.log("Collection 'tite' dropped successfully.");
// 		} catch (dropError: any) {
// 			// Handle errors related to dropping the collection
// 			console.error("Error dropping collection:", dropError.message);
// 		}

// 		console.log("Pinged your deployment. You successfully connected to MongoDB!");
// 	} catch (connectError: any) {
// 		// Handle errors related to connecting to the database
// 		console.error("Error connecting to MongoDB:", connectError.message);
// 	} finally {
// 		// Ensure the client closes when finished or on error
// 		try {
// 			await mongoDBClient.close();
// 			console.log("MongoDB client closed.");
// 		} catch (closeError: any) {
// 			console.error("Error closing MongoDB client:", closeError.message);
// 		}
// 	}
// }

// // Run the function
// run().catch(console.dir);
