
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section" style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center' }}>

            {/* 1. Background Image + Gradient Overlay */}
            <div className="hero-background" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0
            }}>
                {/* Image handled by CSS .hero-background, adding overlay here */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)'
                }}></div>
            </div>

            <div className="container hero-content" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ maxWidth: '650px' }}
                >
                    {/* Main Title - Brand Name */}
                    <h1 className="hero-title" style={{
                        textAlign: 'left',
                        fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                        lineHeight: '1',
                        marginBottom: '16px',
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: 'var(--font-accent)'
                    }}>
                        AAKRITII
                    </h1>

                    {/* Tagline */}
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        color: 'var(--color-gold)',
                        marginBottom: '40px',
                        textAlign: 'left',
                        display: 'block'
                    }}>
                        Empower. Inspire. Transform.
                    </p>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: '1.25rem',
                        lineHeight: '1.6',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '40px',
                        maxWidth: '540px'
                    }}>
                        We are Aakritii. A youth-driven force continuously working to uplift marginalized tribal communities through education, healthcare, and sustainable development.
                    </p>

                    {/* Buttons */}
                    <div className="hero-cta-wrapper" style={{ justifyContent: 'flex-start' }}>
                        <a href="#essence" className="hero-btn">
                            Discover Our Mission
                        </a>
                        <a href="#volunteer" className="hero-btn-outline" style={{ marginLeft: '16px' }}>
                            Join the Movement
                        </a>
                    </div>
                </motion.div>
            </div>

            <div className="scroll-indicator">
                <ArrowDown color="#c9a875" size={28} />
            </div>
        </section >
    );
};

export default Hero;
