
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    try {
        const db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });

        const pillars = await db.all("SELECT * FROM pillars");
        console.log("Current Pillars in DB:");
        console.log(JSON.stringify(pillars, null, 2));

    } catch (err) {
        console.error("Error reading DB:", err);
    }
})();
