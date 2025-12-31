import mysql from 'mysql2';

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'aakrittii_db'
});

db.connect((err) => {
    if (err) {
        console.error("Connection Failed:", err);
        process.exit(1);
    }

    console.log("Resetting Admin Credentials...");

    // 1. Clear Users
    db.query('DELETE FROM admin_users', (err) => {
        if (err) console.error("Create Failed:", err);

        // 2. Insert New User
        const sql = "INSERT INTO admin_users (email, password_hash) VALUES ('admin', 'admin')";
        db.query(sql, (err) => {
            if (err) {
                console.error("Insert Failed:", err);
            } else {
                console.log("\nSuccess! Admin Reset.");
                console.log("------------------------");
                console.log("Username: admin");
                console.log("Password: admin");
                console.log("------------------------\n");
            }
            process.exit(0);
        });
    });
});
