import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { Shield, ClipboardList, Heart, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const { setUserRole, language } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    if (e) e.preventDefault();

    const u = username.toLowerCase().trim();
    if (u === 'admin') {
      setUserRole('District Admin');
      navigate('/dashboard');
    } else if (u === 'staff') {
      setUserRole('PHC Staff');
      navigate('/dashboard');
    } else if (u === 'asha') {
      setUserRole('ASHA Worker');
      navigate('/dashboard');
    } else {
      setError('Invalid username. Use the profile selectors below to auto-fill.');
    }
  };

  const handleQuickFill = (roleId) => {
    setError('');
    if (roleId === 'District Admin') {
      setUsername('admin');
      setPassword('AarogyaOS@Admin2026!');
    } else if (roleId === 'PHC Staff') {
      setUsername('staff');
      setPassword('AarogyaOS@Staff2026!');
    } else if (roleId === 'ASHA Worker') {
      setUsername('asha');
      setPassword('AarogyaOS@Asha2026!');
    }
  };

  const roles = [
    {
      id: 'District Admin',
      titleKey: 'districtAdmin',
      icon: Shield,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'PHC Staff',
      titleKey: 'phcStaff',
      icon: ClipboardList,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'ASHA Worker',
      titleKey: 'ashaWorker',
      icon: Heart,
      color: 'text-red-600 bg-red-50 border-red-200'
    }
  ];

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-slate-50 p-6 select-none font-sans">
      
      {/* Brand Header */}
      <div className="mb-8 text-center animate-card flex flex-col items-center" style={{ animationDelay: '0ms' }}>
        <div className="mb-4 flex items-center justify-center shadow-md">
          <img
            src="/aarogyaos_logo.png"
            alt="AarogyaOS Logo"
            className="h-14 w-auto object-contain"
          />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          AarogyaOS
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
          {getTranslation('theOperatingSystemForRuralHealth', language)}
        </p>
      </div>

      {/* Main Login Form & Quick Fill Container */}
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-xl p-6 md:p-8 animate-card" style={{ animationDelay: '100ms' }}>
        <h2 className="text-xl font-bold text-slate-800 text-center mb-6">
          Access Portal
        </h2>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600 text-center animate-card">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Access Profile Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Select Access Profile
            </label>
            <div className="space-y-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const uValue = r.id === 'District Admin' ? 'admin' : r.id === 'PHC Staff' ? 'staff' : 'asha';
                const isSelected = username === uValue;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleQuickFill(r.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${r.color}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-750">
                        {getTranslation(r.titleKey, language)}
                      </h3>
                      <p className="text-[10px] text-slate-450 leading-normal mt-0.5">
                        {getTranslation(r.id === 'District Admin' ? 'districtAdminDescription' : r.id === 'PHC Staff' ? 'phcStaffDescription' : 'ashaWorkerDescription', language)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleLogin} className="flex flex-col justify-between md:border-l md:border-slate-100 md:pl-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-slate-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-slate-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-all cursor-pointer mt-6"
            >
              Sign In & Access System
            </button>
          </form>
        </div>
      </div>

      {/* Footnote */}
      <div className="mt-8 text-center text-[10px] text-slate-450 font-mono animate-card" style={{ animationDelay: '200ms' }}>
        <p>{getTranslation('velloreDistrictAdmin', language)}</p>
      </div>

    </div>
  );
}
