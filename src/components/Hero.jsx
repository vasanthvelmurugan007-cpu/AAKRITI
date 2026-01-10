
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section" style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

            {/* 1. Background Image + Gradient Overlay */}
            <div className="hero-background" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'radial-gradient(circle at center, rgba(74, 48, 39, 0.4) 0%, rgba(20, 15, 10, 0.95) 100%)'
                }}></div>
            </div>

            {/* 2. Innovative Massive Background Text */}
            <div className="text-huge-outline">AAKRITII</div>

            {/* 3. Main Content */}
            <div className="container hero-content" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        style={{
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                            letterSpacing: '0.5em',
                            textTransform: 'uppercase',
                            fontWeight: '600',
                            color: 'var(--color-gold)',
                            marginBottom: '24px',
                            display: 'block'
                        }}>
                        Empower. Inspire. Transform.
                    </motion.p>

                    {/* Main Title - Brand Name */}
                    <h1 className="hero-title text-gradient-gold" style={{
                        marginTop: 0,
                        fontSize: 'clamp(3rem, 10vw, 7rem)',
                        lineHeight: '1.1',
                        marginBottom: '32px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        fontFamily: 'var(--font-accent)',
                        position: 'relative',
                        display: 'inline-block'
                    }}>
                        AAKRITII ORG
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: '1.25rem',
                        lineHeight: '1.8',
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '60px',
                        maxWidth: '700px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        A youth-driven force continuously working to uplift marginalized tribal communities through education, healthcare, and sustainable development.
                    </p>

                    {/* Buttons */}
                    <div className="hero-cta-wrapper" style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
                        <a href="#essence" className="btn-magnetic">
                            Our Mission
                        </a>
                        <a href="#volunteer" className="btn-magnetic" style={{ background: 'transparent', color: 'var(--color-text-primary)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            Join Us
                        </a>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                style={{ position: 'absolute', bottom: '40px' }}
            >
                <ArrowDown color="#c9a875" size={28} />
            </motion.div>
        </section >
    );
};

export default Hero;
