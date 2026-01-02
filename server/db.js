import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;
const isProduction = !!process.env.DATABASE_URL;

const initDB = async () => {
    if (dbInstance) return dbInstance;

    if (isProduction) {
        console.log("🔌 Connecting to MySQL Database...");
        try {
            dbInstance = await mysql.createPool(process.env.DATABASE_URL);
            console.log("✅ Connected to MySQL");
        } catch (error) {
            console.error("❌ MySQL Connection Failed:", error);
            process.exit(1);
        }
    } else {
        console.log("📂 Connecting to Local SQLite Database...");
        try {
            dbInstance = await open({
                filename: path.join(__dirname, 'database.sqlite'),
                driver: sqlite3.Database
            });
            // Enable WAL mode for better concurrency
            await dbInstance.exec('PRAGMA journal_mode = WAL;');
            await dbInstance.configure('busyTimeout', 3000);
            console.log("✅ Connected to SQLite");
        } catch (error) {
            console.error("❌ SQLite Connection Failed:", error);
            process.exit(1);
        }
    }
    return dbInstance;
};

// Standardized Query Wrapper
export const db = {
    // Run a query that returns multiple rows
    all: async (sql, params = []) => {
        const conn = await initDB();
        if (isProduction) {
            const [rows] = await conn.execute(sql, params);
            return rows;
        } else {
            return await conn.all(sql, params);
        }
    },

    // Run a query that returns a single row
    get: async (sql, params = []) => {
        const conn = await initDB();
        if (isProduction) {
            const [rows] = await conn.execute(sql, params);
            return rows[0];
        } else {
            return await conn.get(sql, params);
        }
    },

    // Run an INSERT/UPDATE/DELETE query
    run: async (sql, params = []) => {
        const conn = await initDB();
        if (isProduction) {
            const [result] = await conn.execute(sql, params);
            // Normalize result to match SQLite format
            return {
                lastID: result.insertId,
                changes: result.affectedRows
            };
        } else {
            // SQLite wrapper returns an object with lastID/changes
            // We need to return a Promise that resolves to this object
            return await conn.run(sql, params);
        }
    },

    // Check if connected
    isConnected: () => !!dbInstance
};
