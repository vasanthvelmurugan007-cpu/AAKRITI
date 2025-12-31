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
        <section id="activities" className="section-spacing container" style={{ padding: '80px 24px' }}>
            <div className="section-header">
                <h2 className="section-title">Our Activities</h2>
                <p className="gold-text">Making a difference on the ground</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <div key={activity.id} className="glass-panel hover-lift"
                            style={{
                                display: 'flex',
                                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                                overflow: 'hidden',
                                minHeight: '300px'
                            }}>

                            {/* Image Section */}
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                {activity.image_url ? (
                                    <img
                                        src={activity.image_url}
                                        alt={activity.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                    <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>
                                        {new Date(activity.date).toLocaleDateString()}
                                    </span>
                                    {activity.location && (
                                        <span style={{
                                            background: 'var(--color-gold-dim)',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem'
                                        }}>
                                            {activity.location}
                                        </span>
                                    )}
                                </div>
                                <h3 style={{ fontSize: '2rem', marginBottom: '16px' }}>{activity.title}</h3>
                                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                                    {activity.description}
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
