import { db } from './db.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

console.log("Running Database Initialization...");

// Re-use logic from server.js? 
// Actually, server.js now auto-initializes tables on start.
// So this script is less critical, but can serve as a "reset/verify" tool.

const runInit = async () => {
    try {
        // Just verify connection
        if (process.env.DATABASE_URL) {
            console.log("Checking connection to MySQL...");
        } else {
            console.log("Checking connection to SQLite...");
        }

        // Check a simple query
        const row = await db.get("SELECT 1 as val");
        console.log("Connection successful! Value:", row.val);

        console.log("Tables are initialized automatically by server.js on startup.");
        process.exit(0);
    } catch (err) {
        console.error("Initialization Failed:", err);
        process.exit(1);
    }
};

runInit();
