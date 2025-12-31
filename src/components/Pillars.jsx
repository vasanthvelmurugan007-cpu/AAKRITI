import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Utensils, Users, Globe, Heart } from 'lucide-react';
import { apiFetch } from '../utils/api';
import './Pillars.css';

const pillarsData = [
    {
        id: 1,
        title: "Education",
        description: "Lighting the path of knowledge for every child, bridging the gap between potential and opportunity.",
        icon: <BookOpen size={32} />,
        image: "/pillar_education.jpg"
    },
    {
        id: 2,
        title: "Nutrition",
        description: "Nourishing bodies to fuel minds. Ensuring no child sleeps hungry through sustainable food security.",
        icon: <Utensils size={32} />,
        image: "/pillar_nutrition.jpg"
    },
    {
        id: 3,
        title: "Livelihoods",
        description: "Empowering communities with skills and resources to build a self-reliant and dignified future.",
        icon: <Users size={32} />,
        image: "/pillar_livelihood.jpg"
    }
];

const Pillars = () => {
    const [pillars, setPillars] = useState([]);

    useEffect(() => {
        apiFetch('/api/pillars')
            .then(data => setPillars(data))
            .catch(err => console.error("Error fetching pillars:", err));
    }, []);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'BookOpen': return <BookOpen size={32} />;
            case 'Utensils': return <Utensils size={32} />;
            case 'Users': return <Users size={32} />;
            case 'Globe': return <Globe size={32} />;
            case 'Heart': return <Heart size={32} />;
            default: return <Heart size={32} />;
        }
    };

    return (
        <section id="pillars" className="pillars-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">Pillars of Hope</h2>
                    <div className="divider-gold"></div>
                </motion.div>

                <div className="pillars-grid">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={pillar.id}
                            className="pillar-card glass-panel"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="pillar-image-wrapper">
                                <img src={pillar.image_url || pillar.image} alt={pillar.title} className="pillar-image" />
                                <div className="pillar-icon-overlay">
                                    {getIcon(pillar.icon)}
                                </div>
                            </div>
                            <div className="pillar-content">
                                <h3 className="pillar-title">{pillar.title}</h3>
                                <p className="pillar-desc">{pillar.description}</p>
                                {/* <a href="#" className="pillar-link">Learn More &rarr;</a> */}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pillars;
