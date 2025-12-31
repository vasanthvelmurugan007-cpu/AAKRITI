import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Loader } from 'lucide-react';
import { apiFetch } from '../utils/api';
import './Login.css';

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            onLoginSuccess(data.user);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Login failed. Check server logs or try (admin / admin).');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="login-overlay">
                    <motion.div
                        className="login-modal glass-panel"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <button className="close-btn" onClick={onClose}>
                            <X size={24} />
                        </button>

                        <div className="login-header">
                            <div className="icon-wrapper">
                                <Lock size={24} color="#c9a875" />
                            </div>
                            <h2>Admin Access</h2>
                            <p>Enter credentials to manage gallery</p>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleLogin} className="login-form">
                            <input
                                type="text"
                                placeholder="Username or Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? <Loader className="spin" size={20} /> : 'Login'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Login;
