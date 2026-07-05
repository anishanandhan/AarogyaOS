import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { label: 'Home', target: '/' },
    { label: 'Public Map', target: '/public/map' },
    { label: 'Impact', target: '/impact' },
    { label: 'Cost & ROI', target: '/cost-analytics' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
            <img
              src="/aarogyaos_logo.png"
              alt="AarogyaOS Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
              AarogyaOS
            </span>
            <span className="text-[9px] md:text-[10px] font-medium leading-none mt-1 text-gray-500">
              The Operating System for Rural Health
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.target}
              className="text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Nav Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            Portal Login
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-55 rounded-full border border-gray-200">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-semibold text-gray-900">Emergency Link Active</span>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center relative z-50"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-550 ${mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col justify-center h-full px-8 gap-2 pt-16">
            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                to={link.target}
                className="text-3xl font-bold text-slate-800 hover:text-emerald-600 transition-all duration-550 ease-[cubic-bezier(0.76,0,0.24,1)] cursor-pointer"
                style={{
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateX(0)' : 'translateX(32px)',
                  transitionDelay: `${100 + i * 60}ms`,
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div
            className="mt-8 pt-8 border-t border-neutral-200 px-8 transition-all duration-500"
            style={{
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateX(0)' : 'translateX(32px)',
              transitionDelay: '450ms',
            }}
          >
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate('/login');
              }}
              className="w-full px-6 py-4 bg-black rounded-full text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200 cursor-pointer"
            >
              Access Portal
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
