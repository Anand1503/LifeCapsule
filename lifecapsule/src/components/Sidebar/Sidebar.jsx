import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Bot, BarChart3, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isMobile, isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { id: 'diary', label: 'Diary Entry', icon: BookOpen, path: '/diary' },
    { id: 'assistant', label: 'Personal Assistant', icon: Bot, path: '/assistant' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 md:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
              fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-40
              ${isMobile ? 'w-64' : 'w-16 hover:w-64'}
              transition-all duration-300 ease-in-out
            `}
            onMouseEnter={() => !isMobile && setIsOpen(true)}
            onMouseLeave={() => !isMobile && setIsOpen(false)}
          >
            <div className="flex flex-col h-full">
              {/* Logo/Brand */}
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">LifeCapsule</h1>
              </div>

              {/* Navigation Menu */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <li key={item.id}>
                        <Link
                          to={item.path}
                          onClick={() => {
                            if (isMobile) setIsOpen(false);
                          }}
                          className={`
                            w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200
                            ${isActive
                              ? 'bg-gray-900 text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }
                          `}
                        >
                          <Icon size={20} className="flex-shrink-0" />
                          <AnimatePresence>
                            {(isOpen || !isMobile) && (
                              <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-3 font-medium whitespace-nowrap"
                              >
                                {item.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
