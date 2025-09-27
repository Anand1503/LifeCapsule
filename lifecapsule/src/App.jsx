import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar/Sidebar';
import DiaryEntry from './pages/DiaryEntry/DiaryEntry';
import PersonalAssistant from './pages/PersonalAssistant/PersonalAssistant';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Sidebar
          isMobile={isMobile}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <main className={`
          transition-all duration-300 ease-in-out
          ${isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-16'}
          pt-16 min-h-screen
        `}>
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="p-6"
          >
            <Routes>
              <Route
                path="/diary"
                element={<DiaryEntry />}
              />
              <Route
                path="/assistant"
                element={<PersonalAssistant />}
              />
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
              <Route
                path="/"
                element={<Navigate to="/diary" replace />}
              />
            </Routes>
          </motion.div>
        </main>
      </div>
    </Router>
  );
}

export default App;
