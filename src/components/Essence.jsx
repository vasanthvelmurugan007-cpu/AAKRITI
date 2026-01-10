import React from 'react';
import { motion } from 'framer-motion';
import './Essence.css';

const Essence = () => {
    return (
        <section id="essence" className="essence-section" style={{ padding: '120px 0', background: 'transparent' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>

                {/* LEFT: CONTENT STAND */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)' }}></div>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', color: 'var(--color-gold)' }}>Our Essence</span>
                    </div>

                    <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '30px', fontSize: '2.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        Empowering the<br />Unheard Voices.
                    </h2>

                    <p className="essence-text drop-cap" style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#E0D8C8' }}>
                        Aakritii is a youth-driven NGO dedicated to bringing the stories and struggles of marginalized tribal communities to the forefront. <br /><br />
                        We bridge the gap between exclusion and opportunity by building sustainable models in education, nutrition, and livelihoods. Our goal is simple yet profound: enable dignity for children, foster leadership in women, and secure better futures for entire communities.
                    </p>
                </motion.div>

                {/* RIGHT: VISUAL IMPACT QUOTE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ position: 'relative' }}
                >
                    <div style={{
                        position: 'absolute', top: '-40px', left: '-40px', fontSize: '10rem', lineHeight: 1, color: 'rgba(201, 168, 117, 0.2)', fontFamily: 'serif'
                    }}>“</div>

                    <blockquote style={{
                        fontSize: '2rem',
                        lineHeight: '1.4',
                        color: '#ffffff', /* Highlighted White */
                        fontFamily: 'var(--font-accent)',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        Building <span style={{ color: 'var(--color-gold)', borderBottom: '2px solid var(--color-gold)' }}>resilient lives</span> and inclusive spaces via grassroots collaboration.
                    </blockquote>

                    <div style={{ marginTop: '30px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-gold)' }}></div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#E0D8C8' }}>Sandeep Kumar</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9, color: 'rgba(224, 216, 200, 0.7)' }}>Founder, Aakritii NGO</div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Essence;
