import React, { useRef } from 'react';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = ({ onOpenLogin, user }) => {
    const lastTap = useRef(0);

    const handleDoubleTap = (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap.current;
        if (tapLength < 500 && tapLength > 0) {
            if (onOpenLogin) onOpenLogin();
            e.preventDefault();
        }
        lastTap.current = currentTime;
    };

    return (
        <footer className="footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '80px' }}>
            <div className="container footer-content" style={{ padding: '60px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>

                    {/* Brand */}
                    <div className="footer-logo" style={{ marginBottom: '0' }}>
                        <img src={logo} alt="AAKRITII" className="footer-logo-img" style={{ height: '50px', width: 'auto' }} />
                    </div>

                    {/* Links */}
                    <div className="footer-links" style={{ display: 'flex', gap: '30px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)' }}>
                        <a href="#">Governance</a>
                        <a href="#">Financials</a>
                        <a href="#">Privacy</a>
                        <a href="#">Contact</a>
                    </div>
                </div>

                <div style={{ margin: '50px 0', width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                    <div className="sanskrit-wrapper" style={{ textAlign: 'left' }}>
                        <p
                            className="sanskrit-text"
                            onClick={handleDoubleTap}
                            style={{ cursor: 'pointer', userSelect: 'none', color: 'var(--color-gold)', fontSize: '1.2rem' }}
                        >
                            वसुधैव कुटुम्बकम्
                        </p>
                        <p className="sanskrit-trans" style={{ opacity: 0.5, fontSize: '0.8rem' }}>The World Is One Family</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <p className="copyright" style={{ opacity: 0.4, fontSize: '0.8rem' }}>
                            &copy; 2025 Aakritii Foundation. All Rights Reserved.
                        </p>
                        {user && <span style={{ color: '#2ecc71', fontSize: '0.7rem', display: 'block', marginTop: '5px' }}>● System Active</span>}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
