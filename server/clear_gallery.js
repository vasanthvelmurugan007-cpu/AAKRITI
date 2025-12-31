import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'aakrittii_db'
});

db.connect(err => {
    if (err) {
        console.error("Connect Failed", err);
        process.exit(1);
    }
    console.log("Connected. Clearing Gallery Data...");

    // Disable Foreign Keys to allow truncate
    db.query('SET FOREIGN_KEY_CHECKS = 0', () => {
        db.query('TRUNCATE TABLE gallery_images', (err) => {
            if (err) console.error("Error clearing images:", err);
            else console.log("- Gallery Images Cleared");

            db.query('TRUNCATE TABLE gallery_folders', (err) => {
                if (err) console.error("Error clearing folders:", err);
                else console.log("- Gallery Folders Cleared");

                db.query('SET FOREIGN_KEY_CHECKS = 1', () => {
                    console.log("Done! Database is clean.");
                    process.exit(0);
                });
            });
        });
    });
});
