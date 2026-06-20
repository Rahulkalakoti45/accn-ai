import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ToastContainer } from '../components/Toast';
import { PageTransition } from '../components/PageTransition';
import Lenis from 'lenis';

export const RootLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    // Only enable Lenis if we aren't on the AI Assistant page which has its own scrolling chat pane,
    // or if we want smooth scroll everywhere except specific elements.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // For Landing page, we don't display the sidebar or standard navbar (it has its own custom menu/navbar)
  const isLandingPage = location.pathname === '/';
  // Auth page also doesn't show standard layout
  const isAuthPage = location.pathname === '/auth';

  if (isLandingPage || isAuthPage) {
    return (
      <div className="min-h-screen bg-bgSpace text-textPrimary flex flex-col relative overflow-x-hidden">
        <main className="flex-grow">
          <Outlet />
        </main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgSpace text-textPrimary flex flex-col relative overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout Container */}
      <div className="flex flex-grow w-full pt-16">
        {/* Left Navigation Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Scrollable Content Pane */}
        <main
          className="flex-grow transition-all duration-300 min-h-[calc(100vh-4rem)] flex flex-col p-6 overflow-x-hidden"
          style={{ paddingLeft: isCollapsed ? '96px' : '284px' }}
        >
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      {/* Global Toast Message Stack */}
      <ToastContainer />
    </div>
  );
};
