import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; // Keeping firebase import
import { auth } from './firebase';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './components/Login';
import TriangularMesh from './components/TriangularMesh';
import AdminDashboard from './components/AdminDashboard';
import { Suspense } from 'react';

// Lazy Load Non-Critical Components for Performance
const Essence = React.lazy(() => import('./components/Essence'));
const Pillars = React.lazy(() => import('./components/Pillars'));
const Gallery = React.lazy(() => import('./components/Gallery'));
const ImpactNumbers = React.lazy(() => import('./components/ImpactNumbers'));
const PressReleases = React.lazy(() => import('./components/PressReleases'));
const Clientele = React.lazy(() => import('./components/Clientele'));
const Activities = React.lazy(() => import('./components/Activities'));
const VolunteerRegistration = React.lazy(() => import('./components/VolunteerRegistration'));
const CSRConnects = React.lazy(() => import('./components/CSRConnects'));

function App() {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // State to force re-render of content sections after admin updates
  const [contentVersion, setContentVersion] = useState(0);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!user) setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  // Secret Admin Access Shortcut: Ctrl + Shift + L
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
    setContentVersion(prev => prev + 1); // Trigger re-fetch
  };

  return (
    <div className="app-container">
      <TriangularMesh />
      <Header />
      <main>
        <Hero />



        {/* Core Identity Sections */}
        <Suspense fallback={<div className="section-loader" />}>
          <Essence />
          <ImpactNumbers />
          <Pillars key={`pillars-${contentVersion}`} />

          {/* New Dynamic Content */}
          <Activities key={`activities-${contentVersion}`} />
          <Gallery key={`gallery-${contentVersion}-${user?.id || 'guest'}`} user={user} />
          <PressReleases key={`press-${contentVersion}`} />
          <Clientele key={`clientele-${contentVersion}`} />
          <CSRConnects key={`csr-${contentVersion}`} />

          {/* Engagement */}
          <VolunteerRegistration />
        </Suspense>
      </main>

      <Footer onOpenLogin={() => setIsLoginOpen(true)} user={user} />

      {/* Admin Dashboard Trigger/Modal */}
      {isAdminOpen && user && (
        <AdminDashboard user={user} onClose={handleAdminClose} />
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
}

export default App;
