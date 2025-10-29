import { createClient } from 'redis';
import { KEYDB_HOST, KEYDB_PORT, KEYDB_PASSWORD } from '../config/constants';

const keydbUrl = `redis://:${KEYDB_PASSWORD}@${KEYDB_HOST}:${KEYDB_PORT}`;

// Create a new KeyDB client
const keydb = createClient({ url: keydbUrl });

// Listen for error events
keydb.on('error', err => console.log('KeyDB Client Error', err));

// Add success message on successful connection
keydb.on('connect', () => {
    console.log('Successfully connected to KeyDB!');
});

// Set a ping interval
const PING_INTERVAL_MS: number = 10000; // 10 seconds
keydb.on('ready', () => {
    console.log('KeyDB is ready. Setting up ping interval...');
    setInterval(async () => {
        try {
            await keydb.ping();
        } catch (error) {
            console.error('Error during ping:', error);
        }
    }, PING_INTERVAL_MS);
});

// Connect to KeyDB
await keydb.connect();

export default keydb;
