import fs from 'fs';
import path from 'path';

const TARGET_DIR = 'C:/xamppp/htdocs/aakritii/gallery-images';

console.log("Checking access to:", TARGET_DIR);

try {
    if (!fs.existsSync(TARGET_DIR)) {
        console.log("Directory does not exist. Attempting to create...");
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    } else {
        console.log("Directory exists.");
    }

    const testFile = path.join(TARGET_DIR, 'test_access.txt');
    fs.writeFileSync(testFile, 'Hello from Node!');
    console.log("Write success:", testFile);

    const content = fs.readFileSync(testFile, 'utf-8');
    console.log("Read success:", content);

    // Clean up
    // fs.unlinkSync(testFile);
} catch (err) {
    console.error("ACCESS ERROR:", err.message);
}
