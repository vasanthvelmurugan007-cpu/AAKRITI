
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

        console.log("Updating Pillars images...");

        // 1. Education
        await db.run("UPDATE pillars SET image_url = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000' WHERE title = 'Education'");

        // 2. Support (replacing Nutrition image)
        await db.run("UPDATE pillars SET image_url = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1000' WHERE title = 'Support'");

        // 3. Hope (replacing Livelihood image)
        await db.run("UPDATE pillars SET image_url = 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=1000' WHERE title = 'Hope'");

        // 4. Love (replacing Love image)
        await db.run("UPDATE pillars SET image_url = 'https://images.unsplash.com/photo-1518398046578-8cca57782e36?q=80&w=1000' WHERE title = 'Love'");

        console.log("✅ Pillars updated with high-quality Unsplash images.");

    } catch (err) {
        console.error("❌ Update failed:", err);
    }
})();
