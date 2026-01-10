import React, { useState, useEffect } from 'react';

const PageNavigation = ({ sections }) => {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const pageYOffset = window.pageYOffset;
            let newActive = '';

            sections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    const offsetTop = element.offsetTop - 200; // Offset for better triggering
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (pageYOffset >= offsetTop && pageYOffset < offsetBottom) {
                        newActive = section.id;
                    }
                }
            });

            setActiveSection(newActive);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div style={{
            position: 'fixed',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center'
        }}>
            {sections.map((section) => (
                <div
                    key={section.id}
                    className="nav-dot-container"
                    style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '200px' }}
                    onClick={() => scrollTo(section.id)}
                >
                    <span style={{
                        position: 'absolute',
                        right: '30px',
                        color: activeSection === section.id ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        opacity: activeSection === section.id ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none'
                    }}>
                        {section.label}
                    </span>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: '1px solid var(--color-gold)',
                        background: activeSection === section.id ? 'var(--color-gold)' : 'transparent',
                        transition: 'all 0.3s ease',
                        boxShadow: activeSection === section.id ? '0 0 10px var(--color-gold)' : 'none'
                    }}></div>
                </div>
            ))}
        </div>
    );
};

export default PageNavigation;
