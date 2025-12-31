import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
console.log("Checking DB:", dbPath);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("DB Open Error:", err.message);
    } else {
        console.log("DB Connected.");
    }
});

db.serialize(() => {
    db.all("SELECT * FROM gallery_folders", [], (err, rows) => {
        if (err) console.error("Folders Error:", err.message);
        else {
            console.log(`\n--- FOLDERS (${rows.length}) ---`);
            rows.forEach(r => console.log(`[${r.id}] ${r.name}`));
        }
    });

    db.all("SELECT * FROM gallery_images", [], (err, rows) => {
        if (err) console.error("Images Error:", err.message);
        else {
            console.log(`\n--- IMAGES (${rows.length}) ---`);
            rows.forEach(r => console.log(`[ID ${r.id}] Folder: ${r.folder_id} | URL: ${r.image_url}`));
        }
    });
});
