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
        <section id="volunteer" className="section-spacing container" style={{ padding: '80px 24px' }}>
            <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px' }}>
                <div className="section-header" style={{ marginBottom: '40px' }}>
                    <h2 className="section-title">Register to Volunteer</h2>
                    <p className="gold-text">Join hands with us to create a better tomorrow</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'white',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>How would you like to contribute?</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            required
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'white',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                        ></textarea>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <button
                            type="submit"
                            style={{
                                background: 'var(--color-gold)',
                                color: 'var(--color-earth-dark)',
                                padding: '16px 48px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: '50px',
                                transition: 'all 0.3s ease',
                                opacity: status === 'submitting' ? 0.7 : 1
                            }}
                            className="hover-lift"
                            disabled={status === 'submitting'}
                        >
                            {status === 'submitting' ? 'Submitting...' : 'Register Now'}
                        </button>
                    </div>

                    {status === 'success' && (
                        <div style={{ background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                            Thank you for registering! We will contact you soon.
                        </div>
                    )}
                    {status === 'error' && (
                        <div style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                            Something went wrong. Please try again.
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
};

export default VolunteerRegistration;
