import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Utensils, Users, Globe, Heart, HandHeart, Sun } from 'lucide-react';
import { apiFetch } from '../utils/api';
import './Pillars.css';
import { useMotionValue, useTransform } from 'framer-motion';

const TiltCard = ({ pillar, index, getIcon }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    return (
        <motion.div
            className="pillar-card glass-panel"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            style={{ x, y, rotateX, rotateY, cursor: 'none' }} // cursor: none so custom cursor shows
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                x.set(e.clientX - rect.left - rect.width / 2);
                y.set(e.clientY - rect.top - rect.height / 2);
            }}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
            whileHover={{ scale: 1.05, boxShadow: "0px 20px 40px rgba(201, 168, 117, 0.3)" }}
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
            </div>
        </motion.div>
    );
};

const pillarsData = [
    {
        id: 1,
        title: "Education",
        description: "Unlocking potential through foundational learning and life skills.",
        icon: <BookOpen size={32} />,
        image: "/pillar_education.jpg"
    },
    {
        id: 2,
        title: "Support",
        description: "Providing encouragement, capacity-building, and presence for self-reliance.",
        icon: <HandHeart size={32} />,
        image: "/pillar_nutrition.jpg"
    },
    {
        id: 3,
        title: "Hope",
        description: "Planting seeds of transformation through acts of kindness.",
        icon: <Sun size={32} />,
        image: "/pillar_livelihood.jpg"
    },
    {
        id: 4,
        title: "Love",
        description: "Driven by compassion, respect, and empathy.",
        icon: <Heart size={32} />,
        image: "/pillar_love.jpg"
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
            case 'HandHeart': return <HandHeart size={32} />;
            case 'Sun': return <Sun size={32} />;
            case 'Heart': return <Heart size={32} />;
            case 'Globe': return <Globe size={32} />;
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
                        <TiltCard key={pillar.id} pillar={pillar} index={index} getIcon={getIcon} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pillars;
