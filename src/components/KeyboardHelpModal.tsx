import React from 'react';
import { X, Keyboard, ShieldCheck } from 'lucide-react';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1 - 5', desc: 'Navigate between Citizen Portal, Reviewer, Simulator, Datasets, and Analytics' },
    { key: 'A', desc: 'Grant Departmental Clearance & Advance DAG in Back-Office Reviewer' },
    { key: 'R', desc: 'Trigger Non-Blocking Remediation Gate in Back-Office Reviewer' },
    { key: 'T', desc: 'Cycle Theme Palettes (Light, Dark, Warm Oasis, Midnight Aurora)' },
    { key: '?', desc: 'Toggle this Keyboard Shortcuts & Guidance dialog' },
    { key: 'Esc', desc: 'Close dialogs, dropdowns, and inspection overlays' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
    >
      <div 
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-dialog-title" className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Keyboard Accessibility Shortcuts
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                WCAG AA Compliant High-Velocity Navigation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center border hover:opacity-80 cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border text-xs"
              style={{
                backgroundColor: 'var(--bg-surface-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <span className="font-mono font-bold px-2 py-1 rounded bg-black/10 dark:bg-white/10" style={{ color: 'var(--text-primary)' }}>
                {sc.key}
              </span>
              <span className="text-right text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                {sc.desc}
              </span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl border text-[11px] flex items-center gap-2"
          style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Full keyboard focus rings and screen reader tags are applied across all interactive controls.</span>
        </div>
      </div>
    </div>
  );
};
