import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const CSRConnects = () => {
    const [connects, setConnects] = useState([]);

    useEffect(() => {
        apiFetch('/api/csr-connects')
            .then(data => setConnects(data))
            .catch(err => console.error("Error fetching CSR connects:", err));
    }, []);

    return (
        <section id="csr" className="section-spacing container" style={{ padding: '80px 24px' }}>
            <div className="section-header">
                <h2 className="section-title">CSR Connects</h2>
                <p className="gold-text">Bridging corporates with community impact</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                {connects.length > 0 ? (
                    connects.map(item => (
                        <div key={item.id} className="glass-panel hover-lift" style={{ padding: '40px', textAlign: 'center' }}>
                            {item.logo_url && (
                                <img
                                    src={item.logo_url}
                                    alt={item.company_name}
                                    style={{ height: '80px', margin: '0 auto 24px', filter: 'brightness(0) invert(1)' }}
                                />
                            )}
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{item.company_name}</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                                {item.description}
                            </p>
                            {item.website_url && (
                                <a
                                    href={item.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: 'var(--color-gold)',
                                        fontWeight: '600',
                                        borderBottom: '1px solid var(--color-gold)',
                                        paddingBottom: '2px'
                                    }}
                                >
                                    Visit Website
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                        <p>CSR partnership details coming soon.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CSRConnects;
