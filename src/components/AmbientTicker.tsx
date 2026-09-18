import React from 'react';
import { Shield, Activity, Lock, RefreshCw, Cpu } from 'lucide-react';

export const AmbientTicker: React.FC = () => {
  const telemetryItems = [
    { icon: <Shield className="w-3.5 h-3.5 text-emerald-500" />, text: 'ZERO SILENT REJECTION GUARANTEE: ACTIVE' },
    { icon: <Activity className="w-3.5 h-3.5 text-amber-500" />, text: 'DETERMINISTIC STATE DAG: LATENCY 118ms' },
    { icon: <Lock className="w-3.5 h-3.5 text-cyan-500" />, text: 'IMMUTABLE AUDIT LEDGER: CRYPTOGRAPHICALLY SEALED' },
    { icon: <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />, text: 'NON-BLOCKING INTERCEPTOR GATE: NOMINAL' },
    { icon: <Cpu className="w-3.5 h-3.5 text-blue-500" />, text: 'DUAL-PASS VLM OCR: 99.4% CROSS-FIELD PARITY' },
    { icon: <Shield className="w-3.5 h-3.5 text-purple-500" />, text: 'DIGILOCKER & CADASTRAL GIS WARD 18: SYNCHRONIZED' },
  ];

  return (
    <div 
      className="w-full overflow-hidden border-b py-2 text-xs font-mono select-none"
      style={{
        backgroundColor: 'var(--bg-surface-subtle)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-muted)'
      }}
      aria-label="Civic Engine Real-Time Telemetry Stream"
    >
      <div className="animate-ambient-ticker flex items-center space-x-8">
        {/* Render twice for seamless looping */}
        {[...telemetryItems, ...telemetryItems].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2 shrink-0">
            {item.icon}
            <span className="font-medium tracking-wider">{item.text}</span>
            <span className="opacity-40 ml-4">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
