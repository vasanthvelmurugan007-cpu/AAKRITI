import React, { useState } from 'react';
import { apiFetch } from '../utils/api';

const VolunteerRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const response = await apiFetch('/api/volunteers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            // apiFetch throws if not ok, so if we get here it's success (or 204)
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <section id="volunteer" className="section-spacing container" style={{ padding: '100px 24px' }}>

            <div className="glass-panel" style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '0',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>

                {/* LEFT COLUMN: CONTEXT & IMPACT */}
                <div style={{
                    padding: '60px',
                    background: 'rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Join the<br />Movement</h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '40px', lineHeight: '1.6' }}>
                        Your time and skills can light up lives. Become a part of Aakritii's mission to reshape narratives and build a more inclusive society.
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            'Mentorship & Education Support',
                            'Healthcare Camps Coordination',
                            'Livelihood Training Programs',
                            'Event Management & Outreach'
                        ].map((item, index) => (
                            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--color-gold-light)' }}>
                                <div style={{ width: '8px', height: '8px', background: 'var(--color-gold)', borderRadius: '50%' }}></div>
                                <span style={{ fontSize: '1.1rem' }}>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* RIGHT COLUMN: PROFESSIONAL FORM */}
                <div style={{ padding: '60px', background: 'rgba(255,255,255,0.02)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Name Field */}
                        <div>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px', color: 'rgba(255,255,255,0.6)' }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 0',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderBottom = '1px solid var(--color-gold)'}
                                onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(255,255,255,0.2)'}
                            />
                        </div>

                        {/* Contact Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px', color: 'rgba(255,255,255,0.6)' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px 0',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottom = '1px solid var(--color-gold)'}
                                    onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(255,255,255,0.2)'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px', color: 'rgba(255,255,255,0.6)' }}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91..."
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px 0',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottom = '1px solid var(--color-gold)'}
                                    onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(255,255,255,0.2)'}
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px', color: 'rgba(255,255,255,0.6)' }}>
                                How can you contribute?
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="3"
                                placeholder="I am interested in teaching..."
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 0',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontFamily: 'inherit',
                                    resize: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderBottom = '1px solid var(--color-gold)'}
                                onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(255,255,255,0.2)'}
                            ></textarea>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    background: 'var(--color-gold)',
                                    color: 'var(--color-earth-dark)',
                                    padding: '18px',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    opacity: status === 'submitting' ? 0.7 : 1
                                }}
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? 'Processing...' : 'Submit Application'}
                            </button>
                        </div>

                        {status === 'success' && (
                            <div style={{ marginTop: '10px', color: '#4caf50', textAlign: 'center' }}>
                                Application received successfully!
                            </div>
                        )}
                        {status === 'error' && (
                            <div style={{ marginTop: '10px', color: '#e74c3c', textAlign: 'center' }}>
                                Submission failed. Please try again.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default VolunteerRegistration;
