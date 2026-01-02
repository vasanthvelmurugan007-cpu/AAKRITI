import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// sqlite3 removed, using db adapter
const sharp = require('sharp');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import DB Adapter
import { db } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// -- 1. SETUP LOCAL STORAGE (For Fallback/Thumbnail Gen) --
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const THUMB_DIR = path.join(__dirname, 'thumbnails');
if (!fs.existsSync(THUMB_DIR)) {
    fs.mkdirSync(THUMB_DIR, { recursive: true });
}

console.log('Serving static files from:', UPLOAD_DIR);
app.use('/uploads', express.static(UPLOAD_DIR));

// Thumbnail Endpoint
app.get('/api/thumbnail/:filename', async (req, res) => {
    const filename = req.params.filename;
    // ... thumbnail logic remains same ...
    const originalPath = path.join(UPLOAD_DIR, filename);
    const thumbPath = path.join(THUMB_DIR, filename);

    if (fs.existsSync(thumbPath)) {
        return res.sendFile(thumbPath);
    }

    if (!fs.existsSync(originalPath)) return res.sendStatus(404);

    try {
        await sharp(originalPath)
            .resize(400, null, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(thumbPath);
        res.sendFile(thumbPath);
    } catch (err) {
        console.error("Thumbnail error:", err);
        res.redirect(`/uploads/${filename}`);
    }
});

// -- 2. DATABASE INITIALIZATION --
// Initialize Tables
const initTables = async () => {
    const isMySQL = !!process.env.DATABASE_URL;
    const AUTO_INC = isMySQL ? 'AUTO_INCREMENT' : 'AUTOINCREMENT';

    try {
        // Admin Users
        await db.run(`CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY ${AUTO_INC},
            email VARCHAR(255) UNIQUE,
            password_hash VARCHAR(255),
            role VARCHAR(50) DEFAULT 'volunteer'
        )`);

        // Gallery Folders
        await db.run(`CREATE TABLE IF NOT EXISTS gallery_folders (
            id INTEGER PRIMARY KEY ${AUTO_INC},
            name VARCHAR(255),
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Gallery Images
        await db.run(`CREATE TABLE IF NOT EXISTS gallery_images (
            id INTEGER PRIMARY KEY ${AUTO_INC},
            folder_id INTEGER,
            image_url TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(folder_id) REFERENCES gallery_folders(id) ON DELETE CASCADE
        )`);

        // Press Releases
        await db.run(`CREATE TABLE IF NOT EXISTS press_releases (
            id INTEGER PRIMARY KEY ${AUTO_INC},
            title VARCHAR(255),
            date VARCHAR(50),
            content TEXT,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Clientele
        await db.run(`CREATE TABLE IF NOT EXISTS clientele (
            id INTEGER PRIMARY KEY ${AUTO_INC},
            name VARCHAR(255),
            description TEXT,
            logo_url TEXT
        )`);

        // Activities
        await db.run(`CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY ${AUTO_INC},
            title VARCHAR(255),
            date VARCHAR(50),
            location VARCHAR(255),
            description TEXT,
            image_url TEXT
        )`);

        // CSR Connects
        await db.run(`CREATE TABLE IF NOT EXISTS csr_connects (
            id INTEGER PRIMARY KEY ${AUTO_INC},
            company_name VARCHAR(255),
            description TEXT,
            logo_url TEXT,
            website_url TEXT
        )`);

        // Volunteers
        await db.run(`CREATE TABLE IF NOT EXISTS volunteers (
            id INTEGER PRIMARY KEY ${AUTO_INC},
            name VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(50),
            message TEXT,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Pillars
        await db.run(`CREATE TABLE IF NOT EXISTS pillars (
            id INTEGER PRIMARY KEY ${AUTO_INC},
            title VARCHAR(255),
            description TEXT,
            image_url TEXT,
            icon TEXT
        )`);

        // Seed Default Pillars
        const row = await db.get("SELECT count(*) as count FROM pillars");
        if (row && row.count === 0) {
            const defaults = [
                { title: "Education", description: "Unlocking potential through foundational learning and life skills.", image_url: "/pillar_education.jpg", icon: "BookOpen" },
                { title: "Support", description: "Providing encouragement, capacity-building, and presence for self-reliance.", image_url: "/pillar_nutrition.jpg", icon: "HandHeart" },
                { title: "Hope", description: "Planting seeds of transformation through acts of kindness.", image_url: "/pillar_livelihood.jpg", icon: "Sun" },
                { title: "Love", description: "Driven by compassion, respect, and empathy.", image_url: "/pillar_love.jpg", icon: "Heart" }
            ];
            for (const p of defaults) {
                await db.run("INSERT INTO pillars (title, description, image_url, icon) VALUES (?, ?, ?, ?)", [p.title, p.description, p.image_url, p.icon]);
            }
            console.log("Seeded Default Pillars");
        }

        // Default Admin
        const user = await db.get("SELECT * FROM admin_users WHERE email = 'admin'");
        if (!user) {
            await db.run("INSERT INTO admin_users (email, password_hash, role) VALUES ('admin', 'Aakritii@2025', 'admin')");
            console.log("Default Admin User Created (admin/admin)");
        }

        // Default Gallery
        const folderRow = await db.get("SELECT count(*) as count FROM gallery_folders");
        if (folderRow && folderRow.count === 0) {
            const result = await db.run("INSERT INTO gallery_folders (name, description) VALUES (?, ?)",
                ["Community Events", "Highlights from our recent community outreach programs."]);

            // Use lastID from the insert result
            const folderId = result.lastID;

            if (folderId) {
                await db.run("INSERT INTO gallery_images (folder_id, image_url, description) VALUES (?, ?, ?)",
                    [folderId, "/pillar_education.jpg", "Education Drive at Local School"]);
                await db.run("INSERT INTO gallery_images (folder_id, image_url, description) VALUES (?, ?, ?)",
                    [folderId, "/pillar_nutrition.jpg", "Nutrition Support Program"]);
                console.log("Seeded Default Gallery");
            }
        }
    } catch (err) {
        console.error("Table Init Error:", err);
    }
};

initTables();

const PORT = process.env.PORT || 3000;

// -- 3. API ROUTES --

// Configure Multer with Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();
app.use((req, res, next) => {
    console.log(`📡 Request: ${req.method} ${req.url}`);
    next();
});

console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
});

cloudinary.config({
    cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
    api_key: String(process.env.CLOUDINARY_API_KEY),
    api_secret: String(process.env.CLOUDINARY_API_SECRET)
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'aakrittii_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});
const upload = multer({ storage });

// -- GALLERY APIS --
app.get('/api/folders', async (req, res) => {
    const sql = `
        SELECT f.*,
    (SELECT image_url FROM gallery_images WHERE folder_id = f.id ORDER BY created_at ASC LIMIT 1) as cover_image
        FROM gallery_folders f
        ORDER BY f.created_at DESC
    `;
    try {
        const rows = await db.all(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});
app.post('/api/folders', async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await db.run('INSERT INTO gallery_folders (name, description) VALUES (?, ?)', [name, description]);
        res.json({ id: result.lastID, name, description });
    } catch (err) {
        res.status(500).json(err);
    }
});
app.delete('/api/folders/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM gallery_folders WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});
app.get('/api/images', async (req, res) => {
    try {
        const folderId = req.query.folderId;
        let rows;
        if (folderId) {
            rows = await db.all('SELECT * FROM gallery_images WHERE folder_id = ? ORDER BY created_at DESC', [folderId]);
        } else {
            rows = await db.all('SELECT * FROM gallery_images ORDER BY created_at DESC');
        }
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});
app.post('/api/images', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error("❌ Multer/Cloudinary Upload Error:", err);
            return res.status(500).json({ message: 'Upload failed', error: err.message });
        }
        next();
    });
}, async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file' });
    const { folderId, description } = req.body;
    const url = req.file ? req.file.path : '';
    console.log("✅ File uploaded to Cloudinary:", url);

    try {
        const result = await db.run('INSERT INTO gallery_images (folder_id, image_url, description) VALUES (?, ?, ?)',
            [folderId, url, description]);
        res.json({ id: result.lastID, folder_id: folderId, image_url: url, description });
    } catch (err) {
        console.error("❌ Database Insert Error:", err);
        res.status(500).json(err);
    }
});
app.delete('/api/images/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM gallery_images WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -- PILLARS API --
app.get('/api/pillars', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM pillars');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/api/pillars', upload.single('image'), async (req, res) => {
    const { title, description, icon } = req.body;
    const image_url = req.file ? req.file.path : (req.body.image_url || '');
    try {
        const result = await db.run('INSERT INTO pillars (title, description, image_url, icon) VALUES (?, ?, ?, ?)',
            [title, description, image_url, icon]);
        res.json({ id: result.lastID, title, description, image_url, icon });
    } catch (err) {
        res.status(500).json(err);
    }
});
app.put('/api/pillars/:id', upload.single('image'), async (req, res) => {
    const { title, description, icon } = req.body;
    let sql = 'UPDATE pillars SET title = ?, description = ?, icon = ?';
    let params = [title, description, icon];
    if (req.file) {
        sql += ', image_url = ?';
        params.push(req.file.path);
    }
    sql += ' WHERE id = ?';
    params.push(req.params.id);
    db.run(sql, params, function (err) {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Updated' });
    });
});
app.delete('/api/pillars/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM pillars WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -- PRESS RELEASES API --
app.get('/api/press-releases', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM press_releases ORDER BY date DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/api/press-releases', upload.single('image'), async (req, res) => {
    const { title, date, content } = req.body;
    const image_url = req.file ? req.file.path : '';
    try {
        const result = await db.run('INSERT INTO press_releases (title, date, content, image_url) VALUES (?, ?, ?, ?)',
            [title, date, content, image_url]);
        res.json({ id: result.lastID, title, date, content, image_url });
    } catch (err) {
        res.status(500).json(err);
    }
});
app.put('/api/press-releases/:id', upload.single('image'), async (req, res) => {
    const { title, date, content } = req.body;
    let sql = 'UPDATE press_releases SET title = ?, date = ?, content = ?';
    let params = [title, date, content];
    if (req.file) {
        sql += ', image_url = ?';
        params.push(req.file.path);
    }
    sql += ' WHERE id = ?';
    params.push(req.params.id);
    db.run(sql, params, function (err) {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Updated' });
    });
});
app.delete('/api/press-releases/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM press_releases WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -- CLIENTELE API --
app.get('/api/clientele', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM clientele');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/api/clientele', upload.single('logo'), async (req, res) => {
    const { name, description } = req.body;
    const logo_url = req.file ? req.file.path : '';
    try {
        const result = await db.run('INSERT INTO clientele (name, description, logo_url) VALUES (?, ?, ?)',
            [name, description, logo_url]);
        res.json({ id: result.lastID, name, description, logo_url });
    } catch (err) {
        res.status(500).json(err);
    }
});
app.put('/api/clientele/:id', upload.single('logo'), async (req, res) => {
    const { name, description } = req.body;
    let sql = 'UPDATE clientele SET name = ?, description = ?';
    let params = [name, description];
    if (req.file) {
        sql += ', logo_url = ?';
        params.push(req.file.path);
    }
    sql += ' WHERE id = ?';
    params.push(req.params.id);
    db.run(sql, params, function (err) {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Updated' });
    });
});
app.delete('/api/clientele/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM clientele WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -- ACTIVITIES API --
app.get('/api/activities', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM activities ORDER BY date DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/api/activities', upload.single('image'), async (req, res) => {
    const { title, date, location, description } = req.body;
    const image_url = req.file ? req.file.path : '';
    try {
        const result = await db.run('INSERT INTO activities (title, date, location, description, image_url) VALUES (?, ?, ?, ?, ?)',
            [title, date, location, description, image_url]);
        res.json({ id: result.lastID, title, date, location, description, image_url });
    } catch (err) {
        res.status(500).json(err);
    }
});
app.put('/api/activities/:id', upload.single('image'), async (req, res) => {
    const { title, date, location, description } = req.body;
    let sql = 'UPDATE activities SET title = ?, date = ?, location = ?, description = ?';
    let params = [title, date, location, description];
    if (req.file) {
        sql += ', image_url = ?';
        params.push(req.file.path);
    }
    sql += ' WHERE id = ?';
    params.push(req.params.id);
    db.run(sql, params, function (err) {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Updated' });
    });
});
app.delete('/api/activities/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM activities WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -- CSR CONNECTS API --
app.get('/api/csr-connects', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM csr_connects');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/api/csr-connects', upload.single('logo'), async (req, res) => {
    const { company_name, description, website_url } = req.body;
    const logo_url = req.file ? req.file.path : '';
    try {
        const result = await db.run('INSERT INTO csr_connects (company_name, description, logo_url, website_url) VALUES (?, ?, ?, ?)',
            [company_name, description, logo_url, website_url]);
        res.json({ id: result.lastID, company_name, description, logo_url, website_url });
    } catch (err) {
        res.status(500).json(err);
    }
});
app.put('/api/csr-connects/:id', upload.single('logo'), async (req, res) => {
    const { company_name, description, website_url } = req.body;
    let sql = 'UPDATE csr_connects SET company_name = ?, description = ?, website_url = ?';
    let params = [company_name, description, website_url];
    if (req.file) {
        sql += ', logo_url = ?';
        params.push(req.file.path);
    }
    sql += ' WHERE id = ?';
    params.push(req.params.id);
    db.run(sql, params, function (err) {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Updated' });
    });
});
app.delete('/api/csr-connects/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM csr_connects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -- VOLUNTEERS API --
app.get('/api/volunteers', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM volunteers ORDER BY submitted_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/api/volunteers', async (req, res) => {
    const { name, email, phone, message } = req.body;
    try {
        await db.run('INSERT INTO volunteers (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name, email, phone, message]);
        res.json({ message: 'Application Submitted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.delete('/api/volunteers/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM volunteers WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -- LOGIN API --
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`🔐 Login Attempt: Email='${email}', Password='${password}'`);
    try {
        const row = await db.get('SELECT * FROM admin_users WHERE email = ? AND password_hash = ?', [email, password]);
        console.log("🔍 DB Result:", row);
        if (row) {
            const role = row.role || 'admin';
            console.log("✅ Login Successful for:", email);
            res.json({ user: { email: row.email, id: row.id, role: role } });
        } else {
            console.log("❌ Login Failed: Invalid Credentials");
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json(err);
    }
});

// -- SERVE FRONTEND (Added for Single-Port Deployment) --
const CLIENT_BUILD_PATH = path.join(__dirname, '../dist');

// Serve static files from the React app build directory
app.use(express.static(CLIENT_BUILD_PATH));

// Handle React Routing, return all requests to React app
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
