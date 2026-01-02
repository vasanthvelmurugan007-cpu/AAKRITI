
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

        console.log("Cleaning up admin users...");
        await db.run("DELETE FROM admin_users WHERE email = 'admin'");
        console.log("Deleted all 'admin' users.");

        console.log("Creating fresh admin user...");
        await db.run("INSERT INTO admin_users (email, password_hash, role) VALUES ('admin', 'Aakritii@2025', 'admin')");
        console.log("✅ Admin user recreated successfully.");

    } catch (err) {
        console.error("Error fixing admin:", err);
    }
})();
