import React from 'react';

const BookTabs = ({ currentSection, onTabClick }) => {
    const tabs = [
        { id: 'cover', label: 'Cover', pageIndex: 0, color: '#8B4513' },
        { id: 'intro', label: 'Intro', pageIndex: 1, color: '#A0522D' },
        { id: 'essence', label: 'Essence', pageIndex: 2, color: '#CD853F' },
        { id: 'impact', label: 'Impact', pageIndex: 3, color: '#DAA520' },
        { id: 'pillars', label: 'Pillars', pageIndex: 4, color: '#B8860B' },
        { id: 'initiatives', label: 'Action', pageIndex: 5, color: '#808000' },
        { id: 'gallery', label: 'Gallery', pageIndex: 6, color: '#556B2F' },
        { id: 'join', label: 'Join', pageIndex: 7, color: '#2F4F4F' },
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'flex-end', // Align to right edge
            paddingRight: '10px'
        }}>
            {tabs.map((tab, index) => {
                const isActive = currentSection === tab.pageIndex;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabClick(tab.pageIndex)}
                        style={{
                            padding: '10px 18px 10px 14px',
                            backgroundColor: isActive ? 'var(--color-gold)' : tab.color,
                            color: isActive ? '#000' : '#fff',
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            border: 'none',
                            borderTopLeftRadius: '4px',
                            borderBottomLeftRadius: '4px',
                            cursor: 'pointer',
                            transform: isActive ? 'translateX(0)' : 'translateX(5px)', // Active tabs stick out more
                            width: isActive ? '90px' : '70px',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            boxShadow: isActive ? '-2px 2px 8px rgba(0,0,0,0.2)' : 'none',
                            textAlign: 'right', // Text aligns to fold
                            position: 'relative',
                            opacity: isActive ? 1 : 0.85
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) e.target.style.transform = 'translateX(0)';
                            e.target.style.width = '90px';
                            e.target.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) e.target.style.transform = 'translateX(5px)';
                            if (!isActive) e.target.style.width = '70px';
                            if (!isActive) e.target.style.opacity = '0.85';
                        }}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default BookTabs;
