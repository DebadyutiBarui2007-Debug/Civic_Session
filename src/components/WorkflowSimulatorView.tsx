import React, { useState, useEffect } from 'react';
import { 
  DefectScenario, 
  DAGNode, 
  StressTestMetrics 
} from '../types';
import { DEFECT_SCENARIOS } from '../data/datasets';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  AlertOctagon, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Zap, 
  ShieldAlert,
  Flame,
  Scale,
  RefreshCw
} from 'lucide-react';

interface WorkflowSimulatorViewProps {
  onRemediateActiveDefect: () => void;
  isRemediated: boolean;
}

export const WorkflowSimulatorView: React.FC<WorkflowSimulatorViewProps> = ({
  onRemediateActiveDefect,
  isRemediated,
}) => {
  const [activeEngineMode, setActiveEngineMode] = useState<'civicflow' | 'legacy'>('civicflow');
  const [selectedDefect, setSelectedDefect] = useState<DefectScenario>(DEFECT_SCENARIOS[0]);
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'intercepted' | 'rejected_legacy' | 'resolved'>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // 2-Minute Judge Stress Test Simulator
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [stressSecondsLeft, setStressSecondsLeft] = useState(120);
  const [stressMetrics, setStressMetrics] = useState<StressTestMetrics>({
    totalProcessed: 20,
    silentDropoutsCivicFlow: 0,
    silentDropoutsLegacy: 7,
    retainedPercent: 100,
    avgResolutionTimeSeconds: 34,
    interceptionsTriggered: 6,
    resumedWithoutResetCount: 6,
  });

  const steps = [
    { key: 'SUBMITTED', name: 'Citizen Intake', desc: 'SHA-256 sealed packet received' },
    { key: 'AI_OCR_INGEST', name: 'Dual-Pass OCR', desc: 'PyDantic schema extraction & spatial bbox' },
    { key: 'POLICY_RULES', name: 'Statutory Interceptor', desc: 'Cross-checks against MBBL 2025 & NFPA 96' },
    { key: 'DEPT_REVIEW', name: 'Department Review', desc: 'Revenue, Fire Safety, and Health clearance' },
    { key: 'APPROVED', name: 'License Minted', desc: 'Tamper-evident DigiLocker certificate issued' },
  ];

  const runSimulation = () => {
    setSimulationState('running');
    setCurrentStepIndex(0);

    setTimeout(() => {
      setCurrentStepIndex(1);
    }, 600);

    setTimeout(() => {
      setCurrentStepIndex(2);
      if (activeEngineMode === 'civicflow') {
        setSimulationState('intercepted');
      } else {
        setSimulationState('rejected_legacy');
      }
    }, 1200);
  };

  const handleResolveInterceptor = () => {
    setSimulationState('running');
    setTimeout(() => {
      setCurrentStepIndex(3);
    }, 600);
    setTimeout(() => {
      setCurrentStepIndex(4);
      setSimulationState('resolved');
      onRemediateActiveDefect();
    }, 1200);
  };

  const resetSimulator = () => {
    setSimulationState('idle');
    setCurrentStepIndex(0);
  };

  // Run 2-Minute Judge Stress Test flow
  const startJudgeStressTest = () => {
    setIsStressTesting(true);
    setStressSecondsLeft(120);

    // Fast simulated progress to show live metric accumulation
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setStressMetrics((prev) => ({
        ...prev,
        totalProcessed: prev.totalProcessed + 3,
        silentDropoutsLegacy: prev.silentDropoutsLegacy + 1,
        interceptionsTriggered: prev.interceptionsTriggered + 2,
        resumedWithoutResetCount: prev.resumedWithoutResetCount + 2,
      }));

      setStressSecondsLeft((prev) => {
        if (prev <= 10) {
          clearInterval(interval);
          setIsStressTesting(false);
          return 0;
        }
        return prev - 15;
      });
    }, 800);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Mode Switcher */}
      <section 
        className="rounded-3xl p-6 sm:p-8 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                Architectural Stress Test Engine
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                Spec ARCH-004 Event-Driven DAG
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Deterministic Workflow & Defect Simulator
            </h1>
            <p className="text-xs sm:text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              Evaluate live state-machine transitions when high-impact defects are injected into the ingestion pipeline. Contrast legacy silent dropouts with CivicFlow non-blocking interceptors.
            </p>
          </div>

          {/* Engine Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center p-1.5 rounded-2xl border"
              style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)' }}
            >
              <button
                id="btn-mode-civicflow"
                onClick={() => {
                  setActiveEngineMode('civicflow');
                  resetSimulator();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeEngineMode === 'civicflow' ? 'shadow-xs text-white' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeEngineMode === 'civicflow' ? 'var(--accent-emerald)' : 'transparent',
                  color: activeEngineMode === 'civicflow' ? '#ffffff' : 'var(--text-primary)',
                }}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>CivicFlow Interceptor</span>
              </button>

              <button
                id="btn-mode-legacy"
                onClick={() => {
                  setActiveEngineMode('legacy');
                  resetSimulator();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeEngineMode === 'legacy' ? 'shadow-xs text-white' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeEngineMode === 'legacy' ? 'var(--accent-error)' : 'transparent',
                  color: activeEngineMode === 'legacy' ? '#ffffff' : 'var(--text-primary)',
                }}
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Legacy Portal (Silent Rejection)</span>
              </button>
            </div>

            {/* 2-Minute Judge Stress Test Button */}
            <button
              id="btn-judge-stress-test"
              onClick={startJudgeStressTest}
              disabled={isStressTesting}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer shadow-xs hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--bg-surface-subtle)',
                borderColor: 'var(--accent-amber)',
                color: 'var(--accent-amber)',
              }}
              title="Launch the 2-Minute Judge Live Stress Test"
            >
              <Zap className="w-4 h-4" />
              <span>{isStressTesting ? `Running Stress Test (${stressSecondsLeft}s)...` : 'Run 2-Min Judge Stress Test'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Adversarial Defect Selector & Interactive DAG Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Defect Injection Arsenal */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl border shadow-xs space-y-4"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Adversarial Defect Scenario</span>
            </div>

            <div className="space-y-2">
              {DEFECT_SCENARIOS.map((scenario) => {
                const isSelected = selectedDefect.id === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    id={`defect-select-${scenario.id}`}
                    onClick={() => {
                      setSelectedDefect(scenario);
                      resetSimulator();
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected ? 'ring-2 ring-emerald-500/50 shadow-xs' : 'hover:border-emerald-500/40'
                    }`}
                    style={{
                      backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-subtle)',
                      borderColor: isSelected ? 'var(--accent-emerald)' : 'var(--border-color)',
                    }}
                  >
                    <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                      {scenario.name}
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Target: {scenario.affectedDepartment} Inspectorate
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              id="btn-inject-defect"
              onClick={runSimulation}
              disabled={simulationState === 'running'}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold text-white transition-all shadow-xs cursor-pointer hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-emerald)' }}
            >
              <Play className="w-4 h-4" />
              <span>Inject Scenario & Execute Flow</span>
            </button>
          </div>
        </div>

        {/* Right: State Machine Simulation Canvas & Pipeline Nodes */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl border shadow-xs space-y-6"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  State Machine Execution Track
                </h2>
              </div>
              <button
                onClick={resetSimulator}
                className="text-xs font-medium flex items-center gap-1 opacity-70 hover:opacity-100 cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset State</span>
              </button>
            </div>

            {/* Linear Step Track (Strictly Vertical Stack for responsive, no horizontal sliders) */}
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isActive = currentStepIndex === idx;
                const isPassed = currentStepIndex > idx;
                const isInterceptedHere = idx === 2 && simulationState === 'intercepted';
                const isRejectedHere = idx === 2 && simulationState === 'rejected_legacy';

                return (
                  <div
                    key={step.key}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isInterceptedHere
                        ? 'ring-2 ring-amber-500 bg-amber-500/10'
                        : isRejectedHere
                        ? 'ring-2 ring-red-500 bg-red-500/10'
                        : isPassed
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : isActive
                        ? 'border-emerald-500'
                        : 'opacity-60'
                    }`}
                    style={{
                      backgroundColor: 'var(--bg-surface-subtle)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isPassed
                          ? 'bg-emerald-500 text-white'
                          : isInterceptedHere
                          ? 'bg-amber-500 text-white animate-pulse'
                          : isRejectedHere
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm" style={{ color: 'var(--text-primary)' }}>
                          {step.name}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {step.desc}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right font-mono text-xs">
                      {isPassed && <span className="text-emerald-600 dark:text-emerald-400 font-bold">Passed (200 OK)</span>}
                      {isInterceptedHere && (
                        <span className="text-amber-600 dark:text-amber-400 font-bold">
                          INTERCEPTED (Paused)
                        </span>
                      )}
                      {isRejectedHere && (
                        <span className="text-red-600 dark:text-red-400 font-bold">
                          SILENT REJECTION (400 Hard Error)
                        </span>
                      )}
                      {!isPassed && !isInterceptedHere && !isRejectedHere && (
                        <span className="opacity-40">{isActive ? 'Processing...' : 'Queued'}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Outcome Display: CivicFlow vs Legacy */}
            {simulationState === 'intercepted' && (
              <div className="p-5 rounded-2xl border-2 border-amber-500 bg-amber-500/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>CivicFlow Non-Blocking Interceptor Triggered!</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <strong>Defect Identified:</strong> {selectedDefect.name}. Under CivicFlow, the prior nodes remain 100% verified. A 48-hour grace window opened, and DigiLocker auto-fetched the missing certification.
                </p>
                <div className="pt-2">
                  <button
                    id="btn-resolve-interceptor"
                    onClick={handleResolveInterceptor}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: 'var(--accent-emerald)' }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Remediation & Resume Workflow Instantly</span>
                  </button>
                </div>
              </div>
            )}

            {simulationState === 'rejected_legacy' && (
              <div className="p-5 rounded-2xl border-2 border-red-500 bg-red-500/10 space-y-2">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-xs sm:text-sm">
                  <AlertOctagon className="w-5 h-5" />
                  <span>Legacy Portal Failure: Silent Cancellation</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <strong>Catastrophic Drop:</strong> The legacy workflow silently terminated the record. No notification was sent to citizen Elena M. Lindqvist. After 21 days, the application fee was forfeited, and she was forced to re-submit all documents from Stage 1.
                </p>
              </div>
            )}

            {simulationState === 'resolved' && (
              <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Clearance Sequence Restored and Digital License Issued!</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Application #CTL-2025-8849 reached 100% completion with zero silent dropouts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Judge Stress Test Telemetry Dashboard */}
      <section 
        id="judge-stress-metrics"
        className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              Live Comparative Benchmark
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--text-primary)' }}>
              2-Minute Stress Test Telemetry (Batch N={stressMetrics.totalProcessed})
            </h2>
          </div>

          <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {stressMetrics.retainedPercent}% Retention Under Chaos Load
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border space-y-1"
            style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)' }}
          >
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>CivicFlow Silent Drops</div>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {stressMetrics.silentDropoutsCivicFlow}
            </div>
            <div className="text-[10px] text-emerald-500">0.0% Dropout Rate</div>
          </div>

          <div className="p-4 rounded-2xl border space-y-1"
            style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)' }}
          >
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Legacy Portal Drops</div>
            <div className="text-2xl font-black font-mono text-red-500">
              {stressMetrics.silentDropoutsLegacy}
            </div>
            <div className="text-[10px] text-red-500">35.0% Blind Rejection</div>
          </div>

          <div className="p-4 rounded-2xl border space-y-1"
            style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)' }}
          >
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Interceptions Triggered</div>
            <div className="text-2xl font-black font-mono" style={{ color: 'var(--accent-amber)' }}>
              {stressMetrics.interceptionsTriggered}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Non-Blocking Resiliency</div>
          </div>

          <div className="p-4 rounded-2xl border space-y-1"
            style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)' }}
          >
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Average Resolution SLA</div>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {stressMetrics.avgResolutionTimeSeconds}s
            </div>
            <div className="text-[10px] text-emerald-500">Sub-1 Hour Target</div>
          </div>
        </div>
      </section>
    </div>
  );
};
