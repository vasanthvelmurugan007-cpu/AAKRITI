import { db } from './db.js';

const resetAdmin = async () => {
    console.log("🔄 Resetting Admin User...");
    try {
        const email = 'admin';
        const password = 'admin'; // Plain text as per current implementation

        // Check if user exists
        const user = await db.get("SELECT * FROM admin_users WHERE email = ?", [email]);

        if (user) {
            console.log("Found existing admin user. Updating password...");
            await db.run("UPDATE admin_users SET password_hash = ? WHERE email = ?", [password, email]);
        } else {
            console.log("Admin user not found. Creating...");
            await db.run("INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)", [email, password, 'admin']);
        }

        console.log("✅ Admin credentials verified/reset.");
        console.log("Email: admin");
        console.log("Password: admin");
        process.exit(0);
    } catch (err) {
        console.error("❌ Failed to reset admin:", err);
        process.exit(1);
    }
};

resetAdmin();
