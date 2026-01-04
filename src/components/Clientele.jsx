import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const Clientele = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        apiFetch('/api/clientele')
            .then(data => setClients(data))
            .catch(err => console.error("Error fetching clientele:", err));
    }, []);

    return (
        <section id="clientele" className="section-spacing container" style={{ padding: '120px 24px' }}>
            <div className="section-header" style={{ marginBottom: '60px', textAlign: 'left' }}>
                <span style={{ color: 'var(--color-gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
                    Our Network
                </span>
                <h2 className="section-title" style={{ fontSize: '3rem', margin: 0 }}>Strategic Partners</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '40px', alignItems: 'center' }}>
                {clients.length > 0 ? (
                    clients.map(client => (
                        <div key={client.id} className="glass-panel hover-lift" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px' }}>
                            {client.logo_url ? (
                                <img
                                    src={client.logo_url}
                                    alt={client.name}
                                    style={{ maxHeight: '80px', maxWidth: '100%', marginBottom: '16px', filter: 'brightness(0) invert(1)', opacity: '0.8' }}
                                />
                            ) : (
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-gold)', marginBottom: '8px' }}>
                                    {client.name.charAt(0)}
                                </div>
                            )}
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{client.name}</h4>
                            {client.description && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{client.description}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                        <p>Listing our esteemed clientele soon.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Clientele;
