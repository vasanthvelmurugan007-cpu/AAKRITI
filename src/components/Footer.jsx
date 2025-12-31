import React from 'react';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = ({ onOpenLogin, user }) => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-logo">
                    <img src={logo} alt="AAKRITII NGO" className="footer-logo-img" />
                    <span className="footer-logo-text">AAKRITII NGO</span>
                </div>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <span className="separator">•</span>
                    <a href="#">Terms of Use</a>
                    <span className="separator">•</span>
                    <a href="#">Contact</a>
                    {user ? (
                        <span className="admin-badge">Admin Mode</span>
                    ) : (
                        <button onClick={onOpenLogin} className="admin-login-link">Admin Login</button>
                    )}
                </div>

                <div className="sanskrit-wrapper">
                    <p className="sanskrit-text">वसुधैव कुटुम्बकम्</p>
                    <p className="sanskrit-trans">"The World Is One Family"</p>
                </div>

                <p className="copyright">&copy; 2025 Aakritii NGO. Empowering Tribals, Enriching Lives.</p>
            </div>
        </footer>
    );
};

export default Footer;
