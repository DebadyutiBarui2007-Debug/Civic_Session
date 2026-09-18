import { OfficialDatasetEntry, DefectScenario, ApplicationDocument, DAGNode, AuditEvent } from '../types';

export const OFFICIAL_MUNICIPAL_DATASETS: OfficialDatasetEntry[] = [
  {
    id: 'MBL-2025-EGRESS',
    category: 'Building Bylaws',
    code: 'MBBL-2025 §9.4.2',
    title: 'Model Building Bye-Laws: Minimum Egress Width & Occupant Load',
    source: 'Ministry of Housing & Urban Affairs / Open Municipal Data',
    lastUpdated: 'Q1 2025',
    parameters: {
      'Min Corridor Width': '1.80 m',
      'Doorway Clear Opening': '1.00 m per 50 occupants',
      'Staircase Enclosure Rating': '2 Hours Fire Resistance',
      'Max Dead-End Corridor': '6.00 m'
    },
    description: 'Mandates minimum dimensions for egress corridors and stairways in Assembly and Commercial Class 3 establishments to prevent crush bottlenecks.',
    citationUrl: 'https://mohua.gov.in/upload/uploadfiles/files/MBBL2016.pdf'
  },
  {
    id: 'NFPA-96-FIRE',
    category: 'Fire Code',
    code: 'NFPA 96 & NBC Part IV (2025)',
    title: 'Standard for Ventilation Control and Fire Protection of Commercial Cooking Operations',
    source: 'National Fire Protection Association & National Building Code',
    lastUpdated: 'Revised 2025',
    parameters: {
      'Hood Filter Type': 'UL 1046 Grease Baffle Filter',
      'Duct Clearance to Combustibles': '457 mm (18 in)',
      'Suppression Medium': 'Wet Chemical Class K (UL 300 Certified)',
      'Automatic Fuel Shut-off': 'Mandatory Interlocked'
    },
    description: 'Statutory fire prevention requirements for commercial kitchens, roasteries, and food establishments with commercial thermal heating equipment.',
    citationUrl: 'https://www.nfpa.org/codes-and-standards/nfpa-96-standard-development/96'
  },
  {
    id: 'NIC-56102-TRADE',
    category: 'Tax Classification',
    code: 'NIC-2008 Rev 4 / Code 56102',
    title: 'National Industrial Classification: Operation of Eating Places, Tea & Coffee Rooms',
    source: 'Central Statistical Office & Ministry of Statistics',
    lastUpdated: '2024-2025',
    parameters: {
      'Activity Code': '56102',
      'GST / VAT Category': 'Composition Scheme / 5% Tier',
      'Municipal Health Zone': 'Food Business Category II (Non-hazardous prep)',
      'FSSAI / Food License Tier': 'State License (Turnover > 12 Lakh)'
    },
    description: 'Harmonized trade classification assigning applicable municipal licensing fee brackets, food hygiene audit frequencies, and trade duty rates.',
    citationUrl: 'https://www.mospi.gov.in/classification/national-industrial-classification'
  },
  {
    id: 'WARD-18-TAX-GIS',
    category: 'Zoning Registry',
    code: 'GIS-CAD-W18-2025',
    title: 'Municipal Cadastral GIS & Property Tax Assessment Ledger (Ward 18 / District 4)',
    source: 'Department of Municipal Revenue & Urban Land Mapping',
    lastUpdated: 'March 2025',
    parameters: {
      'Parcel ID Format': 'W18-PL-XXXX-YYYY',
      'Annual Assessment Year': '2025-2026',
      'Commercial Surcharge Rate': '1.25x Residential Unit Area Value',
      'NOC Issuance Protocol': 'Sub-120ms Real-Time Tokenized Verification'
    },
    description: 'Authoritative municipal geo-spatial database mapping parcel boundary polygons, ownership deeds, and cleared property tax liabilities for instant machine validation.'
  },
  {
    id: 'UID-EKYC-2025',
    category: 'Identity Verification',
    code: 'UIDAI / MitID Open e-KYC v2.4',
    title: 'Cryptographic Identity Cross-Validation & Fuzzy Token Matching Standard',
    source: 'Open Digital Public Infrastructure Architecture',
    lastUpdated: 'February 2025',
    parameters: {
      'Biometric Hash Precision': 'SHA-256 with Zero-Knowledge Proof',
      'Name Levenshtein Distance Allowed': 'Up to 2 character variance with alias mapping',
      'Token Expiry TTL': '3600 seconds with Redis State Lease',
      'Aadhaar / CPR Tokenization': 'Deterministic Non-Reversible Vault Index'
    },
    description: 'Protocol for cross-verifying citizen enterprise identity without exposing unmasked personal identifiers, tolerating legal alias and phonetic nuances without rejection.'
  }
];

