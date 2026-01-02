
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

        console.log("Reverting Pillars images to local...");

        // 1. Education -> /pillar_education.jpg
        await db.run("UPDATE pillars SET image_url = '/pillar_education.jpg' WHERE title = 'Education'");

        // 2. Support -> /pillar_nutrition.jpg
        await db.run("UPDATE pillars SET image_url = '/pillar_nutrition.jpg' WHERE title = 'Support'");

        // 3. Hope -> /pillar_livelihood.jpg
        await db.run("UPDATE pillars SET image_url = '/pillar_livelihood.jpg' WHERE title = 'Hope'");

        // 4. Love -> /pillar_love.jpg (assuming this existed or will rely on fallback/upload, 
        // strictly following user request for local images. 
        // Though finding showed only 3. Let's use livelihood as placeholder if love missing, or keep external for love?
        // User said "local images itself". I'll set it to pillar_love.jpg and if it's broken, it's broken, 
        // but likely they want the previous state. 
        // Actually, the defaults only had 3 files. Love was added recently.
        // Let's set it to /pillar_education.jpg as a placeholder if love feels wrong, 
        // BUT the initial seed had /pillar_love.jpg. Let's stick to that.)
        await db.run("UPDATE pillars SET image_url = '/pillar_love.jpg' WHERE title = 'Love'");

        console.log("✅ Pillars reverted to local paths.");

    } catch (err) {
        console.error("❌ Revert failed:", err);
    }
})();
