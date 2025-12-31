import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const tables = ['press_releases', 'clientele', 'activities', 'csr_connects', 'volunteers', 'gallery_images', 'gallery_folders'];

function listCounts(callback) {
    console.log('\n--- Current Record Counts ---');
    let completed = 0;
    tables.forEach(table => {
        db.get(`SELECT count(*) as count FROM ${table}`, (err, row) => {
            if (err) console.log(`${table}: Error - ${err.message}`);
            else console.log(`${table}: ${row.count}`);

            completed++;
            if (completed === tables.length) callback();
        });
    });
}

function clearTable(tableName, callback) {
    db.run(`DELETE FROM ${tableName}`, (err) => {
        if (err) console.error(`Error clearing ${tableName}:`, err.message);
        else console.log(`Cleared ${tableName}.`);
        callback();
    });
}

function menu() {
    listCounts(() => {
        console.log('\n--- Menu ---');
        console.log('1. Clear Press Releases');
        console.log('2. Clear Clientele');
        console.log('3. Clear Activities');
        console.log('4. Clear CSR Connects');
        console.log('5. Clear Volunteers');
        console.log('6. Clear Gallery');
        console.log('9. CLEAR ALL DATA');
        console.log('0. Exit');

        rl.question('\nSelect an option: ', (answer) => {
            switch (answer) {
                case '1': clearTable('press_releases', menu); break;
                case '2': clearTable('clientele', menu); break;
                case '3': clearTable('activities', menu); break;
                case '4': clearTable('csr_connects', menu); break;
                case '5': clearTable('volunteers', menu); break;
                case '6':
                    clearTable('gallery_images', () => {
                        clearTable('gallery_folders', menu);
                    });
                    break;
                case '9':
                    console.log('Clearing ALL data...');
                    let p = Promise.resolve();
                    tables.forEach(t => {
                        p = p.then(() => new Promise(res => clearTable(t, res)));
                    });
                    p.then(menu);
                    break;
                case '0':
                    db.close();
                    rl.close();
                    break;
                default:
                    console.log('Invalid option.');
                    menu();
            }
        });
    });
}

console.log('Connected to database at:', dbPath);
menu();
