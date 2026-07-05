import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import {
  LayoutDashboard,
  Bell,
  Hospital,
  Package,
  Activity,
  CalendarDays,
  Heart,
  Beaker,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Map,
  BarChart3
} from 'lucide-react';
import VaaniBot from './VaaniBot';

export default function Layout({ children }) {
  const { logout, criticalCount, language, setLanguage, userRole } = useApp();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Auto-hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const getNavItems = () => {
    const allItems = [
      { icon: LayoutDashboard, label: getTranslation('dashboard', language), path: '/dashboard', roles: ['District Admin', 'PHC Staff', 'ASHA Worker'] },
      { icon: Bell, label: getTranslation('alerts', language), path: '/alerts', roles: ['District Admin', 'PHC Staff'] },
      { icon: Hospital, label: getTranslation('centres', language), path: '/centres', roles: ['District Admin', 'PHC Staff'] },
      { icon: Package, label: getTranslation('stockSense', language), path: '/stock', roles: ['District Admin', 'PHC Staff'] },
      { icon: Activity, label: getTranslation('flowAI', language), path: '/footfall', roles: ['District Admin', 'PHC Staff'] },
      { icon: CalendarDays, label: getTranslation('attendAI', language), path: '/attendance', roles: ['District Admin', 'PHC Staff'] },
      { icon: Heart, label: getTranslation('ashaTrack', language), path: '/asha', roles: ['District Admin', 'ASHA Worker'] },
      { icon: Beaker, label: getTranslation('labAudit', language), path: '/labs', roles: ['District Admin', 'PHC Staff'] },
      { icon: Map, label: getTranslation('publicHealthMap', language), path: '/map', roles: ['District Admin'] },
      { icon: BarChart3, label: 'Looker Analytics', path: '/looker', roles: ['District Admin'] },
    ];

    // Filter based on user role
    return allItems.filter(item => item.roles.includes(userRole));
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Modern Navbar with Auto-hide */}
      <nav
        aria-label="Top Navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          navbarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="px-4 md:px-6 py-2.5 flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex flex-col group">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center">
                  <img
                    src="/aarogyaos_logo.png"
                    alt="AarogyaOS Logo"
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold uppercase tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
                    AarogyaOS
                  </span>
                  <span className="text-[8px] font-medium leading-none mt-0.5 text-gray-500">
                    {getTranslation('theOperatingSystemForRuralHealth', language)}
                  </span>
                </div>
              </div>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Language Switcher */}
              <div className="hidden md:flex items-center gap-1 bg-white/80 rounded-full p-1 shadow-sm border border-gray-200/50">
                {['en', 'hi', 'ta'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      language === lang
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Alerts Badge - Hidden for ASHA Workers only */}
              {userRole !== 'ASHA Worker' && (
                <Link
                  to="/alerts"
                  className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow-sm border border-gray-200/50 hover:border-red-300 transition-all group"
                >
                  <Bell size={16} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                  {criticalCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
                      {criticalCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-1.5 bg-white/80 rounded-full text-xs font-semibold text-gray-700 shadow-sm border border-gray-200/50 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all"
              >
                <LogOut size={14} />
                <span className="hidden md:inline">{getTranslation('signOut', language)}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="h-full bg-white/50 backdrop-blur-xl border-r border-gray-200/50 shadow-lg">
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 transition-all z-50"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto h-full pb-20" aria-label="Sidebar Navigation">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-gray-700 hover:bg-gray-100/80'
                  }`}
                  style={{
                    opacity: 0,
                    animation: `slideIn 0.4s ease-out ${index * 40}ms forwards`,
                  }}
                >
                  <Icon
                    size={18}
                    className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-emerald-500'} transition-colors flex-shrink-0`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-semibold truncate">{item.label}</span>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isCollapsed ? 'ml-16' : 'ml-64'
        } pt-16`}
      >
        <div className="min-h-screen p-3 md:p-5">
          {children}
        </div>
      </main>

      {/* VaaniBot */}
      <VaaniBot />

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
