import React from 'react';
import { motion } from 'framer-motion';
import './Essence.css';

const Essence = () => {
    return (
        <section id="essence" className="essence-section">
            <div className="container">
                <motion.div
                    className="essence-content glass-panel"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="section-header">
                        <h2 className="section-title">Our Essence</h2>
                    </div>

                    <p className="essence-text">
                        Deep within the heart of India's tribal landscapes, we find resilience, wisdom,
                        and an untold strength. Aakritii NGO is not just an organization; it is a bridge
                        connecting ancient traditions with modern opportunities.
                    </p>

                    <blockquote className="essence-quote">
                        "To empower a community is to honor its roots while watering its future."
                    </blockquote>
                </motion.div>
            </div>
        </section>
    );
};

export default Essence;
