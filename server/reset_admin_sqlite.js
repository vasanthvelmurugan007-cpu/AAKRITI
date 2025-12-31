import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
console.log("Using DB:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("DB Open Error:", err.message);
        process.exit(1);
    }
});

db.serialize(() => {
    // 1. Check existing users
    db.all("SELECT * FROM admin_users", [], (err, rows) => {
        if (err) console.error("Query Error:", err.message);
        else {
            console.log(`\n--- EXISTING USERS (${rows.length}) ---`);
            rows.forEach(r => console.log(`ID: ${r.id} | Email: ${r.email} | Pass: ${r.password_hash}`));
        }
    });

    // 2. Reset Users
    console.log("\nResetting to default (admin / admin)...");
    db.run("DELETE FROM admin_users", (err) => {
        if (err) {
            console.error("Delete Error:", err.message);
            return;
        }

        const stmt = db.prepare("INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)");
        stmt.run("admin", "admin", "admin", (err) => {
            if (err) console.error("Insert Error:", err.message);
            else console.log("SUCCESS: User 'admin' created with password 'admin'.");
            stmt.finalize();
        });
    });
});
