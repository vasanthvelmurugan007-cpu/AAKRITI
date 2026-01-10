import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const Activities = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        apiFetch('/api/activities')
            .then(data => setActivities(data)) // Showing all activities
            .catch(err => console.error("Error fetching activities:", err));
    }, []);

    return (
        <section id="activities" className="section-spacing container" style={{ padding: '120px 24px' }}>
            <div className="section-header" style={{ marginBottom: '80px', textAlign: 'left' }}>
                <span style={{ color: 'var(--color-gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
                    Impact in Action
                </span>
                <h2 className="section-title" style={{ fontSize: '3rem', margin: 0 }}>Recent Initiatives</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <div key={activity.id} className="glass-panel"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px' /* Consistent 12px Radius */
                            }}>

                            {/* Image Section - Order depends on index for desktop visual interest */}
                            <div style={{
                                order: index % 2 === 0 ? 0 : 1,
                                height: '400px',
                                position: 'relative'
                            }}>
                                {activity.image_url ? (
                                    <div style={{
                                        width: '100%', height: '100%',
                                        backgroundImage: `url(${activity.image_url})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        filter: 'grayscale(20%)'
                                    }}></div>
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>Image Not Available</span>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div style={{
                                order: index % 2 === 0 ? 1 : 0,
                                padding: '40px', /* Generous 40px padding */
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderLeft: index % 2 === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                borderRight: index % 2 !== 0 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                                    <span style={{
                                        color: 'var(--color-gold)',
                                        fontWeight: '600',
                                        letterSpacing: '1px',
                                        fontFamily: 'monospace',
                                        fontSize: '1.1rem'
                                    }}>
                                        {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                                    </span>
                                    {activity.location && (
                                        <span style={{
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            padding: '4px 12px',
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            color: 'rgba(255,255,255,0.7)'
                                        }}>
                                            {activity.location}
                                        </span>
                                    )}
                                </div>
                                <h3 style={{ fontSize: '2rem', marginBottom: '24px', lineHeight: '1.2' }}>{activity.title}</h3>
                                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    {activity.description ? activity.description.replace(/BILOGICAL/g, 'BIOLOGICAL') : ''}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                        <p>New activities will be updated shortly.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Activities;
