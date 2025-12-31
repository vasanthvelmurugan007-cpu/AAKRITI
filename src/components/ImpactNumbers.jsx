import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import './ImpactNumbers.css';

const StatCard = ({ number, label, suffix = "+" }) => {
    // Determine target number
    const target = parseInt(number.replace(/,/g, ''), 10);
    const [count, setCount] = useState(0);

    // Use Framer Motion's native useInView
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });

    useEffect(() => {
        if (inView) {
            let start = 0;
            const end = target;
            const duration = 2000; // 2 seconds
            const incrementTime = 20; // update every 20ms
            const step = Math.ceil(end / (duration / incrementTime));

            const timer = setInterval(() => {
                start += step;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, incrementTime);
            return () => clearInterval(timer);
        }
    }, [inView, target]);

    return (
        <motion.div
            ref={ref}
            className="stat-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
        >
            <div className="stat-number">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="stat-label">{label}</div>
        </motion.div>
    );
};

const ImpactNumbers = () => {
    const stats = [
        { number: "12000", label: "Lives Touched", suffix: "+" },
        { number: "45", label: "Villages Adopted", suffix: "" },
        { number: "850", label: "Volunteers Engaged", suffix: "+" },
        { number: "15", label: "Corporate Partners", suffix: "+" }
    ];

    return (
        <section className="impact-numbers-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="section-header text-center"
                >
                    <h2 className="section-title">Our Impact in Numbers</h2>
                    <p className="section-subtitle">Real change, measured in lives transformed.</p>
                </motion.div>

                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactNumbers;
