import mysql from 'mysql2';

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'aakrittii_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Connection Failed:", err);
        return;
    }

    console.log("Connected to DB. Checking Users...");
    connection.query('SELECT * FROM admin_users', (err, results, fields) => {
        if (err) console.error(err);
        else {
            console.log("\n--- ADMIN USERS ---");
            results.forEach(u => console.log(`ID: ${u.id} | Email: ${u.email}`));
            console.log("-------------------\n");
        }
        connection.release();
        // Keep pool open or exit? For script, process.exit
        process.exit(0);
    });
});

db.query('SELECT id, email, password_hash, created_at FROM admin_users', (err, results) => {
    if (err) {
        console.error("Query Failed:", err);
    } else {
        console.log("\n--- ADMIN USERS ---");
        if (results.length === 0) {
            console.log("NO USERS FOUND! The table is empty.");
        } else {
            results.forEach(u => {
                console.log(`ID: ${u.id} | Email: ${u.email} | Password: ${u.password_hash}`);
            });
        }
        console.log("-------------------\n");
    }
    db.end();
});
});
