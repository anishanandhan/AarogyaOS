import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Activity, Shield, ClipboardList, Heart } from 'lucide-react';

export default function LoginPage() {
  const { setUserRole } = useApp();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setUserRole(role);
    navigate('/dashboard');
  };

  const roles = [
    {
      id: 'District Admin',
      title: 'District Admin',
      description: 'District Health Officer view. System telemetry, supply chain overrides, and multi-agent reports.',
      icon: Shield,
      color: 'text-info bg-info/10 border-info/20'
    },
    {
      id: 'PHC Staff',
      title: 'PHC / CHC Staff',
      description: 'Log inventory levels, report doctor attendance, update diagnostics availability checklist.',
      icon: ClipboardList,
      color: 'text-emerald bg-emerald/10 border-emerald/20'
    },
    {
      id: 'ASHA Worker',
      title: 'ASHA Field Worker',
      description: 'ASHA & ANM visit logger. Simplified mobile visit reports with photo proof uploads.',
      icon: Heart,
      color: 'text-danger bg-danger/10 border-danger/20'
    }
  ];

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-navy p-6 select-none">
      
      {/* Brand Header */}
      <div className="mb-10 text-center animate-card" style={{ animationDelay: '0ms' }}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald/10 text-emerald border border-emerald/20 shadow-lg shadow-emerald/5">
          <Activity size={32} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Smart Health
        </h1>
        <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto">
          AI-Driven Health Centre & Supply Chain Decision Intelligence Platform
        </p>
      </div>

      {/* Role Selection Container */}
      <div className="w-full max-w-4xl animate-card" style={{ animationDelay: '100ms' }}>
        <div className="text-center mb-6">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest">
            Select Your Role to Access Portal
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {roles.map((r, index) => {
            const Icon = r.icon;

            return (
              <button
                key={r.id}
                onClick={() => handleRoleSelect(r.id)}
                className="group flex flex-col items-center text-center rounded-2xl border border-border-col bg-surface p-6 shadow-xl hover:-translate-y-1 hover:border-text-secondary hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald/40 cursor-pointer"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ${r.color} transition-all duration-300 group-hover:scale-110`}>
                  <Icon size={24} />
                </div>
                
                <h3 className="text-base font-bold text-text-primary transition-all duration-300 group-hover:text-emerald">
                  {r.title}
                </h3>
                
                <p className="mt-3 text-xs text-text-muted leading-relaxed">
                  {r.description}
                </p>
                
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span>Enter Dashboard</span>
                  <span>&rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footnote */}
      <div className="mt-12 text-center text-[10px] text-text-muted font-mono animate-card" style={{ animationDelay: '200ms' }}>
        <p>Vellore District Administration · Google Cloud Build with AI Hackathon 2026</p>
        <p className="mt-1 opacity-70">Requires no credentials for evaluation purposes.</p>
      </div>

    </div>
  );
}
