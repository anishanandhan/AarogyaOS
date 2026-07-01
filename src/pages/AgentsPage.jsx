import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { runAgent } from '../services/gemini';
import { agentMessages as initialAgentMessages } from '../data/mockData';
import { Cpu, Play, Terminal, HelpCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function AgentsPage() {
  const { stock, attendance, asha } = useApp();
  
  // Simulation statuses: 'IDLE' | 'RUNNING' | 'COMPLETED'
  const [stockStatus, setStockStatus] = useState('IDLE');
  const [attendStatus, setAttendStatus] = useState('IDLE');
  const [ashaStatus, setAshaStatus] = useState('IDLE');
  const [supervisorStatus, setSupervisorStatus] = useState('IDLE');

  // Reports contents
  const [stockReport, setStockReport] = useState('');
  const [attendReport, setAttendReport] = useState('');
  const [ashaReport, setAshaReport] = useState('');
  const [supervisorAssessment, setSupervisorAssessment] = useState('');

  const [conversationLogs, setConversationLogs] = useState(initialAgentMessages);
  const logEndRef = useRef(null);

  // Auto scroll terminal log to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationLogs]);

  // Color code tags in terminal log
  const getSpeakerColorClass = (speaker) => {
    switch (speaker) {
      case 'SUPERVISOR': return 'text-emerald font-bold';
      case 'STOCKSENSE': return 'text-info font-bold';
      case 'ATTENDAI': return 'text-indigo-400 font-bold';
      case 'ASHATRACK': return 'text-warning font-bold';
      default: return 'text-text-muted';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'RUNNING':
        return (
          <span className="rounded bg-info/10 border border-info/30 px-2 py-0.5 text-[8.5px] font-bold text-info flex items-center gap-1 animate-pulse">
            <Loader2 size={8} className="animate-spin" />
            <span>RUNNING</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="rounded bg-emerald/10 border border-emerald/30 px-2 py-0.5 text-[8.5px] font-bold text-emerald flex items-center gap-1">
            <CheckCircle2 size={8} />
            <span>COMPLETED</span>
          </span>
        );
      default:
        return (
          <span className="rounded bg-white/5 border border-border-col px-2 py-0.5 text-[8.5px] font-bold text-text-muted">
            IDLE
          </span>
        );
    }
  };

  const triggerDistrictAnalysis = async () => {
    // Reset statuses and summaries
    setStockStatus('IDLE');
    setAttendStatus('IDLE');
    setAshaStatus('IDLE');
    setSupervisorStatus('IDLE');
    setStockReport('');
    setAttendReport('');
    setAshaReport('');
    setSupervisorAssessment('');

    // Pre-seed start message
    const now = () => new Date().toLocaleTimeString([], { hour12: false });
    
    // Add start notification
    let currentLogs = [
      ...conversationLogs,
      { agent: 'SUPERVISOR', message: `Triggering live telemetry analysis sequence...`, timestamp: now(), direction: 'OUT' }
    ];
    setConversationLogs(currentLogs);

    // 1. StockSense Agent
    setStockStatus('RUNNING');
    currentLogs = [
      ...currentLogs,
      { agent: 'STOCKSENSE', message: 'Analyzing medicine stocks and depletion forecasts...', timestamp: now(), direction: 'IN' }
    ];
    setConversationLogs(currentLogs);
    
    // Package current stock data to pass to Gemini
    const stockReportText = await runAgent('STOCKSENSE', { stock });
    setStockReport(stockReportText);
    setStockStatus('COMPLETED');
    
    currentLogs = [
      ...currentLogs,
      { agent: 'STOCKSENSE', message: `REPORT: ${stockReportText}`, timestamp: now(), direction: 'OUT' }
    ];
    setConversationLogs(currentLogs);

    // 2. AttendAI Agent
    setAttendStatus('RUNNING');
    currentLogs = [
      ...currentLogs,
      { agent: 'ATTENDAI', message: 'Evaluating physician schedules and attendance rosters...', timestamp: now(), direction: 'IN' }
    ];
    setConversationLogs(currentLogs);
    
    const attendReportText = await runAgent('ATTENDAI', { attendance });
    setAttendReport(attendReportText);
    setAttendStatus('COMPLETED');
    
    currentLogs = [
      ...currentLogs,
      { agent: 'ATTENDAI', message: `REPORT: ${attendReportText}`, timestamp: now(), direction: 'OUT' }
    ];
    setConversationLogs(currentLogs);

    // 3. ASHATrack Agent
    setAshaStatus('RUNNING');
    currentLogs = [
      ...currentLogs,
      { agent: 'ASHATRACK', message: 'Verifying field worker visits and integrity metrics...', timestamp: now(), direction: 'IN' }
    ];
    setConversationLogs(currentLogs);
    
    const ashaReportText = await runAgent('ASHATRACK', { asha });
    setAshaReport(ashaReportText);
    setAshaStatus('COMPLETED');
    
    currentLogs = [
      ...currentLogs,
      { agent: 'ASHATRACK', message: `REPORT: ${ashaReportText}`, timestamp: now(), direction: 'OUT' }
    ];
    setConversationLogs(currentLogs);

    // 4. Supervisor Synthesis
    setSupervisorStatus('RUNNING');
    currentLogs = [
      ...currentLogs,
      { agent: 'SUPERVISOR', message: 'Collating sub-agent reports into district assessment priority checklist...', timestamp: now(), direction: 'IN' }
    ];
    setConversationLogs(currentLogs);
    
    const supervisorAssessmentText = await runAgent('SUPERVISOR', {
      stockReport: stockReportText,
      attendReport: attendReportText,
      ashaReport: ashaReportText
    });
    setSupervisorAssessment(supervisorAssessmentText);
    setSupervisorStatus('COMPLETED');

    currentLogs = [
      ...currentLogs,
      { agent: 'SUPERVISOR', message: `FINAL ASSESSMENT SYNTHESIS: ${supervisorAssessmentText}`, timestamp: now(), direction: 'OUT' },
      { agent: 'SUPERVISOR', message: 'Telemetry analysis successfully dispatched to District Medical Officer.', timestamp: now(), direction: 'OUT' }
    ];
    setConversationLogs(currentLogs);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Console Command panel */}
      <div className="rounded-xl border border-border-col bg-surface p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-card" style={{ animationDelay: '0ms' }}>
        <div>
          <h1 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Cpu size={16} className="text-emerald" />
            <span>ADK Multi-Agent Orchestration Panel</span>
          </h1>
          <p className="text-[10px] text-text-muted mt-1 font-mono">
            Simulates inter-agent coordination (A2A protocol) using structured Gemini pipelines
          </p>
        </div>

        <button
          onClick={triggerDistrictAnalysis}
          disabled={
            stockStatus === 'RUNNING' || 
            attendStatus === 'RUNNING' || 
            ashaStatus === 'RUNNING' || 
            supervisorStatus === 'RUNNING'
          }
          className="flex items-center gap-1.5 rounded bg-emerald text-navy px-4.5 py-2.5 text-xs font-bold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-emerald/10"
        >
          <Play size={12} fill="currentColor" />
          <span>Run District Analysis</span>
        </button>
      </div>

      {/* Supervisor Card */}
      <div className="rounded-xl border border-emerald/30 bg-emerald/5 p-5 animate-card" style={{ animationDelay: '50ms' }}>
        <div className="flex items-start justify-between border-b border-emerald/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald/20 text-emerald">
              <Cpu size={12} />
            </span>
            <span className="text-xs font-bold text-emerald uppercase tracking-wider">Supervisor Agent</span>
          </div>
          {getStatusBadge(supervisorStatus)}
        </div>
        
        <div className="mt-3.5 space-y-2">
          <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wider font-mono">
            District Assessment Synthesis & Action Plan
          </p>
          <div className="rounded-lg bg-navy/60 p-4 border border-border-col/50 font-mono text-xs text-text-secondary leading-relaxed">
            {supervisorAssessment || (
              <span className="text-text-muted italic">Click "Run District Analysis" to generate synthesis assessment...</span>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Agent Cards Roster */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 animate-card" style={{ animationDelay: '100ms' }}>
        
        {/* StockSense Agent */}
        <div className="rounded-xl border-l-4 border-l-info border-y border-r border-border-col bg-surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between border-b border-border-col/40 pb-3">
              <div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">StockSense Agent</h3>
                <p className="text-[9px] text-text-muted mt-0.5 font-mono">Supply Chain analysis</p>
              </div>
              {getStatusBadge(stockStatus)}
            </div>

            <p className="mt-4 font-mono text-[11px] leading-relaxed text-text-secondary">
              {stockReport || <span className="text-text-muted italic">Awaiting query trigger...</span>}
            </p>
          </div>
        </div>

        {/* AttendAI Agent */}
        <div className="rounded-xl border-l-4 border-l-indigo-400 border-y border-r border-border-col bg-surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between border-b border-border-col/40 pb-3">
              <div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">AttendAI Agent</h3>
                <p className="text-[9px] text-text-muted mt-0.5 font-mono">Human Resources logs</p>
              </div>
              {getStatusBadge(attendStatus)}
            </div>

            <p className="mt-4 font-mono text-[11px] leading-relaxed text-text-secondary">
              {attendReport || <span className="text-text-muted italic">Awaiting query trigger...</span>}
            </p>
          </div>
        </div>

        {/* ASHATrack Agent */}
        <div className="rounded-xl border-l-4 border-l-warning border-y border-r border-border-col bg-surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between border-b border-border-col/40 pb-3">
              <div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">ASHATrack Agent</h3>
                <p className="text-[9px] text-text-muted mt-0.5 font-mono">ASHA Workers verification</p>
              </div>
              {getStatusBadge(ashaStatus)}
            </div>

            <p className="mt-4 font-mono text-[11px] leading-relaxed text-text-secondary">
              {ashaReport || <span className="text-text-muted italic">Awaiting query trigger...</span>}
            </p>
          </div>
        </div>

      </div>

      {/* Terminal Conversation Log */}
      <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4 animate-card" style={{ animationDelay: '150ms' }}>
        <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-border-col/40 pb-3">
          <Terminal size={14} className="text-emerald animate-pulse" />
          <span>A2A Protocol Conversation Log (Monospace)</span>
        </h2>

        {/* Terminal viewport */}
        <div className="h-[250px] overflow-y-auto rounded-lg bg-navy p-4 font-mono text-xs leading-relaxed space-y-2 border border-border-col/65 select-text">
          {conversationLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-1.5">
              <span className="text-text-muted shrink-0 text-[10px] select-none">[{log.timestamp}]</span>
              <span className={getSpeakerColorClass(log.agent)}>{log.agent}</span>
              <span className="text-text-muted shrink-0 select-none">{log.direction === 'OUT' ? '::' : '>>'}</span>
              <span className="text-text-secondary font-mono">{log.message}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

    </div>
  );
}
