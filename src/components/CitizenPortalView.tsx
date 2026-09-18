import React, { useState } from 'react';
import { 
  DAGNode, 
  ApplicationDocument, 
  AuditEvent 
} from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ShieldCheck, 
  UploadCloud, 
  DownloadCloud, 
  Sparkles, 
  Eye, 
  ArrowRight, 
  Building2, 
  Check, 
  Fingerprint, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CitizenPortalViewProps {
  dagNodes: DAGNode[];
  documents: ApplicationDocument[];
  onRemediateDefect: () => void;
  isRemediated: boolean;
  onNavigateToSimulator: () => void;
  auditTrail: AuditEvent[];
}

export const CitizenPortalView: React.FC<CitizenPortalViewProps> = ({
  dagNodes,
  documents,
  onRemediateDefect,
  isRemediated,
  onNavigateToSimulator,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<ApplicationDocument | null>(null);
  const [isProcessingDigilocker, setIsProcessingDigilocker] = useState(false);
  const [manualFile, setManualFile] = useState<File | null>(null);
  const [showArchDetails, setShowArchDetails] = useState(false);

  const handleDigilockerFetch = () => {
    setIsProcessingDigilocker(true);
    setTimeout(() => {
      setIsProcessingDigilocker(false);
      onRemediateDefect();
    }, 1200);
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setManualFile(e.target.files[0]);
      setIsProcessingDigilocker(true);
      setTimeout(() => {
        setIsProcessingDigilocker(false);
        onRemediateDefect();
      }, 1400);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Panoramic Biophilic Operations Header */}
      <section 
        id="citizen-hero-header"
        className="rounded-3xl p-6 sm:p-8 border shadow-xs relative overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Ambient subtle background gradient orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none ambient-orb-1" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none ambient-orb-2" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                Application #CTL-2025-8849
              </span>
              <span 
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  isRemediated 
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' 
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                }`}
              >
                {isRemediated ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>REMEDIATED & RESUMED (In Departmental Review)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                    <span>ACTION REQUIRED (Non-Blocking Paused)</span>
                  </>
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Commercial Food & Beverage Trade License
            </h1>
            
            <p className="text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              Applicant: <strong className="font-semibold text-[var(--text-primary)]">Elena M. Lindqvist</strong> • The Artisan Roastery & Botanical Lounge • Ward 18, Waterfront Urban Zone (NIC 56102)
            </p>
          </div>

          {/* Golden Ratio Key Metrics Triad */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 p-3 rounded-2xl border"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="text-center px-2">
              <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Target SLA</div>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {isRemediated ? '28h 15m' : '36h 40m'}
              </div>
              <div className="text-[10px] text-emerald-500 font-medium">{isRemediated ? 'Active' : 'Timer Frozen'}</div>
            </div>
            <div className="text-center px-2 border-x" style={{ borderColor: 'var(--border-color)' }}>
              <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Cross-Parity</div>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {isRemediated ? '99.8%' : '99.2%'}
              </div>
              <div className="text-[10px] text-emerald-500 font-medium">Dual-Pass OCR</div>
            </div>
            <div className="text-center px-2">
              <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Current Node</div>
              <div className="text-base sm:text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                {isRemediated ? 'Stage 4 / 6' : 'Stage 3 / 6'}
              </div>
              <div className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {isRemediated ? 'Fire Safety' : 'Revenue'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Remediation Gate (The Zero-Silent-Rejection Shield) */}
      {!isRemediated ? (
        <section 
          id="remediation-deck"
          className="rounded-3xl p-6 sm:p-8 border-2 shadow-sm transition-all relative"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--accent-amber)',
          }}
        >
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Silent-Rejection Protection Active</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Missing Annexure: Property Tax NOC (2025-2026)
              </h2>

              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <strong>No Penalty Notice:</strong> In conventional legacy portals, this discrepancy would cause an immediate silent drop or cancellation after 21 days. Under CivicFlow, your dossier has been safely suspended. Stages 1 and 2 (Identity & Lease) remain 100% verified and permanently preserved.
              </p>

              <div className="p-3.5 rounded-xl border text-xs font-mono"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Statutory Resolution Window: 48 Hours Remaining</span>
                </div>
                <span>Policy Code: REV-204 (Model Building Bye-Laws §9.4 / Municipal Revenue Act)</span>
              </div>
            </div>

            {/* Quick Remediation Actions */}
            <div className="w-full md:w-80 shrink-0 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Remediation Options
              </div>

              {/* 1-Click DigiLocker Fetch */}
              <button
                id="btn-digilocker-fetch"
                onClick={handleDigilockerFetch}
                disabled={isProcessingDigilocker}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs text-white transition-all shadow-sm hover:opacity-90 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: 'var(--accent-emerald)' }}
              >
                {isProcessingDigilocker ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Syncing with City DigiLocker...
                  </span>
                ) : (
                  <>
                    <DownloadCloud className="w-4 h-4" />
                    <span>Auto-Fetch from DigiLocker (1-Click)</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 my-1">
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-color)' }}></div>
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>OR UPLOAD CERTIFICATE</span>
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-color)' }}></div>
              </div>

              {/* Drag and Drop Manual Upload */}
              <label 
                htmlFor="upload-tax-cert"
                className="w-full flex flex-col items-center justify-center p-3 rounded-xl border border-dashed transition-colors cursor-pointer hover:border-emerald-500"
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <UploadCloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1" />
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {manualFile ? manualFile.name : 'Upload Tax NOC PDF'}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Max 15MB • Instant Dual-Pass OCR
                </span>
                <input 
                  type="file" 
                  id="upload-tax-cert" 
                  className="hidden" 
                  accept=".pdf,.png,.jpg"
                  onChange={handleManualUpload}
                />
              </label>
            </div>
          </div>
        </section>
      ) : (
        <section 
          id="remediation-success-banner"
          className="rounded-3xl p-6 sm:p-8 border shadow-xs transition-all relative"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--accent-emerald)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Defect Successfully Remediated & Queue Restored!
                </h2>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Property Tax Receipt (TAX-2025-W18-9931) validated via Ward 18 Ledger. Revenue Clearance Node marked 100% complete. Prior state was preserved without starting over.
                </p>
              </div>
            </div>

            <button
              id="btn-inspect-simulator"
              onClick={onNavigateToSimulator}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border shrink-0 cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: 'var(--bg-surface-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <span>Inspect in Workflow Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 3. Dynamic Multi-Agency Clearance Path (Strictly Vertical Stack - No Horizontal Sliders) */}
      <section id="clearance-path-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Deterministic Clearance Sequence (DAG Flow)
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Linear progression with persistent checkpoints and non-destructive rollbacks
            </p>
          </div>
          <div className="text-xs font-mono font-medium" style={{ color: 'var(--accent-emerald)' }}>
            Status: {isRemediated ? '4 / 6 Cleared' : '3 / 6 Paused at Node 3'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dagNodes.map((node) => {
            const isDone = node.status === 'completed';
            const isAction = node.status === 'action_required';
            const isPending = node.status === 'pending';

            return (
              <div
                key={node.id}
                id={`dag-card-${node.key}`}
                className={`p-5 rounded-2xl border transition-all relative ${
                  isAction ? 'ring-2 ring-amber-500/60 shadow-md' : 'shadow-xs'
                }`}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: isAction ? 'var(--accent-amber)' : isDone ? 'var(--accent-emerald)' : 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: 'var(--bg-surface-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Node 0{node.id}
                  </span>
                  
                  {isDone && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Cleared
                    </span>
                  )}
                  {isAction && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" /> Action Required
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                      Queued
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                  {node.name}
                </h3>
                
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {node.shortDesc}
                </p>

                <div className="flex items-center justify-between pt-3 border-t text-[11px]"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>{node.department}</span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                    SLA: {node.slaTimeMinutes}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Certified Document Dossier Vault */}
      <section id="document-vault-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Certified Submission Dossier & OCR Verification
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Cryptographically stamped documents with dual-pass PyDantic validation logs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              id={`doc-card-${doc.id}`}
              className="p-5 rounded-2xl border transition-all shadow-xs flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--accent-emerald)' }}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    doc.verifiedStatus === 'verified' 
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                  }`}>
                    {doc.verifiedStatus === 'verified' ? 'Verified' : 'Action Required'}
                  </span>
                </div>

                {/* Extracted Key Attributes preview */}
                <div className="p-3.5 rounded-xl text-xs space-y-2 font-mono mb-4 border"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {Object.entries(doc.extractedFields).slice(0, 2).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between gap-2">
                      <span style={{ color: 'var(--text-muted)' }} className="truncate font-medium">{key}:</span>
                      <span style={{ color: 'var(--text-primary)' }} className="font-semibold truncate text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OCR: {doc.ocrConfidence > 0 ? `${doc.ocrConfidence}%` : 'Pending'}</span>
                </div>

                <button
                  id={`btn-view-${doc.id}`}
                  onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{selectedDoc?.id === doc.id ? 'Close' : 'Inspect Extracted Tokens'}</span>
                </button>
              </div>

              {/* Expanded Document Details Modal/Panel */}
              {selectedDoc?.id === doc.id && (
                <div className="mt-4 pt-4 border-t space-y-3 text-xs" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Full Entity Extraction Log
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    {Object.entries(doc.extractedFields).map(([k, v]) => (
                      <div key={k} className="p-2 rounded border flex flex-col sm:flex-row sm:justify-between gap-1"
                        style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)' }}
                      >
                        <span className="font-medium" style={{ color: 'var(--text-muted)' }}>{k}</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {doc.boundingTargets && (
                    <div className="space-y-2">
                      <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        Spatial Bounding Validations (Architectural & Fire Standards)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {doc.boundingTargets.map((box) => (
                          <div key={box.id} className="p-2 rounded border bg-emerald-500/10 border-emerald-500/30 text-[11px]">
                            <div className="font-bold text-emerald-700 dark:text-emerald-300">{box.label}</div>
                            <div className="opacity-80">Req: {box.required}</div>
                            <div className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">✓ Spatial Match Verified</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] font-mono opacity-60">
                    Cryptographic SHA-256 Digest: {doc.hash}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Assigned Municipal Case Officers & Concierge */}
      <section 
        id="case-officers-section"
        className="rounded-3xl p-6 sm:p-8 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Assigned Municipal Review Desk & Officers
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Direct accountability under the Citizen Services Guarantee Act
            </p>
          </div>
          <span className="text-xs font-mono font-medium px-3 py-1 rounded-full border"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)'
            }}
          >
            Ward 18 Civil Center
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border flex items-center gap-4"
            style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)' }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              AK
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Ananya Kapoor</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Senior Revenue & Cadastre Officer</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                • {isRemediated ? 'Cleared NOC certificate' : 'Awaiting Tax NOC remediation'}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border flex items-center gap-4"
            style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-color)' }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm bg-amber-500/20 text-amber-700 dark:text-amber-300">
              RM
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Rajesh Menon</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Chief Fire Safety Inspector (Ward 18)</div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                • Blueprint egress width 2.10m accepted
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
