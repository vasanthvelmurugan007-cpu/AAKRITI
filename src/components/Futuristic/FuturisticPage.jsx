import React, { Suspense, useState, useEffect } from 'react';
import Scene from './Scene';
import Interface from './Interface';
import TriangularMesh from '../TriangularMesh';
import Login from '../Login';
import AdminDashboard from '../AdminDashboard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import './styles.css';

const FuturisticPage = () => {
    const [user, setUser] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [contentVersion, setContentVersion] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!user) setUser(currentUser);
        });
        return () => unsubscribe();
    }, [user]);

    // Secret Admin Access (Ctrl + Shift + L)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
                e.preventDefault();
                setIsLoginOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleAdminClose = () => {
        setIsAdminOpen(false);
        setContentVersion(prev => prev + 1);
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            backgroundColor: 'var(--color-midnight)', /* Fallback */
            background: 'url("/wood_texture_bg.jpg") center/cover no-repeat fixed, #1A1612',
            position: 'relative'
        }}>
            {/* Global Noise Overlay */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                opacity: 0.12, pointerEvents: 'none', zIndex: 1,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.6\'/%3E%3C/svg%3E")'
            }}></div>

            {/* Original Geometric Mesh */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.6, zIndex: 2 }}>
                <TriangularMesh />
            </div>

            {/* Futuristic 3D Overlay (Orbs only now) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3 }}>
                <Suspense fallback={<div className="loading-screen">INITIALIZING...</div>}>
                    <Scene />
                </Suspense>
            </div>

            {/* UI Interface */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
                <Interface
                    user={user}
                    contentVersion={contentVersion}
                    onOpenLogin={() => setIsLoginOpen(true)}
                />
            </div>

            {/* Admin Dashboard Trigger/Modal */}
            {isAdminOpen && user && (
                <div style={{ position: 'relative', zIndex: 9999 }}>
                    <AdminDashboard user={user} onClose={handleAdminClose} />
                </div>
            )}

            {/* Show Admin Button if logged in but dashboard closed */}
            {user && user.role === 'admin' && !isAdminOpen && (
                <button
                    style={{
                        position: 'fixed', bottom: '20px', right: '20px', zIndex: 999,
                        background: '#c9a875', color: '#2a2218', padding: '10px 20px',
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                    onClick={() => setIsAdminOpen(true)}
                >
                    Open Admin Dashboard
                </button>
            )}

            <Login
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLoginSuccess={(mockUser) => {
                    if (mockUser) {
                        setUser(mockUser);
                        if (mockUser.role === 'admin') setIsAdminOpen(true);
                    }
                    setIsLoginOpen(false);
                }}
            />
        </div>
    );
};

export default FuturisticPage;
