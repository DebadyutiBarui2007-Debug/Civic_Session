import React, { useState, useEffect } from 'react';
import { ThemeMode, NavigationTab, DAGNode, ApplicationDocument, AuditEvent } from './types';
import { 
  INITIAL_DAG_NODES, 
  INITIAL_APPLICATION_DOCUMENTS, 
  INITIAL_AUDIT_TRAIL 
} from './data/datasets';
import { Navbar } from './components/Navbar';
import { AmbientTicker } from './components/AmbientTicker';
import { CitizenPortalView } from './components/CitizenPortalView';
import { BackOfficeReviewerView } from './components/BackOfficeReviewerView';
import { WorkflowSimulatorView } from './components/WorkflowSimulatorView';
import { RegulatoryDatasetView } from './components/RegulatoryDatasetView';
import { AnalyticsView } from './components/AnalyticsView';
import { KeyboardHelpModal } from './components/KeyboardHelpModal';
import { SynapseBackground } from './components/SynapseBackground';
import { ShieldCheck, Heart, Sparkles, Lock, ArrowUp } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('citizen-portal');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('civicflow_theme') as ThemeMode;
    return saved || 'light';
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Application State
  const [dagNodes, setDagNodes] = useState<DAGNode[]>(INITIAL_DAG_NODES);
  const [documents, setDocuments] = useState<ApplicationDocument[]>(INITIAL_APPLICATION_DOCUMENTS);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(INITIAL_AUDIT_TRAIL);
  const [isRemediated, setIsRemediated] = useState(false);

  // Theme Sync effect
  useEffect(() => {
    localStorage.setItem('civicflow_theme', theme);
    const root = document.documentElement;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Global Keyboard Shortcuts (WCAG AA Compliant)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '1') setActiveTab('citizen-portal');
      else if (e.key === '2') setActiveTab('back-office-reviewer');
      else if (e.key === '3') setActiveTab('workflow-simulator');
      else if (e.key === '4') setActiveTab('regulatory-dataset');
      else if (e.key === '5') setActiveTab('analytics');
      else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        setIsHelpOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsHelpOpen(false);
      } else if (e.key === 't' || e.key === 'T') {
        // Cycle themes
        const themes: ThemeMode[] = ['light', 'dark', 'warm-oasis', 'midnight-aurora', 'system'];
        setTheme((current) => {
          const nextIdx = (themes.indexOf(current) + 1) % themes.length;
          return themes[nextIdx];
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle remediation of missing Tax NOC
  const handleRemediateDefect = () => {
    setIsRemediated(true);

    // Update DAG Nodes
    setDagNodes((prev) =>
      prev.map((node) => {
        if (node.id === 3) {
          return {
            ...node,
            status: 'completed',
            shortDesc: 'Property Tax NOC verified via Ward 18 Cadastral Ledger (Nil due).',
            badge: 'CLEARED 200 OK',
          };
        }
        if (node.id === 4) {
          return {
            ...node,
            status: 'action_required',
            badge: 'ACTIVE_INSPECTOR_DESK',
          };
        }
        return node;
      })
    );

    // Update Documents
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === 'doc-tax-04') {
          return {
            ...doc,
            name: 'Property_Tax_NOC_2025_26_Validated.pdf',
            size: '2.4 MB',
            hash: '7f8a9e14bc219082a99182ec3',
            ocrConfidence: 99.8,
            verifiedStatus: 'verified',
            extractedFields: {
              'Certificate Number': 'TAX-2025-W18-9931',
              'Assessment Year': '2025-26 (Nil Dues Outstanding)',
              'Parcel Address': 'Lot 14-B, Ørestad Boulevard / Ward 18 Waterfront',
              'Issuing Authority': 'Department of Municipal Revenue (Ward 18 Desk)'
            },
          };
        }
        return doc;
      })
    );

    // Append Audit Event
    const newAuditEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' CET',
      stage: 'Remediation Interceptor',
      action: 'DigiLocker Tax NOC Auto-Linked (TAX-2025-W18-9931)',
      actor: 'Elena M. Lindqvist (Citizen Remediation Portal)',
      hash: '7f8a9e14bc219082a99182ec3',
      blockNumber: 482904,
      type: 'remediation',
      details: 'Node 3 successfully remediated without restarting pipeline. Zero silent rejections guaranteed.',
    };

    setAuditTrail((prev) => [newAuditEvent, ...prev]);
  };

  // Back-office departmental clearance action
  const handleGrantClearance = (dept: string) => {
    const newAuditEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' CET',
      stage: `${dept} Inspectorate`,
      action: `Official Department Clearance Granted & Sealed`,
      actor: `Officer Sign-Off (${dept})`,
      hash: Math.random().toString(36).substring(2, 15),
      blockNumber: 482905,
      type: 'success',
      details: `All statutory requirements validated under MBBL 2025. DAG execution advanced.`,
    };

    setAuditTrail((prev) => [newAuditEvent, ...prev]);

    setDagNodes((prev) =>
      prev.map((n) => {
        if (n.department.includes(dept) || (dept === 'Fire Safety' && n.id === 4)) {
          return { ...n, status: 'completed', badge: 'DEPT_CLEARED' };
        }
        if (n.id === 5) {
          return { ...n, status: 'action_required', badge: 'ACTIVE_HEALTH_DESK' };
        }
        return n;
      })
    );
  };

  const handleRequestRemediation = (reason: string) => {
    const newAuditEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' CET',
      stage: 'Inspectorate Query',
      action: `Targeted Non-Blocking Remediation Requested: ${reason}`,
      actor: 'Reviewing Officer Desk',
      hash: Math.random().toString(36).substring(2, 15),
      blockNumber: 482906,
      type: 'warning',
      details: `Citizen notified via SMS/DigiLocker. 48-hour grace window opened. No workflow reset.`,
    };
    setAuditTrail((prev) => [newAuditEvent, ...prev]);
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors relative"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 0. Synapse Interactive Constellation & Pulse Background */}
      <SynapseBackground theme={theme} />

      {/* 1. Header Navigation */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          setTheme={setTheme}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* 2. Performance-Optimized Ambient Telemetry Ticker */}
        <AmbientTicker />

        {/* 3. Main Content Stage (Strictly Vertical Scrolling, Clean Responsive Max-W-7xl Layout) */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {activeTab === 'citizen-portal' && (
            <CitizenPortalView
              dagNodes={dagNodes}
              documents={documents}
              onRemediateDefect={handleRemediateDefect}
              isRemediated={isRemediated}
              onNavigateToSimulator={() => setActiveTab('workflow-simulator')}
              auditTrail={auditTrail}
            />
          )}

          {activeTab === 'back-office-reviewer' && (
            <BackOfficeReviewerView
              dagNodes={dagNodes}
              documents={documents}
              auditTrail={auditTrail}
              isRemediated={isRemediated}
              onGrantClearance={handleGrantClearance}
              onRequestRemediation={handleRequestRemediation}
            />
          )}

          {activeTab === 'workflow-simulator' && (
            <WorkflowSimulatorView
              onRemediateActiveDefect={handleRemediateDefect}
              isRemediated={isRemediated}
            />
          )}

          {activeTab === 'regulatory-dataset' && <RegulatoryDatasetView />}

          {activeTab === 'analytics' && <AnalyticsView />}
        </main>

        {/* 4. Municipal Guarantee Footer */}
        <footer 
          className="w-full border-t py-12 transition-colors mt-auto"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--accent-emerald)' }}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  CivicFlow Public Engine
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Guaranteed Zero-Silent-Rejection Architecture • Open Public Infrastructure
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>SHA-256 Ledger Sealed</span>
              </span>
              <span>•</span>
              <span>National Building Code (NBC 2025)</span>
              <span>•</span>
              <span>Ward 18 Cadastral GIS</span>
              <span>•</span>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-1 font-semibold hover:underline cursor-pointer"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* 5. Keyboard Accessibility Modal */}
      <KeyboardHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
export default App;
