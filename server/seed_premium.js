import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Seeding database at:', dbPath);

const samplePress = [
    {
        title: "Aakritii Awarded 'NGO of the Year' 2024",
        date: "2024-12-15",
        content: "We are humbled to receive the prestigious 'NGO of the Year' award for our relentless efforts in rural education and sustainable development. This recognition fuels our commitment to creating a better world.",
        image_url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Partnership with Global Tech Giant for Digital Literacy",
        date: "2024-11-20",
        content: "Aakritii has joined hands with a leading tech corporation to launch a digital literacy program aiming to empower 10,000 women in rural India by 2025.",
        image_url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Winter Relief Drive Success: 5000+ Families Reached",
        date: "2024-11-05",
        content: "Our annual winter relief drive was a massive success, providing warm clothing and essentials to over 5000 families across 3 states. Thank you to all our volunteers!",
        image_url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800"
    }
];

const sampleActivities = [
    {
        title: "Women Empowerment Workshop",
        date: "2025-01-10",
        location: "Varanasi, UP",
        description: "A 3-day workshop focused on skill development, financial literacy, and entrepreneurship for women in rural communities.",
        image_url: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Clean Water Initiative Launch",
        date: "2025-01-25",
        location: "Kutch, Gujarat",
        description: "Inaugurating 50 new solar-powered water filtration units to provide safe drinking water to drought-prone villages.",
        image_url: "https://images.unsplash.com/photo-1536093054148-5c4d0840b37e?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Annual Education Fair",
        date: "2025-02-15",
        location: "New Delhi",
        description: "Connecting underprivileged students with scholarship opportunities and mentorship from industry leaders.",
        image_url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&q=80&w=800"
    }
];

const sampleClients = [
    { name: "TechCorp", description: "Technology Partner", logo_url: "" },
    { name: "EduWorld", description: "Educational Resources", logo_url: "" },
    { name: "GreenEarth", description: "Sustainability Advisor", logo_url: "" },
    { name: "FinServe", description: "Financial Grants", logo_url: "" }
];

const sampleCSR = [
    { company_name: "Innovate Inc.", description: "Supporting our STEM education labs.", website_url: "https://example.com" },
    { company_name: "Global Bank", description: "Sponsoring micro-finance initiatives for women entrepreneurs.", website_url: "https://example.com" },
    { company_name: "HealthPlus", description: "Providing free medical camps twice a year.", website_url: "https://example.com" }
];

db.serialize(() => {
    // Check and Seed Press Releases
    db.get("SELECT count(*) as count FROM press_releases", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding Press Releases...");
            const stmt = db.prepare("INSERT INTO press_releases (title, date, content, image_url) VALUES (?, ?, ?, ?)");
            samplePress.forEach(item => stmt.run(item.title, item.date, item.content, item.image_url));
            stmt.finalize();
        } else {
            console.log("Press Releases already seeded.");
        }
    });

    // Check and Seed Activities
    db.get("SELECT count(*) as count FROM activities", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding Activities...");
            const stmt = db.prepare("INSERT INTO activities (title, date, location, description, image_url) VALUES (?, ?, ?, ?, ?)");
            sampleActivities.forEach(item => stmt.run(item.title, item.date, item.location, item.description, item.image_url));
            stmt.finalize();
        } else {
            console.log("Activities already seeded.");
        }
    });

    // Check and Seed Clientele
    db.get("SELECT count(*) as count FROM clientele", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding Clientele...");
            const stmt = db.prepare("INSERT INTO clientele (name, description, logo_url) VALUES (?, ?, ?)");
            sampleClients.forEach(item => stmt.run(item.name, item.description, item.logo_url));
            stmt.finalize();
        } else {
            console.log("Clientele already seeded.");
        }
    });

    // Check and Seed CSR Connects
    db.get("SELECT count(*) as count FROM csr_connects", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding CSR Connects...");
            const stmt = db.prepare("INSERT INTO csr_connects (company_name, description, logo_url, website_url) VALUES (?, ?, ?, ?)");
            sampleCSR.forEach(item => stmt.run(item.company_name, item.description, "", item.website_url));
            stmt.finalize();
        } else {
            console.log("CSR Connects already seeded.");
        }
    });
});

// Wait a bit for async ops
setTimeout(() => {
    console.log("Seeding check complete.");
}, 2000);