export const INITIAL_DAG_NODES: DAGNode[] = [
  {
    id: 1,
    key: 'SUBMITTED',
    name: 'Citizen Submission Ingest',
    department: 'Digital Intake Gateway',
    shortDesc: 'Cryptographic receipt issued with SHA-256 digest and timestamp verification.',
    badge: '200 OK',
    slaTimeMinutes: 5,
    status: 'completed'
  },
  {
    id: 2,
    key: 'AUTO_VERIFIED',
    name: 'Dual-Pass OCR & PyDantic Parsing',
    department: 'AI Verification Engine',
    shortDesc: 'Extracted 18 structural entities with 99.4% confidence token match across deeds.',
    badge: 'CONFIDENCE 99.4%',
    slaTimeMinutes: 2,
    status: 'completed'
  },
  {
    id: 3,
    key: 'DEPT_REVIEW_REVENUE',
    name: 'Revenue & Property Tax Clearance',
    department: 'Department of Revenue',
    shortDesc: 'Checking annual property tax clearance receipt and Ward assessment status.',
    badge: 'ACTION_REQUIRED',
    slaTimeMinutes: 120,
    status: 'action_required'
  },
  {
    id: 4,
    key: 'DEPT_REVIEW_FIRE',
    name: 'Fire & Life Safety Inspectorate',
    department: 'Fire Safety Command',
    shortDesc: 'Spatial bounding validation of egress routes, fire alarms, and UL-1046 filters.',
    badge: 'PENDING_PRE_REQ',
    slaTimeMinutes: 240,
    status: 'pending'
  },
  {
    id: 5,
    key: 'DEPT_REVIEW_HEALTH',
    name: 'Environmental Health & Food Hygiene',
    department: 'Health & Public Hygiene',
    shortDesc: 'Water potability report and grease separator interceptor compliance.',
    badge: 'QUEUED',
    slaTimeMinutes: 180,
    status: 'pending'
  },
  {
    id: 6,
    key: 'APPROVED',
    name: 'Digital Municipal Seal Issuance',
    department: 'Chief Licensing Magistrate',
    shortDesc: 'QR-verifiable tamper-evident trade license minted into citizen DigiLocker.',
    badge: 'PENDING_FINAL',
    slaTimeMinutes: 10,
    status: 'pending'
  }
];

export const INITIAL_APPLICATION_DOCUMENTS: ApplicationDocument[] = [
  {
    id: 'doc-id-01',
    name: 'Aadhaar_National_Identity_Card.pdf',
    type: 'Identity Proof',
    size: '1.8 MB',
    hash: '88fa2b49e819b02a9012fce4d',
    ocrConfidence: 99.8,
    verifiedStatus: 'verified',
    category: 'identity',
    extractedFields: {
      'Holder Name': 'Elena M. Lindqvist (Alias: E. M. Lindqvist)',
      'Entity Type': 'Sole Proprietorship / Managing Partner',
      'Identifier Token': 'XXXX-XXXX-8921 (Tokenized)',
      'Verification Authority': 'UIDAI / MitID Verified via Cryptographic Keystore'
    }
  },
  {
    id: 'doc-prop-02',
    name: 'Commercial_Deed_Lease_Agreement.pdf',
    type: 'Premises Title Deed',
    size: '4.2 MB',
    hash: 'c1081ad91e843fa66901bc32e',
    ocrConfidence: 98.9,
    verifiedStatus: 'verified',
    category: 'property',
    extractedFields: {
      'Premises Address': 'Lot 14-B, Ørestad Boulevard / Ward 18 Waterfront',
      'Floor Area': '420.00 sq. meters',
      'Permitted Usage': 'Commercial Class 3 (Food & Beverage Roastery)',
      'Lease Validity': '01-Nov-2024 to 31-Oct-2034 (10 Years Active)'
    }
  },
  {
    id: 'doc-arch-03',
    name: 'Egress_Fire_Schematic_RevC.pdf',
    type: 'Architectural Safety Layout',
    size: '6.1 MB',
    hash: 'e9903b199af7440b82da1741e',
    ocrConfidence: 97.4,
    verifiedStatus: 'verified',
    category: 'architecture',
    boundingTargets: [
      { id: 'b1', label: 'Primary Egress Door Width', required: '>= 1.80 m', verified: true, coords: { x: 30, y: 15, width: 90, height: 40 } },
      { id: 'b2', label: 'Wet Chemical Fire Hydrant H-02', required: '< 15m to Kitchen', verified: true, coords: { x: 190, y: 75, width: 85, height: 35 } },
      { id: 'b3', label: 'UL-1046 Exhaust Hood Baffle', required: 'NFPA 96 Interlocked', verified: true, coords: { x: 210, y: 25, width: 80, height: 35 } }
    ],
    extractedFields: {
      'Total Occupant Capacity': '120 persons maximum',
      'Clear Exit Width': '2.10 m (Exceeds 1.8m requirement)',
      'Thermal Intercept': 'Class K suppression cylinder installed',
      'Fire Alarm Relay': 'Direct optical link to Central Municipal Dispatch'
    }
  },
  {
    id: 'doc-tax-04',
    name: 'Property_Tax_NOC_2025_26.pdf',
    type: 'Municipal Tax Receipt NOC',
    size: 'Pending',
    hash: 'UNATTACHED_DELTA_AWAITING',
    ocrConfidence: 0,
    verifiedStatus: 'action_required',
    category: 'clearance',
    extractedFields: {
      'Status': 'ACTION REQUIRED - Certificate missing from packet',
      'Policy Reference': 'MBBL / Municipal Revenue Code §REV-204',
      'Resolution SLA': '48 hours allocated without resetting prior nodes'
    }
  }
];

