import React, { useState, useEffect } from 'react';
import { 
  DAGNode, 
  ApplicationDocument, 
  AuditEvent 
} from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Search, 
  Check, 
  X, 
  CornerDownRight, 
  Activity, 
  Clock, 
  Scale, 
  Flame, 
  BadgeAlert,
  Send,
  Sparkles,
  Layers
} from 'lucide-react';

interface BackOfficeReviewerViewProps {
  dagNodes: DAGNode[];
  documents: ApplicationDocument[];
  auditTrail: AuditEvent[];
  isRemediated: boolean;
  onGrantClearance: (dept: string) => void;
  onRequestRemediation: (reason: string) => void;
}

export const BackOfficeReviewerView: React.FC<BackOfficeReviewerViewProps> = ({
  dagNodes,
  documents,
  auditTrail,
  isRemediated,
  onGrantClearance,
  onRequestRemediation,
}) => {
  const [activeDept, setActiveDept] = useState<'Revenue' | 'Fire Safety' | 'Health'>('Fire Safety');
  const [selectedCaseId, setSelectedCaseId] = useState('CTL-2025-8849');
  const [searchQuery, setSearchQuery] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [internalNotesList, setInternalNotesList] = useState<Array<{ officer: string; time: string; text: string }>>([
    { officer: 'Rajesh Menon (Fire Safety)', time: '09:12 CET', text: 'Egress door clear opening calculated at 2.10m. Meets MBBL Section 9.4.2 criteria.' },
    { officer: 'Ananya Kapoor (Revenue)', time: '08:44 CET', text: 'NOC verification completed via Ward 18 tokenized GIS ledger.' }
  ]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'a' || e.key === 'A') {
        onGrantClearance(activeDept);
      } else if (e.key === 'r' || e.key === 'R') {
        onRequestRemediation('Manual review query dispatched');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDept, onGrantClearance, onRequestRemediation]);

  const queueCases = [
    {
      id: 'CTL-2025-8849',
      business: 'The Artisan Roastery & Botanical Lounge',
      applicant: 'Elena M. Lindqvist',
      category: 'Food & Beverage (NIC 56102)',
      slaMinutes: 38,
      status: isRemediated ? 'Ready for Sign-Off' : 'Remediation Pending',
      priority: 'High',
      confidence: 99.4,
    },
    {
      id: 'CTL-2025-8850',
      business: 'Nordic Waterfront Marina Cafe',
      applicant: 'Mads M. Sorensen',
      category: 'Commercial Class 2',
      slaMinutes: 110,
      status: 'In Evaluation',
      priority: 'Normal',
      confidence: 98.6,
    },
    {
      id: 'CTL-2025-8851',
      business: 'Ørestad Craft Bakery & Flour Mill',
      applicant: 'Astrid V. Jensen',
      category: 'Food Processing (NIC 56210)',
      slaMinutes: 185,
      status: 'In Evaluation',
      priority: 'Normal',
      confidence: 97.9,
    },
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNote.trim()) return;
    setInternalNotesList([
      { officer: 'Rajesh Menon (Fire Safety)', time: 'Just now', text: internalNote.trim() },
      ...internalNotesList
    ]);
    setInternalNote('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Department Switcher */}
      <section 
        className="rounded-3xl p-6 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                Back-Office Reviewer Console
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                Hotkeys: [A] Approve • [R] Request Remediation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1" style={{ color: 'var(--text-primary)' }}>
              Inter-Departmental Clearance Desk
            </h1>
          </div>

          {/* Department Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl border"
            style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)' }}
          >
            {(['Revenue', 'Fire Safety', 'Health'] as const).map((dept) => (
              <button
                key={dept}
                id={`dept-tab-${dept.toLowerCase().replace(' ', '-')}`}
                onClick={() => setActiveDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeDept === dept ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeDept === dept ? 'var(--accent-emerald)' : 'transparent',
                  color: activeDept === dept ? '#ffffff' : 'var(--text-primary)',
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Golden Section Split: Queue (38.2%) vs Case Inspector (61.8%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dossier Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl border flex items-center justify-between"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Assigned Queue ({queueCases.length})</span>
            </div>

            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search file or token..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-xs rounded-lg border focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {queueCases.map((c) => {
              const isSelected = selectedCaseId === c.id;
              return (
                <div
                  key={c.id}
                  id={`queue-item-${c.id}`}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-emerald-500/50 shadow-md' : 'shadow-xs hover:border-emerald-500/40'
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: isSelected ? 'var(--accent-emerald)' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      {c.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      c.status.includes('Ready') 
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {c.business}
                  </h3>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Applicant: {c.applicant}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t text-[11px]"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>{c.category}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      OCR {c.confidence}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Case Inspector (61.8%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Review Dossier Card */}
          <div 
            id="inspector-dossier"
            className="p-6 rounded-3xl border shadow-xs space-y-5"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div>
                <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
                  Active Inspector Focus: {activeDept} Desk
                </span>
                <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  The Artisan Roastery & Botanical Lounge (#CTL-2025-8849)
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-officer-approve"
                  onClick={() => onGrantClearance(activeDept)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: 'var(--accent-emerald)' }}
                  title="Grant clearance for this department (Hotkey: A)"
                >
                  <Check className="w-4 h-4" />
                  <span>Grant Clearance [A]</span>
                </button>

                <button
                  id="btn-officer-remediate"
                  onClick={() => onRequestRemediation('Missing ventilation specification')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent-amber)',
                  }}
                  title="Trigger non-blocking remediation gate (Hotkey: R)"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Remediate [R]</span>
                </button>
              </div>
            </div>

            {/* PyDantic Deterministic Cross-Validation Card */}
            <div className="p-4 rounded-2xl border space-y-3"
              style={{
                backgroundColor: 'var(--bg-surface-subtle)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>PyDantic v2 Deterministic Cross-Validation Engine</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Zero Schema Drift (PASS)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Applicant Match</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">99.8% (Verified)</div>
                </div>
                <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Cadastre Parcel</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">Lot 14-B (100%)</div>
                </div>
                <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Tax Period</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">2025-26 (Nil Due)</div>
                </div>
                <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Egress Clear Width</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">2.10m (&ge; 1.80m)</div>
                </div>
              </div>
            </div>

            {/* Spatial Bounding Box & Architectural Schematic Inspection */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Departmental Evidence Blueprint (Egress_Fire_Schematic_RevC.pdf)
              </h3>
              
              <div className="p-4 rounded-2xl border relative overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
                  <span>Spatial Bounding Box Analysis</span>
                  <span>Scale: 1:100 Metric</span>
                </div>

                {/* Interactive Simulated Blueprint Canvas */}
                <div className="h-44 w-full rounded-xl border border-dashed relative flex items-center justify-center p-4"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  {/* Visual bounding boxes */}
                  <div className="absolute top-4 left-6 border-2 border-emerald-500 bg-emerald-500/10 rounded px-2 py-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Egress Exit A [2.10m] ✓
                  </div>
                  <div className="absolute bottom-4 right-8 border-2 border-emerald-500 bg-emerald-500/10 rounded px-2 py-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    UL-1046 Hood Duct ✓
                  </div>
                  <div className="absolute top-6 right-24 border-2 border-blue-500 bg-blue-500/10 rounded px-2 py-1 text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                    Hydrant H-02 (12m Radius) ✓
                  </div>

                  <span className="text-xs font-medium text-center max-w-xs opacity-60">
                    Vectorized Architectural Layout with Automated Code Compliance Overlay
                  </span>
                </div>
              </div>
            </div>

            {/* Department Internal Case Notes */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Case Audit Notes & Department Queries
              </h3>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add an internal clearance annotation or instruction..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: 'var(--accent-emerald)' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {internalNotesList.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-xl border text-xs"
                    style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{note.officer}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{note.time}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Immutable Audit Trail (PostgreSQL WAL schema) */}
          <div 
            id="audit-trail-card"
            className="p-6 rounded-3xl border shadow-xs space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Immutable Audit Ledger (PostgreSQL WAL Stream)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                SHA-256 Sealed
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {auditTrail.map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{ev.stage}</span>
                      <span className="text-[11px] opacity-60">Block #{ev.blockNumber}</span>
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--text-primary)' }}>{ev.action}</div>
                    <div className="text-[10px] opacity-70 truncate max-w-md">{ev.details}</div>
                  </div>
                  <div className="text-right shrink-0 text-[10px] opacity-60">
                    <div>{ev.timestamp}</div>
                    <div className="truncate w-24 sm:w-32">{ev.hash}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
