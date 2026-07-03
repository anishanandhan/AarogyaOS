import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  Cpu,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Languages,
  Hand,
  Map
} from 'lucide-react';
import VaaniBot from './VaaniBot';
import { initializeMediaPipe, GESTURES, getGestureDescription } from '../services/mediapipe';

export default function Layout({ children }) {
  const { userRole, logout, criticalCount, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [gestureToast, setGestureToast] = useState(null);
  const [gesturesEnabled, setGesturesEnabled] = useState(false);

  // Automatically collapse sidebar on smaller screens
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

  // Initialize MediaPipe gesture detection
  useEffect(() => {
    let initialized = false;

    const handleGestureDetected = (gestureData) => {
      const description = getGestureDescription(gestureData.gesture);
      setGestureToast({ gesture: gestureData.gesture, description });

      // Auto-hide toast after 2 seconds
      setTimeout(() => setGestureToast(null), 2000);

      // Handle gesture actions
      handleGestureAction(gestureData.gesture);
    };

    // Initialize MediaPipe (uses keyboard simulation for demo)
    const init = async () => {
      if (!initialized) {
        await initializeMediaPipe(null, handleGestureDetected);
        initialized = true;
        setGesturesEnabled(true);
        console.log('[Layout] MediaPipe gesture detection initialized (Demo mode: Press keys 1-7)');
      }
    };

    init();

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Handle gesture actions
  const handleGestureAction = (gesture) => {
    const currentPage = location.pathname.split('/')[1] || 'dashboard';

    switch (gesture) {
      case GESTURES.THUMBS_UP:
        console.log('[Gesture] Thumbs Up - Refresh/Approve');
        // Could trigger page refresh or approve action
        break;
      case GESTURES.THUMBS_DOWN:
        console.log('[Gesture] Thumbs Down - Dismiss');
        break;
      case GESTURES.OPEN_PALM:
        console.log('[Gesture] Open Palm - Pause');
        break;
      case GESTURES.POINTING_UP:
        window.scrollBy({ top: -300, behavior: 'smooth' });
        break;
      case GESTURES.POINTING_DOWN:
        window.scrollBy({ top: 300, behavior: 'smooth' });
        break;
      case GESTURES.PEACE_SIGN:
        console.log('[Gesture] Peace Sign - Toggle view');
        setIsCollapsed(prev => !prev);
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define sidebar menu items
  const menuItems = [
    { path: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard, role: 'ALL' },
    { path: '/map', labelKey: 'publicHealthMap', icon: Map, role: 'ADMIN_STAFF' },
    { path: '/alerts', labelKey: 'alerts', icon: Bell, role: 'ADMIN_STAFF', badge: criticalCount },
    { path: '/centres', labelKey: 'centres', icon: Hospital, role: 'ADMIN_STAFF' },
    { path: '/stock', labelKey: 'stockSense', icon: Package, role: 'ADMIN_STAFF' },
    { path: '/footfall', labelKey: 'flowAI', icon: Activity, role: 'ADMIN_STAFF' },
    { path: '/attendance', labelKey: 'attendAI', icon: CalendarDays, role: 'ADMIN_STAFF' },
    { path: '/asha', labelKey: 'ashaTrack', icon: Heart, role: 'ALL' },
    { path: '/impact', labelKey: 'impact', icon: Users, role: 'ADMIN_STAFF' },
    { path: '/labs', labelKey: 'labAudit', icon: Beaker, role: 'ADMIN_STAFF' },
    { path: '/agents', labelKey: 'adkAgents', icon: Cpu, role: 'ADMIN_STAFF' },
  ];

  // Filter items by user role
  const visibleMenuItems = menuItems.filter(item => {
    if (item.role === 'ALL') return true;
    // ASHA Worker only sees Dashboard and ASHATrack
    if (userRole === 'ASHA Worker') return false;
    return true;
  });

  // Derived Title for breadcrumb
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'District Command Dashboard';
    if (path === '/map') return 'Public Health Map';
    if (path === '/alerts') return 'Early-Warning Alerts';
    if (path === '/centres') return 'Health Centres Registry';
    if (path.startsWith('/centres/')) return 'Centre Profile View';
    if (path === '/stock') return 'StockSense Medicine Inventory';
    if (path === '/footfall') return 'FlowAI Patient Footfall & Beds';
    if (path === '/attendance') return 'AttendAI Check-in Logs';
    if (path === '/asha') return 'ASHATrack Field visits';
    if (path === '/impact') return 'Community Health Impact';
    if (path === '/labs') return 'LabAudit Diagnostics Matrix';
    if (path === '/agents') return 'ADK Multi-Agent Orchestration';
    return 'AarogyaOS';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-navy text-text-primary font-sans">
      
      {/* Sidebar container */}
      <aside 
        className={`relative flex flex-col bg-surface border-r border-border-col transition-all duration-300 ${
          isCollapsed ? 'w-[68px]' : 'w-[240px]'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-border-col px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/20 text-emerald">
                <Activity size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
                AarogyaOS
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/20 text-emerald">
              <Activity size={20} />
            </div>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded border border-border-col bg-navy text-text-secondary hover:text-white"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 space-y-1 py-4 px-2 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path === '/centres' && location.pathname.startsWith('/centres/'));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group ${
                  isActive 
                    ? 'bg-white/5 text-emerald border-l-2 border-emerald pl-2.5' 
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary border-l-2 border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-emerald' : 'text-text-muted group-hover:text-text-secondary'} />
                {!isCollapsed && <span className="truncate">{getTranslation(item.labelKey, language)}</span>}
                
                {/* Badge for notifications */}
                {item.badge > 0 && !isCollapsed && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white font-mono">
                    {item.badge}
                  </span>
                )}
                {item.badge > 0 && isCollapsed && (
                  <div className="absolute left-[46px] top-2 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-surface" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border-col p-4">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                {getTranslation('activeNode', language)}
              </div>
              <div className="rounded-lg bg-navy/40 p-2.5 text-xs border border-border-col/50">
                <p className="font-semibold text-text-secondary">Vellore District</p>
                <div className="mt-1 flex items-center justify-between text-text-muted font-mono">
                  <span>8 Centres</span>
                  <span className="text-danger">{criticalCount} {getTranslation('critical', language)}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-danger/10 hover:text-danger transition-all cursor-pointer"
              >
                <LogOut size={14} />
                <span>{getTranslation('signOut', language)}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-danger/10 hover:text-danger transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Main content viewport */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-border-col bg-surface px-6">
          
          {/* Left Breadcrumbs */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-muted">AarogyaOS</span>
            <span className="text-text-muted">/</span>
            <span className="text-sm font-bold text-text-primary">{getPageTitle()}</span>
          </div>

          {/* Center Location tag */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-navy/50 px-3.5 py-1 text-xs border border-border-col text-text-secondary font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
            <span>HQ: Vellore, TN</span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-4">

            {/* Language Selector */}
            <div className="flex items-center gap-1 rounded-lg border border-border-col bg-navy/50 p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`rounded px-2 py-1 text-[10px] font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-emerald text-white'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`rounded px-2 py-1 text-[10px] font-semibold transition-all ${
                  language === 'hi'
                    ? 'bg-emerald text-white'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                HI
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`rounded px-2 py-1 text-[10px] font-semibold transition-all ${
                  language === 'ta'
                    ? 'bg-emerald text-white'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                TA
              </button>
            </div>

            {/* Role Badge */}
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald/10 border border-emerald/20 px-2.5 py-0.5 text-xs font-semibold text-emerald">
                {userRole}
              </span>
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-navy p-6 md:p-8">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>

      {/* Floating VaaniBot widget */}
      <VaaniBot />

      {/* Gesture Toast Notification */}
      {gestureToast && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 rounded-lg border border-emerald/30 bg-emerald/10 backdrop-blur-sm px-4 py-3 shadow-lg">
            <Hand size={20} className="text-emerald" />
            <div>
              <div className="text-sm font-bold text-emerald">{gestureToast.gesture}</div>
              <div className="text-xs text-text-secondary">{gestureToast.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Gesture Status Indicator */}
      {gesturesEnabled && (
        <div className="fixed bottom-6 left-6 z-40">
          <div className="flex items-center gap-2 rounded-full border border-border-col bg-surface/90 backdrop-blur-sm px-3 py-1.5 shadow-lg">
            <Hand size={14} className="text-emerald animate-pulse" />
            <span className="text-[10px] font-semibold text-text-muted">Gestures Active</span>
            <span className="text-[9px] text-text-muted font-mono">(Keys 1-7)</span>
          </div>
        </div>
      )}
    </div>
  );
}