export const DEFECT_SCENARIOS: DefectScenario[] = [
  {
    id: 'defect-missing-tax',
    name: 'Null Property Tax NOC (Missing Mandate #REV-204)',
    defectCategory: 'missing_tax',
    affectedDepartment: 'Revenue',
    legacyOutcome: 'Immediate silent discard. Application rejected after 21 days with no feedback. Citizen loses ₹4,500 application fee and must re-enter from Step 1.',
    civicFlowMitigation: 'Non-blocking state suspension. Priority timer freezes, verified stages (Identity, Lease, Fire Blueprint) stay 100% locked in memory. 1-click DigiLocker bridge dispatches inline.',
    remediationTitle: 'Municipal Property Tax Clearance NOC (2025-26)',
    remediationPrompt: 'Upload the current property tax clearance voucher for Ward 18 Lot 14-B or authenticate via City DigiLocker to auto-fetch the receipt.',
    requiredDocType: 'Property_Tax_NOC_2025_26.pdf',
    autoResolutionAvailable: true,
    digilockerBridgeDoc: 'NOC-WARD18-2025-9931.pdf'
  },
  {
    id: 'defect-name-mismatch',
    name: 'Mismatched Name: Identity Token vs Property Deed',
    defectCategory: 'name_mismatch',
    affectedDepartment: 'Civil Registry',
    legacyOutcome: 'Hard rejection citing "Fraudulent / Discrepant Credentials". Citizen forced to seek notary physical affidavit in civil court.',
    civicFlowMitigation: 'PyDantic Fuzzy Token Matcher triggers Rule #84C Gazette Alias mapping. Confirms phonetic confidence (96.8%) and presents a 10-second inline biometric confirmation instead of rejecting.',
    remediationTitle: 'Proprietor Legal Name Alias Attestation',
    remediationPrompt: 'Aadhaar shows "Elena M. Lindqvist" while Deed states "E. M. Lindqvist". Confirm your alias with an instant e-signature or attach Gazette notification.',
    requiredDocType: 'Gazette_Alias_Attestation.pdf',
    autoResolutionAvailable: true,
    digilockerBridgeDoc: 'Gazette_Affidavit_Verified.pdf'
  },
  {
    id: 'defect-fire-noc',
    name: 'Expired Fire Safety NOC (>30 Days Past Validity)',
    defectCategory: 'fire_noc_expired',
    affectedDepartment: 'Fire Safety',
    legacyOutcome: 'Silent rejection by fire safety liaison desk without notifying citizen. Application lingers in limbo for 45 days before expiring.',
    civicFlowMitigation: 'CivicFlow generates a 45-day provisional compliance waiver, queues a municipal site inspector slot automatically, and keeps the trade license in conditional active status.',
    remediationTitle: 'Provisional Fire Safety Compliance Declaration',
    remediationPrompt: 'Sign the provisional compliance undertaking to schedule your routine municipal survey while maintaining full workflow momentum.',
    requiredDocType: 'Fire_Safety_Provisional_Waiver.pdf',
    autoResolutionAvailable: true,
    digilockerBridgeDoc: 'Provisional_Fire_Inspection_Pass.pdf'
  }
];

export const INITIAL_AUDIT_TRAIL: AuditEvent[] = [
  {
    id: 'audit-001',
    timestamp: '08:42:01 CET',
    stage: 'Citizen Ingestion',
    action: 'Application Payload Sealed with Cryptographic Token',
    actor: 'Elena M. Lindqvist (MitID / Aadhaar e-Sign)',
    hash: '88fa2b49e819b02a9012fce4d',
    blockNumber: 482901,
    type: 'success',
    details: 'Digital payload received at gateway. Ingestion latency 124ms into Redis queue with zero packet drop.'
  },
  {
    id: 'audit-002',
    timestamp: '08:43:05 CET',
    stage: 'Automated AI/OCR Engine',
    action: 'Dual-Pass VLM Entity Extraction & Spatial Bounding Complete',
    actor: 'pydantic.v2_civic_validator (AI Worker Node #4)',
    hash: 'c1081ad91e843fa66901bc32e',
    blockNumber: 482902,
    type: 'success',
    details: 'Parsed 3 blueprints and identity credentials. Floor area 420 sq.m verified against municipal zoning GIS.'
  },
  {
    id: 'audit-003',
    timestamp: '08:44:12 CET',
    stage: 'Policy Rules Interceptor',
    action: 'Interceptor Non-Blocking Gate Activated (REV-204 Missing Tax NOC)',
    actor: 'CivicFlow Resilient State Interceptor',
    hash: 'e819b02a44d2ae1902bc9112a',
    blockNumber: 482903,
    type: 'warning',
    details: 'State safely suspended to ACTION_REQUIRED. Deadline paused, prior 2 nodes preserved. Rejection prevented.'
  }
];
