import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const PressReleases = () => {
    const [releases, setReleases] = useState([]);

    useEffect(() => {
        apiFetch('/api/press-releases')
            .then(data => setReleases(data))
            .catch(err => console.error("Error fetching press releases:", err));
    }, []);

    return (
        <section id="press" className="section-spacing container" style={{ padding: '80px 24px' }}>
            <div className="section-header">
                <h2 className="section-title">Press Releases</h2>
                <p className="gold-text">Latest updates and news from Aakritii</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {releases.length > 0 ? (
                    releases.map(item => (
                        <div key={item.id} className="glass-panel hover-lift" style={{ overflow: 'hidden', padding: '0' }}>
                            {item.image_url && (
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <div style={{ padding: '24px' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--color-gold)', display: 'block', marginBottom: '8px' }}>
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{item.title}</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                        <p>No press releases available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PressReleases;
