import React, { useState, useEffect, useRef, Suspense } from 'react';
import HTMLFlipBook from 'react-pageflip';
import BookPage from './components/BookPage';

import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import TriangularMesh from './components/TriangularMesh';
import CustomCursor from './components/CustomCursor';
import { Leaf, Heart, Feather } from 'lucide-react';
import BookTabs from './components/BookTabs';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Lazy Load Non-Critical Components for Performance
const Essence = React.lazy(() => import('./components/Essence'));
const Pillars = React.lazy(() => import('./components/Pillars'));
const Gallery = React.lazy(() => import('./components/Gallery'));
const ImpactNumbers = React.lazy(() => import('./components/ImpactNumbers'));
const Activities = React.lazy(() => import('./components/Activities'));
const VolunteerRegistration = React.lazy(() => import('./components/VolunteerRegistration'));

function App() {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [contentVersion, setContentVersion] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Track current page index
  const bookRef = useRef();

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

  const jumpToPage = (index) => {
    if (bookRef.current && bookRef.current.pageFlip()) {
      bookRef.current.pageFlip().flip(index);
    }
  };

  const onPageFlip = (e) => {
    setCurrentPage(e.data);
  };

  return (
    <div className="app-container" style={{
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--color-midnight)', /* Fallback */
      background: 'url("/wood_texture_bg.jpg") center/cover no-repeat fixed, #1A1612', /* Mixed Midnight */
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Global Noise Overlay for Paper Texture Feel */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        opacity: 0.12, pointerEvents: 'none', zIndex: 9998,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.6\'/%3E%3C/svg%3E")'
      }}></div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.6 }}><TriangularMesh /></div>

      {/* Floating Elements (Icons Drifting) */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, overflow: 'hidden' }}>
        <Leaf size={40} className="floating-icon" style={{ top: '20%', left: '15%', animationDelay: '0s' }} />
        <Feather size={32} className="floating-icon" style={{ top: '60%', right: '10%', animationDelay: '2s', transform: 'rotate(45deg)' }} />
        <Heart size={24} className="floating-icon" style={{ bottom: '15%', left: '30%', animationDelay: '5s' }} />
      </div>


      <main style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>

        {/* THE BIG BOOK WRAPPER */}
        {/* Constrain layout to single-page aspect ratio to prevent spread view */}
        <div style={{
          position: 'relative',
          height: '85vh',
          aspectRatio: '0.72', /* approx 1:1.4 page ratio */
          maxHeight: '1200px',
          margin: '0 auto', /* Center */
          display: 'flex',
          justifyContent: 'center'
        }}>
          {/* TABS Navigation - Sticky Right */}
          <div style={{ position: 'absolute', right: '-45px', top: '50px', zIndex: 1, pointerEvents: 'auto' }}>
            <BookTabs currentSection={currentPage} onTabClick={jumpToPage} />
          </div>

          <HTMLFlipBook
            width={600}
            height={840}
            size="stretch"
            minWidth={300}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1400}
            drawShadow={true}
            maxShadowOpacity={0.5}
            showCover={true}
            usePortrait={true}
            startPage={0}
            mobileScrollSupport={true}
            className="book-flip-container"
            ref={bookRef}
            onFlip={onPageFlip}
          >
            {/* COVER PAGE */}
            <div className="page-cover cinematic-cover">
              <div className="triangular-accent" style={{ top: 0, left: 0 }}></div>
              <div className="triangular-accent" style={{ bottom: 0, right: 0, transform: 'rotate(180deg)' }}></div>

              <div className="cinematic-title">AAKRITII</div>
              <div className="cinematic-subtitle">Empower • Inspire • Transform</div>

              <div className="swipe-instruction">
                <span>Swipe or Click to Begin</span>
                <span className="swipe-arrow">→</span>
              </div>
            </div>

            {/* Page 1: HERO */}
            <BookPage number={1}>
              <div className="book-foreword" style={{ textAlign: 'center', marginTop: '30px', padding: '0 20px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-accent)',
                  fontSize: '2rem',
                  color: 'var(--color-earth-main)',
                  marginBottom: '2rem',
                  borderBottom: '1px solid var(--color-gold)',
                  display: 'inline-block',
                  paddingBottom: '10px'
                }}>
                  Foreword
                </h3>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  fontStyle: 'italic',
                  color: '#5a4638'
                }}>
                  "We are Aakritii. A dedicated youth-driven force continuously working to uplift marginalized communities and paint a brighter future."
                </p>
                <div style={{ marginTop: '40px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '50px', height: '2px', background: 'var(--color-gold)' }}></div>
                </div>
                <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                  Welcome to our story. Turn the pages to witness our journey, our pillars, and the lives we touch.
                </p>
              </div>
            </BookPage>

            {/* Page 2: Essence */}
            <BookPage number={2} title="Our Essence">
              <Suspense fallback={<div className="section-loader"></div>}>
                <Essence />
              </Suspense>
            </BookPage>

            {/* Page 3: Impact */}
            <BookPage number={3} title="Our Impact">
              <Suspense fallback={<div className="section-loader"></div>}>
                <ImpactNumbers />
              </Suspense>
            </BookPage>

            {/* Page 4: Pillars */}
            <BookPage number={4} title="Pillars of Hope">
              <Suspense fallback={<div className="section-loader"></div>}>
                <Pillars key={`pillars-${contentVersion}`} />
              </Suspense>
            </BookPage>

            {/* Page 5: Activities */}
            <BookPage number={5} title="Recent Initiatives">
              <Suspense fallback={<div className="section-loader"></div>}>
                <Activities key={`activities-${contentVersion}`} />
              </Suspense>
            </BookPage>

            {/* Page 6: Gallery */}
            <BookPage number={6} title="Visual Archive">
              <Suspense fallback={<div className="section-loader"></div>}>
                <Gallery key={`gallery-${contentVersion}-${user?.id || 'guest'}`} user={user} />
              </Suspense>
            </BookPage>

            {/* Page 7: Volunteer */}
            <BookPage number={7} title="Join the Movement">
              <Suspense fallback={<div className="section-loader"></div>}>
                <VolunteerRegistration />
              </Suspense>
            </BookPage>

            {/* Back Cover */}
            <div className="page-cover" style={{ backgroundColor: '#2a2218', color: '#c9a875', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <h2>AAKRITII</h2>
              <Footer onOpenLogin={() => setIsLoginOpen(true)} user={user} />
            </div>

          </HTMLFlipBook>
        </div> {/* End of Relative Wrapper */}
      </main>

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
