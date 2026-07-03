import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { runAgent } from '../services/gemini';
import { runMastraDistrictAnalysis } from '../services/mastra';
import { translateAgentReport } from '../services/cloudTranslation';
import { agentMessages as initialAgentMessages } from '../data/mockData';
import { Cpu, Play, Terminal, HelpCircle, Loader2, CheckCircle2, Zap } from 'lucide-react';

export default function AgentsPage() {
  const { stock, attendance, asha, language } = useApp();

  // Orchestration framework toggle: 'LANGGRAPH' | 'MASTRA'
  const [orchestrationMode, setOrchestrationMode] = useState('MASTRA');

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

  // Translated reports
  const [translatedStockReport, setTranslatedStockReport] = useState('');
  const [translatedAttendReport, setTranslatedAttendReport] = useState('');
  const [translatedAshaReport, setTranslatedAshaReport] = useState('');
  const [translatedSupervisorAssessment, setTranslatedSupervisorAssessment] = useState('');

  const [conversationLogs, setConversationLogs] = useState(initialAgentMessages);
  const logEndRef = useRef(null);

  // Auto scroll terminal log to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationLogs]);

  // Translate agent reports when language changes
  useEffect(() => {
    const translateReports = async () => {
      if (language === 'en') {
        setTranslatedStockReport(stockReport);
        setTranslatedAttendReport(attendReport);
        setTranslatedAshaReport(ashaReport);
        setTranslatedSupervisorAssessment(supervisorAssessment);
        return;
      }

      if (stockReport) {
        const translated = await translateAgentReport(stockReport, language);
        setTranslatedStockReport(translated);
      }
      if (attendReport) {
        const translated = await translateAgentReport(attendReport, language);
        setTranslatedAttendReport(translated);
      }
      if (ashaReport) {
        const translated = await translateAgentReport(ashaReport, language);
        setTranslatedAshaReport(translated);
      }
      if (supervisorAssessment) {
        const translated = await translateAgentReport(supervisorAssessment, language);
        setTranslatedSupervisorAssessment(translated);
      }
    };

    translateReports();
  }, [language, stockReport, attendReport, ashaReport, supervisorAssessment]);

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
            <span>{getTranslation('running', language)}</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="rounded bg-emerald/10 border border-emerald/30 px-2 py-0.5 text-[8.5px] font-bold text-emerald flex items-center gap-1">
            <CheckCircle2 size={8} />
            <span>{getTranslation('completed', language)}</span>
          </span>
        );
      default:
        return (
          <span className="rounded bg-white/5 border border-border-col px-2 py-0.5 text-[8.5px] font-bold text-text-muted">
            {getTranslation('idle', language)}
          </span>
        );
    }
  };

  const triggerDistrictAnalysisMastra = async () => {
    // Reset statuses and summaries
    setStockStatus('IDLE');
    setAttendStatus('IDLE');
    setAshaStatus('IDLE');
    setSupervisorStatus('IDLE');
    setStockReport('');
    setAttendReport('');
    setAshaReport('');
    setSupervisorAssessment('');

    const now = () => new Date().toLocaleTimeString([], { hour12: false });

    let currentLogs = [
      ...conversationLogs,
      { agent: 'SUPERVISOR', message: `[MASTRA] Initializing unified workflow orchestration...`, timestamp: now(), direction: 'OUT' }
    ];
    setConversationLogs(currentLogs);

    // Set all agents to running
    setStockStatus('RUNNING');
    setAttendStatus('RUNNING');
    setAshaStatus('RUNNING');
    setSupervisorStatus('RUNNING');

    currentLogs = [
      ...currentLogs,
      { agent: 'SUPERVISOR', message: '[MASTRA] Executing parallel agent coordination via Mastra Workflow Engine...', timestamp: now(), direction: 'IN' }
    ];
    setConversationLogs(currentLogs);

    try {
      // Execute Mastra workflow
      const result = await runMastraDistrictAnalysis({
        stock,
        attendance,
        asha
      });

      // Update reports
      setStockReport(result.stockReport);
      setAttendReport(result.attendReport);
      setAshaReport(result.ashaReport);
      setSupervisorAssessment(result.supervisorAssessment);

      // Update statuses
      setStockStatus('COMPLETED');
      setAttendStatus('COMPLETED');
      setAshaStatus('COMPLETED');
      setSupervisorStatus('COMPLETED');

      // Add final logs
      currentLogs = [
        ...currentLogs,
        { agent: 'STOCKSENSE', message: `[MASTRA] REPORT: ${result.stockReport}`, timestamp: now(), direction: 'OUT' },
        { agent: 'ATTENDAI', message: `[MASTRA] REPORT: ${result.attendReport}`, timestamp: now(), direction: 'OUT' },
        { agent: 'ASHATRACK', message: `[MASTRA] REPORT: ${result.ashaReport}`, timestamp: now(), direction: 'OUT' },
        { agent: 'SUPERVISOR', message: `[MASTRA] FINAL ASSESSMENT: ${result.supervisorAssessment}`, timestamp: now(), direction: 'OUT' },
        { agent: 'SUPERVISOR', message: '[MASTRA] Workflow execution completed successfully. District assessment dispatched to DMO.', timestamp: now(), direction: 'OUT' }
      ];
      setConversationLogs(currentLogs);

    } catch (error) {
      console.error('[Mastra] Workflow error:', error);
      currentLogs = [
        ...currentLogs,
        { agent: 'SUPERVISOR', message: `[MASTRA] ERROR: ${error.message}. Falling back to sequential execution.`, timestamp: now(), direction: 'OUT' }
      ];
      setConversationLogs(currentLogs);

      // Reset to idle on error
      setStockStatus('IDLE');
      setAttendStatus('IDLE');
      setAshaStatus('IDLE');
      setSupervisorStatus('IDLE');
    }
  };

  const triggerDistrictAnalysisLangGraph = async () => {
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
      { agent: 'SUPERVISOR', message: `[LANGGRAPH+LYZR] Triggering live telemetry analysis sequence...`, timestamp: now(), direction: 'OUT' }
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

  // Unified trigger function that chooses orchestration mode
  const triggerDistrictAnalysis = () => {
    if (orchestrationMode === 'MASTRA') {
      triggerDistrictAnalysisMastra();
    } else {
      triggerDistrictAnalysisLangGraph();
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Console Command panel */}
      <div className="rounded-xl border border-border-col bg-surface p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-card" style={{ animationDelay: '0ms' }}>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Cpu size={16} className="text-emerald" />
            <span>{getTranslation('adkMultiAgentOrchestrationPanel', language)}</span>
          </h1>
          <p className="text-[10px] text-text-muted mt-1 font-mono">
            {getTranslation('simulatesInterAgentCoordination', language)}
          </p>

          {/* Orchestration Framework Toggle */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">Framework:</span>
            <div className="flex items-center gap-1 rounded-lg border border-border-col bg-navy/50 p-1">
              <button
                onClick={() => setOrchestrationMode('MASTRA')}
                className={`rounded px-2.5 py-1 text-[10px] font-semibold transition-all flex items-center gap-1 ${
                  orchestrationMode === 'MASTRA'
                    ? 'bg-emerald text-navy'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Zap size={10} />
                <span>Mastra</span>
              </button>
              <button
                onClick={() => setOrchestrationMode('LANGGRAPH')}
                className={`rounded px-2.5 py-1 text-[10px] font-semibold transition-all ${
                  orchestrationMode === 'LANGGRAPH'
                    ? 'bg-emerald text-navy'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                LangGraph+Lyzr
              </button>
            </div>
          </div>
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
          <span>{getTranslation('runDistrictAnalysis', language)}</span>
        </button>
      </div>

      {/* Supervisor Card */}
      <div className="rounded-xl border border-emerald/30 bg-emerald/5 p-5 animate-card" style={{ animationDelay: '50ms' }}>
        <div className="flex items-start justify-between border-b border-emerald/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald/20 text-emerald">
              <Cpu size={12} />
            </span>
            <span className="text-xs font-bold text-emerald uppercase tracking-wider">{getTranslation('supervisorAgent', language)}</span>
          </div>
          {getStatusBadge(supervisorStatus)}
        </div>
        
        <div className="mt-3.5 space-y-2">
          <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wider font-mono">
            {getTranslation('districtAssessmentSynthesisActionPlan', language)}
          </p>
          <div className="rounded-lg bg-navy/60 p-4 border border-border-col/50 font-mono text-xs text-text-secondary leading-relaxed">
            {translatedSupervisorAssessment || supervisorAssessment || (
              <span className="text-text-muted italic">{getTranslation('clickRunDistrictAnalysis', language)}</span>
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
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">{getTranslation('stockSenseAgent', language)}</h3>
                <p className="text-[9px] text-text-muted mt-0.5 font-mono">{getTranslation('supplyChainAnalysis', language)}</p>
              </div>
              {getStatusBadge(stockStatus)}
            </div>

            <p className="mt-4 font-mono text-[11px] leading-relaxed text-text-secondary">
              {translatedStockReport || stockReport || <span className="text-text-muted italic">{getTranslation('awaitingQueryTrigger', language)}</span>}
            </p>
          </div>
        </div>

        {/* AttendAI Agent */}
        <div className="rounded-xl border-l-4 border-l-indigo-400 border-y border-r border-border-col bg-surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between border-b border-border-col/40 pb-3">
              <div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">{getTranslation('attendAiAgent', language)}</h3>
                <p className="text-[9px] text-text-muted mt-0.5 font-mono">{getTranslation('humanResourcesLogs', language)}</p>
              </div>
              {getStatusBadge(attendStatus)}
            </div>

            <p className="mt-4 font-mono text-[11px] leading-relaxed text-text-secondary">
              {translatedAttendReport || attendReport || <span className="text-text-muted italic">{getTranslation('awaitingQueryTrigger', language)}</span>}
            </p>
          </div>
        </div>

        {/* ASHATrack Agent */}
        <div className="rounded-xl border-l-4 border-l-warning border-y border-r border-border-col bg-surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between border-b border-border-col/40 pb-3">
              <div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">{getTranslation('ashaTrackAgent', language)}</h3>
                <p className="text-[9px] text-text-muted mt-0.5 font-mono">{getTranslation('ashaWorkersVerification', language)}</p>
              </div>
              {getStatusBadge(ashaStatus)}
            </div>

            <p className="mt-4 font-mono text-[11px] leading-relaxed text-text-secondary">
              {translatedAshaReport || ashaReport || <span className="text-text-muted italic">{getTranslation('awaitingQueryTrigger', language)}</span>}
            </p>
          </div>
        </div>

      </div>

      {/* Terminal Conversation Log */}
      <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4 animate-card" style={{ animationDelay: '150ms' }}>
        <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-border-col/40 pb-3">
          <Terminal size={14} className="text-emerald animate-pulse" />
          <span>{getTranslation('a2aProtocolConversationLog', language)}</span>
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
