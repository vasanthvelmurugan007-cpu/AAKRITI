import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("DB Error:", err.message);
    else console.log("Connected to SQLite database for seeding.");
});

db.serialize(() => {
    // Impact Stats
    db.run("DELETE FROM impact_stats");
    const impacts = [
        { title: 'Lives Touched', value: '15,000+', icon: 'Users' },
        { title: 'Volunteers', value: '500+', icon: 'Heart' },
        { title: 'States Reached', value: '12', icon: 'MapPin' },
        { title: 'Funds Raised', value: '₹50L+', icon: 'TrendingUp' }
    ];
    impacts.forEach(i => {
        db.run('INSERT INTO impact_stats (title, value, icon) VALUES (?, ?, ?)', [i.title, i.value, i.icon]);
    });
    console.log("Seeded Impact Stats");

    // Team Members
    db.run("DELETE FROM team_members");
    const team = [
        { name: 'Santosh Kumar', role: 'Founder & Director', bio: 'Visionary leader with 10+ years in social work.', image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
        { name: 'Priya Sharma', role: 'Operations Head', bio: 'Ensuring every project runs smoothly.', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
        { name: 'Rahul Verma', role: 'Volunteer Lead', bio: 'Connecting hearts to the cause.', image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop' }
    ];
    team.forEach(t => {
        db.run('INSERT INTO team_members (name, role, bio, image_url) VALUES (?, ?, ?, ?)', [t.name, t.role, t.bio, t.image_url]);
    });
    console.log("Seeded Team Members");

    // Blog Posts
    db.run("DELETE FROM blog_posts");
    const posts = [
        { title: 'Winter Warmth Drive 2024', content: 'Our team distributed over 500 blankets to homeless families across Delhi NCR this winter.', author: 'Santosh', image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop' },
        { title: 'Education for All Initiative', content: 'We are launching a new scholarship program for 50 meritorious students from rural backgrounds.', author: 'Priya', image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop' },
        { title: 'Clean Water Project Success', content: 'Three new water purification plants have been installed in drought-affected villages.', author: 'Admin', image_url: 'https://images.unsplash.com/photo-1581093122699-1bd6198f1066?w=600&h=400&fit=crop' }
    ];
    posts.forEach(p => {
        db.run('INSERT INTO blog_posts (title, content, author, image_url) VALUES (?, ?, ?, ?)', [p.title, p.content, p.author, p.image_url]);
    });
    console.log("Seeded Blog Posts");

    // Events
    db.run("DELETE FROM events");
    const events = [
        { title: 'Annual Charity Gala', date: '2025-01-15', location: 'India Habitat Centre, Delhi', description: 'Join us for an evening of music, art, and giving.', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop' },
        { title: 'Marathon for Hope', date: '2025-02-10', location: 'Nehru Park', description: 'Run for a cause! All proceeds go to child education.', image_url: 'https://images.unsplash.com/photo-1552674605-469523fafd00?w=600&h=400&fit=crop' }
    ];
    events.forEach(e => {
        db.run('INSERT INTO events (title, date, location, description, image_url) VALUES (?, ?, ?, ?, ?)', [e.title, e.date, e.location, e.description, e.image_url]);
    });
    console.log("Seeded Events");

    // Testimonials
    db.run("DELETE FROM testimonials");
    const testimonials = [
        { name: 'Rohan Das', role: 'Beneficiary', message: 'The scholarship from Aakritii helped me complete my engineering. I am forever grateful.', image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
        { name: 'Anjali Gupta', role: 'Volunteer', message: 'Being part of this community taught me the true meaning of empathy and service.', image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop' },
        { name: 'Dr. S. K. Singh', role: 'Donor', message: 'Transparency and impact are what define Aakritii. Proud to support their initiatives.', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' }
    ];
    testimonials.forEach(t => {
        db.run('INSERT INTO testimonials (name, role, message, image_url) VALUES (?, ?, ?, ?)', [t.name, t.role, t.message, t.image_url]);
    });
    console.log("Seeded Testimonials");

});
