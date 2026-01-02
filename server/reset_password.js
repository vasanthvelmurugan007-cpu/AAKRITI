import { db } from './db.js';

const updatePassword = async () => {
    try {
        console.log("Updating admin password...");
        // Check if user exists
        const user = await db.get("SELECT * FROM admin_users WHERE email = 'admin'");
        if (user) {
            await db.run("UPDATE admin_users SET password_hash = 'Aakritii@2025' WHERE email = 'admin'");
            console.log("✅ Password updated successfully for user 'admin'.");
            console.log("New Password: Aakritii@2025");
        } else {
            console.log("User 'admin' not found. Creating...");
            await db.run("INSERT INTO admin_users (email, password_hash, role) VALUES ('admin', 'Aakritii@2025', 'admin')");
            console.log("✅ Admin user created with password: Aakritii@2025");
        }
    } catch (err) {
        console.error("❌ Error updating password:", err);
    }
};

updatePassword();
