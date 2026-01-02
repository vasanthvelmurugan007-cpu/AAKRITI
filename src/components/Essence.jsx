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
                        <h2 className="section-title">About Aakritii</h2>
                    </div>

                    <p className="essence-text">
                        Aakritii is a youth-driven NGO bringing voices of marginalized (especially tribal) communities to the forefront. We address challenges from generations of exclusion through sustainable models in education, nutrition, and livelihoods, aiming to enable dignity for children, leadership for women, and better futures for communities.
                    </p>

                    <blockquote className="essence-quote">
                        "Building resilient lives and inclusive spaces via grassroots collaboration."
                    </blockquote>
                </motion.div>
            </div>
        </section>
    );
};

export default Essence;
