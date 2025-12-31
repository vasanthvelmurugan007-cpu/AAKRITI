import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

# Use environment variable or default to local SQLite path
DATABASE_URL = os.getenv("DATABASE_URL")

# Only works with SQLite databases
if DATABASE_URL and "mysql" in DATABASE_URL:
    print("Error: This script only works with SQLite databases.")
    print("For production MySQL/TiDB databases, use the admin panel to reset credentials.")
    exit(1)

# Default to local SQLite path
db_path = os.getenv("SQLITE_DB_PATH", os.path.join(os.path.dirname(__file__), "server", "database.sqlite"))

if not os.path.exists(db_path):
    print(f"Error: Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute('DELETE FROM admin_users')
    # Insert 'admin' / 'admin' to match the UI hint
    cursor.execute('INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)', 
                   ('admin', 'admin', 'admin'))
    
    # Also valid email format just in case
    cursor.execute('INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)', 
                   ('admin@aakrittii.org', 'admin123', 'admin'))
    
    conn.commit()
    print("Successfully reset admin users.")
    print("1. User: admin / Password: admin")
    print("2. User: admin@aakrittii.org / Password: admin123")

    print("\nCurrent Admin Users in DB:")
    for row in cursor.execute('SELECT id, email, password_hash, role FROM admin_users'):
        print(f"ID: {row[0]} | Email: {row[1]} | Pass: {row[2]} | Role: {row[3]}")
except sqlite3.Error as e:
    print(f"Database error: {e}")
finally:
    conn.close()
