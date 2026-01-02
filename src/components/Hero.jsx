
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="hero-background"></div>
            <div className="hero-overlay"></div>


            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <h1 className="hero-title">
                        <span>EMPOWER. TRANSFORM. </span>
                        <span className="gold-gradient">INSPIRE.</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <p className="hero-quote">
                        A just and compassionate society where individuals from marginalized communities live with dignity, health, and purpose.
                    </p>
                    <p className="hero-subquote" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginTop: '10px', fontStyle: 'italic' }}>
                        Transforming hope into action!
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="hero-cta-wrapper"
                >
                    <a href="#essence" className="hero-btn">
                        Our Mission
                    </a>
                    <a href="#volunteer" className="hero-btn-outline">
                        Volunteer
                    </a>
                </motion.div>
            </div>

            <div className="scroll-indicator">
                <ArrowDown color="#c9a875" size={28} />
            </div>
        </section >
    );
};

export default Hero;
