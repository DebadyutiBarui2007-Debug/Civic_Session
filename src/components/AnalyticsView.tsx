import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Users, 
  AlertOctagon, 
  CheckCircle2, 
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const kpiData = [
    { label: 'Total Filings Processed', value: '14,280', delta: '+18.4% YoY', positive: true, icon: <Layers className="w-5 h-5 text-emerald-500" /> },
    { label: 'Zero Silent Dropouts', value: '0.00%', delta: 'Legacy was 35.2%', positive: true, icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> },
    { label: 'Median Resolution Time', value: '34 min', delta: 'vs 21 Days Legacy', positive: true, icon: <Clock className="w-5 h-5 text-emerald-500" /> },
    { label: 'Citizen Retention Rate', value: '99.8%', delta: '+64.6% Gain', positive: true, icon: <Users className="w-5 h-5 text-emerald-500" /> },
  ];

  const wardPerformance = [
    { ward: 'Ward 18 (Waterfront)', volume: 3420, passRate: '99.9%', avgTime: '28m' },
    { ward: 'Ward 04 (Indre By)', volume: 4190, passRate: '99.7%', avgTime: '32m' },
    { ward: 'Ward 12 (Ørestad Tech Hub)', volume: 2980, passRate: '100%', avgTime: '24m' },
    { ward: 'Ward 07 (Vesterbro Industrial)', volume: 3690, passRate: '99.5%', avgTime: '39m' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section 
        className="rounded-3xl p-6 sm:p-8 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              Macro Municipal Telemetry
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              N=14,280 Audited Applications
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Systemic Impact & Retention Analytics
          </h1>
          <p className="text-xs sm:text-sm max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Empirical evidence measuring the transformation from opaque, silent-rejection legacy portals to CivicFlow's deterministic non-blocking state architecture.
          </p>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl border shadow-xs flex flex-col justify-between space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{kpi.label}</span>
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--bg-surface-subtle)' }}>
                {kpi.icon}
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold font-mono tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {kpi.value}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{kpi.delta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Funnel Comparison: CivicFlow vs Legacy Portal */}
      <section 
        className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Filing Journey Funnel Retention
          </h2>
          <span className="text-xs font-mono opacity-60">CivicFlow vs Legacy</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>1. Initial Intake & Packet Submission</span>
              <span className="font-mono">100% (14,280) vs 100% (14,280)</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
              <div className="h-full bg-emerald-500 rounded-full w-full"></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>2. Dual-Pass OCR & PyDantic Validation</span>
              <span className="font-mono">CivicFlow 99.4% • Legacy 68.2%</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex">
              <div className="h-full bg-emerald-500 rounded-full w-[99.4%]"></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>3. Interceptor Gate (Defect Remediation Triggered)</span>
              <span className="font-mono">CivicFlow 100% Retained • Legacy 35.2% Dropped Out</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
              <div className="h-full bg-emerald-500 rounded-full w-[99.8%]"></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>4. Final Licensure Minted</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">CivicFlow 99.8% Successful Output</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
              <div className="h-full bg-emerald-500 rounded-full w-[99.8%]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Ward Table */}
      <section 
        className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Ward-by-Ward Cadastral Processing
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                <th className="pb-3 font-semibold">Ward & Municipal Zone</th>
                <th className="pb-3 font-semibold">Applications Filed</th>
                <th className="pb-3 font-semibold">Retention Pass Rate</th>
                <th className="pb-3 font-semibold">Avg Turnaround SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {wardPerformance.map((row, idx) => (
                <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{row.ward}</td>
                  <td className="py-3 font-mono" style={{ color: 'var(--text-secondary)' }}>{row.volume.toLocaleString()}</td>
                  <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{row.passRate}</td>
                  <td className="py-3 font-mono" style={{ color: 'var(--text-secondary)' }}>{row.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
