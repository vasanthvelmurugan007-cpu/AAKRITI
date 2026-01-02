
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    try {
        console.log("Forcing password reset on SQLite...");
        const db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });

        // Check user
        const user = await db.get("SELECT * FROM admin_users WHERE email = 'admin'");
        if (user) {
            await db.run("UPDATE admin_users SET password_hash = 'Aakritii@2025' WHERE email = 'admin'");
            console.log("✅ RESET SUCCESS: Password for 'admin' is now 'Aakritii@2025'");
        } else {
            await db.run("INSERT INTO admin_users (email, password_hash, role) VALUES ('admin', 'Aakritii@2025', 'admin')");
            console.log("✅ CREATE SUCCESS: Created 'admin' with 'Aakritii@2025'");
        }

    } catch (err) {
        console.error("❌ RESET FAILED:", err);
    }
})();
