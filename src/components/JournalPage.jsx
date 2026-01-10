import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const JournalPage = ({ children, id, title, pageNumber }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    return (
        <section
            id={id}
            ref={ref}
            className="journal-page"
            style={{
                width: '100%',
                minHeight: '100vh',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '80px 40px',
                overflow: 'hidden',
                backgroundColor: '#fdfbf7', // Paper color
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                marginBottom: '0' // Seamless flow
            }}
        >
            {/* Torn Edge Top */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                left: 0,
                width: '100%',
                height: '40px',
                background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 1200 40\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,40 C150,40 200,10 300,30 C450,50 500,10 600,30 C750,50 800,10 900,30 C1050,50 1100,10 1200,30 L1200,0 L0,0 Z\' fill=\'%23fdfbf7\'/%3E%3C/svg%3E") no-repeat bottom center',
                backgroundSize: '100% 100%',
                zIndex: 2,
                transform: 'rotate(180deg)'
            }}></div>

            {/* Hand-Drawn Elements */}
            <motion.div
                className="decorative-element"
                initial={{ opacity: 0, rotate: -10 }}
                animate={isInView ? { opacity: 0.3, rotate: 0 } : {}}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{
                    position: 'absolute',
                    top: '5%',
                    right: '5%',
                    width: '100px',
                    height: '100px',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            >
                <svg viewBox="0 0 100 100" fill="none" stroke="var(--color-gold-dim)" strokeWidth="1">
                    <circle cx="50" cy="50" r="40" strokeDasharray="5,5" />
                    <path d="M50 10 L50 90 M10 50 L90 50" strokeOpacity="0.5" />
                </svg>
            </motion.div>

            {/* Content Reveal Animation */}
            <motion.div
                initial={{ opacity: 0, y: 30, skewY: 2 }}
                animate={isInView ? { opacity: 1, y: 0, skewY: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ zIndex: 1, position: 'relative' }}
            >
                {/* Page Header */}
                <div className="journal-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-accent)',
                        fontSize: '3rem',
                        color: 'var(--color-earth-main)',
                        marginBottom: '10px'
                    }}>
                        {title}
                    </h2>
                    <div style={{
                        width: '80px',
                        height: '3px',
                        background: 'var(--color-gold)',
                        margin: '0 auto',
                        borderRadius: '50%'
                    }}></div>
                </div>

                {/* Main Content */}
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </motion.div>

            {/* Page Number */}
            <div style={{
                position: 'absolute',
                bottom: '30px',
                right: '40px',
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-gold-dim)',
                fontSize: '1.2rem',
                opacity: 0.6
            }}>
                {pageNumber}
            </div>

            {/* Torn Edge Bottom */}
            <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: 0,
                width: '100%',
                height: '40px',
                background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 1200 40\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,0 C150,0 200,30 300,10 C450,-10 500,30 600,10 C750,-10 800,30 900,10 C1050,-10 1100,30 1200,10 L1200,40 L0,40 Z\' fill=\'%23fdfbf7\'/%3E%3C/svg%3E") no-repeat top center',
                backgroundSize: '100% 100%',
                zIndex: 2
            }}></div>
        </section>
    );
};

export default JournalPage;
