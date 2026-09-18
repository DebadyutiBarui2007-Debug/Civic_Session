export type ThemeMode = 'light' | 'dark' | 'system' | 'warm-oasis' | 'midnight-aurora';

export type NavigationTab = 
  | 'citizen-portal'
  | 'back-office-reviewer'
  | 'workflow-simulator'
  | 'analytics'
  | 'regulatory-dataset';

export type DAGNodeStatus = 'pending' | 'active' | 'action_required' | 'completed' | 'bypassed' | 'rejected_in_legacy';

export interface DAGNode {
  id: number;
  key: string;
  name: string;
  department: string;
  shortDesc: string;
  badge: string;
  slaTimeMinutes: number;
  status: DAGNodeStatus;
  detailPayload?: Record<string, unknown>;
}

export interface BoundingBox {
  id: string;
  label: string;
  required: string;
  verified: boolean;
  coords: { x: number; y: number; width: number; height: number };
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  hash: string;
  ocrConfidence: number;
  verifiedStatus: 'verified' | 'action_required' | 'pending';
  boundingTargets?: BoundingBox[];
  extractedFields: Record<string, string>;
  category: 'identity' | 'property' | 'architecture' | 'clearance';
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  stage: string;
  action: string;
  actor: string;
  hash: string;
  blockNumber: number;
  type: 'info' | 'warning' | 'success' | 'remediation';
  details: string;
}

export interface DefectScenario {
  id: string;
  name: string;
  defectCategory: 'missing_tax' | 'name_mismatch' | 'fire_noc_expired' | 'egress_violation';
  affectedDepartment: 'Revenue' | 'Fire Safety' | 'Civil Registry';
  legacyOutcome: string;
  civicFlowMitigation: string;
  remediationTitle: string;
  remediationPrompt: string;
  requiredDocType: string;
  autoResolutionAvailable: boolean;
  digilockerBridgeDoc: string;
}

export interface OfficialDatasetEntry {
  id: string;
  category: 'Building Bylaws' | 'Fire Code' | 'Tax Classification' | 'Zoning Registry' | 'Identity Verification';
  code: string;
  title: string;
  source: string;
  lastUpdated: string;
  parameters: Record<string, string | number>;
  description: string;
  citationUrl?: string;
}

export interface GroundedSearchResult {
  query: string;
  answer: string;
  sources: Array<{ title: string; url: string; snippet?: string }>;
  searchDate: string;
  confidence: number;
}

export interface StressTestMetrics {
  totalProcessed: number;
  silentDropoutsCivicFlow: number;
  silentDropoutsLegacy: number;
  retainedPercent: number;
  avgResolutionTimeSeconds: number;
  interceptionsTriggered: number;
  resumedWithoutResetCount: number;
}
