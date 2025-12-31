const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const tables = ['press_releases', 'clientele', 'activities', 'csr_connects', 'volunteers'];

db.serialize(() => {
    tables.forEach(table => {
        db.get(`SELECT count(*) as count FROM ${table}`, (err, row) => {
            if (err) console.error(err.message);
            else console.log(`${table}: ${row.count}`);
        });
    });
});
