import React, { useEffect, useState, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import './styles.css';

// Import Original Components
import Hero from '../Hero';
import Essence from '../Essence';
import ImpactNumbers from '../ImpactNumbers';
import Pillars from '../Pillars';
import Activities from '../Activities';
import Gallery from '../Gallery';
import VolunteerRegistration from '../VolunteerRegistration';
import Footer from '../Footer';

const Cursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        // Check for hoverable elements
        const handleMouseOver = (e) => {
            if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.interactive-element') || e.target.closest('.nav-orb')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        }

        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    return (
        <>
            <motion.div
                className="cursor-follower"
                animate={{
                    x: mousePosition.x,
                    y: mousePosition.y,
                    scale: isHovering ? 2 : 1,
                    backgroundColor: isHovering ? "rgba(255,255,255,0.1)" : "transparent"
                }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />
            <div
                className="cursor-dot"
                style={{ left: mousePosition.x, top: mousePosition.y }}
            />
        </>
    );
};

const OrbitalMenu = ({ activeSection, onNavigate }) => {
    const items = [
        { id: 'hero', label: 'Home' },
        { id: 'essence', label: 'Essence' },
        { id: 'impact', label: 'Impact' },
        { id: 'pillars', label: 'Pillars' },
        { id: 'activities', label: 'Activities' },
        { id: 'gallery', label: 'Gallery' },
        { id: 'join', label: 'Join' }
    ];

    return (
        <nav className="orbital-nav">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className={`nav-orb ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                    title={item.label}
                ></div>
            ))}
        </nav>
    );
};

const SectionWrapper = ({ id, children, setActiveSection }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.3 });

    useEffect(() => {
        if (isInView) {
            setActiveSection(id);
        }
    }, [isInView, id, setActiveSection]);

    return (
        <section id={id} ref={ref} style={{ position: 'relative', zIndex: 10 }}>
            {children}
        </section>
    );
};

const Interface = ({ user, contentVersion, onOpenLogin }) => {
    const containerRef = useRef(null);
    const [activeSection, setActiveSection] = useState('hero');

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="futuristic-container" ref={containerRef}>
            <Cursor />
            <OrbitalMenu activeSection={activeSection} onNavigate={scrollToSection} />

            {/* Scrollable Content Container */}
            <div className="content-layer" style={{
                overflowY: 'auto',
                height: '100vh',
                display: 'block',
                scrollBehavior: 'smooth',
                padding: 0
            }}>
                <div style={{ maxWidth: '100%', margin: '0 auto' }}>

                    <SectionWrapper id="hero" setActiveSection={setActiveSection}>
                        <Hero />
                    </SectionWrapper>

                    <SectionWrapper id="essence" setActiveSection={setActiveSection}>
                        <Essence />
                    </SectionWrapper>

                    <SectionWrapper id="impact" setActiveSection={setActiveSection}>
                        <ImpactNumbers />
                    </SectionWrapper>

                    <SectionWrapper id="pillars" setActiveSection={setActiveSection}>
                        <div className="container" style={{ padding: '80px 0' }}>
                            <h2 className="section-title" style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Our Pillars of Hope</h2>
                            <Suspense fallback={<div className="section-loader"></div>}>
                                <Pillars key={`pillars-${contentVersion}`} />
                            </Suspense>
                        </div>
                    </SectionWrapper>

                    <SectionWrapper id="activities" setActiveSection={setActiveSection}>
                        <div className="container" style={{ padding: '80px 0' }}>
                            <h2 className="section-title" style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Recent Initiatives</h2>
                            <Suspense fallback={<div className="section-loader"></div>}>
                                <Activities key={`activities-${contentVersion}`} />
                            </Suspense>
                        </div>
                    </SectionWrapper>

                    <SectionWrapper id="gallery" setActiveSection={setActiveSection}>
                        <div className="container" style={{ padding: '80px 0' }}>
                            <h2 className="section-title" style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Visual Archive</h2>
                            <Suspense fallback={<div className="section-loader"></div>}>
                                <Gallery key={`gallery-${contentVersion}-${user?.id || 'guest'}`} user={user} />
                            </Suspense>
                        </div>
                    </SectionWrapper>

                    <SectionWrapper id="join" setActiveSection={setActiveSection}>
                        <div className="container" style={{ padding: '80px 0' }}>
                            <h2 className="section-title" style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Join The Movement</h2>
                            <Suspense fallback={<div className="section-loader"></div>}>
                                <VolunteerRegistration />
                            </Suspense>
                        </div>
                    </SectionWrapper>

                    <Footer onOpenLogin={onOpenLogin} user={user} />
                    <div style={{ height: '50px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Interface;
