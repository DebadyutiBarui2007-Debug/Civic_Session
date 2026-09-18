import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { OFFICIAL_MUNICIPAL_DATASETS, DEFECT_SCENARIOS } from './src/data/datasets';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'CivicFlow DAG Engine v2.4',
    zeroSilentRejections: true,
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 2. Official Municipal Datasets endpoint
app.get('/api/datasets', (req, res) => {
  const { query, category } = req.query;
  let filtered = [...OFFICIAL_MUNICIPAL_DATASETS];

  if (category && typeof category === 'string' && category !== 'All') {
    filtered = filtered.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }

  if (query && typeof query === 'string' && query.trim() !== '') {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q)
    );
  }

  res.json({
    total: filtered.length,
    datasets: filtered,
  });
});

// 3. AI & OCR Verification / PyDantic Cross-Validation Pipeline
app.post('/api/verify/ai-ocr', (req, res) => {
  try {
    const { documentName, defectType } = req.body;

    // Simulate multi-pass OCR & field cross matching
    const ocrConfidence = 99.4;
    const isResolution = documentName && documentName.toLowerCase().includes('tax');

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      validator: 'pydantic.v2_civic_validator (SHA-256: 7f8a9e1...)',
      metrics: {
        ocrConfidence: isResolution ? 99.8 : ocrConfidence,
        crossFieldParity: 99.2,
        schemaDrift: 0.0,
        biometricHashMatch: true,
        gisCadastralOverlap: 'Lot 14-B (100% Polygon Alignment)',
      },
      parsedDocument: {
        name: documentName || 'Property_Tax_NOC_2025_26_Validated.pdf',
        size: '2.4 MB',
        receiptNumber: 'TAX-2025-W18-9931',
        assessmentYear: '2025-26',
        clearedBalance: '₹0.00 / 0.00 DKK (Nil Pending)',
        digitalSignature: 'Verified (Ward 18 Municipal Revenue Ledger)',
      },
      nonBlockingInterception: {
        status: isResolution ? 'REMEDIATED_AND_RESUMED' : 'EVALUATED',
        queueResidencyRetained: true,
        rejectionPrevented: true,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to evaluate document verification pipeline' });
  }
});

// 4. Global Grounded Regulatory Search (Gemini 3.8 Flash + Google Search Grounding)
app.post('/api/regulatory/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const ai = getAiClient();

    // If Gemini API Key is configured, run real Google Search Grounding
    if (ai) {
      try {
        const prompt = `You are the CivicFlow Regulatory Grounding Agent. 
The user is asking a civic, municipal, building code, or licensing regulation question: "${query}".
Provide a concise, highly accurate, authoritative municipal/regulatory explanation with clear bullet points of requirements, compliance criteria, and applicable legal/statutory sections. Keep the tone professional, objective, and citizen-empowering.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const answerText = response.text || 'Information retrieved from regulatory registries.';
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        const sources: Array<{ title: string; url: string; snippet?: string }> = [];
        for (const chunk of groundingChunks) {
          if (chunk.web?.uri) {
            sources.push({
              title: chunk.web.title || 'Official Regulatory Reference',
              url: chunk.web.uri,
            });
          }
        }

        return res.json({
          query,
          answer: answerText,
          sources: sources.length > 0 ? sources : [
            { title: 'National Building Code & Municipal Standards Database', url: 'https://mohua.gov.in' },
            { title: 'Open Municipal Trade Licensing Gazette', url: 'https://data.gov.in' }
          ],
          searchDate: new Date().toLocaleDateString(),
          confidence: 0.98,
          isGroundedSearch: true,
        });
      } catch (geminiError: any) {
        console.warn('Gemini grounded search warning, falling back to curated registry:', geminiError?.message);
      }
    }

    // Curated intelligent fallback for standard civic queries
    const qLower = query.toLowerCase();
    let fallbackAnswer = `Based on National Building Codes (NBC 2025 §4.2) and Municipal Corporation Regulations:
• Commercial establishments require synchronous clearance across Revenue, Fire Safety, and Public Health inspectorates.
• Egress corridors must maintain an unobstructed minimum clear width of 1.80m for occupancies exceeding 50 persons (NFPA 96 & Model Bye-Laws 2025).
• Property tax clearance certificates (NOC) must reflect nil encumbrances for the current financial assessment year (2025-26).
• CivicFlow guarantees that minor documentation discrepancies or missing annexures trigger an automated 48-hour non-blocking remediation gate rather than an outright rejection.`;

    if (qLower.includes('fire') || qLower.includes('egress') || qLower.includes('nfpa')) {
      fallbackAnswer = `Statutory Fire Safety Mandate (NBC Part IV & NFPA 96):
• Commercial roasteries, bakeries, and kitchens must deploy UL-1046 compliant grease baffle filters and interlocked automatic fuel shut-off valves.
• Clear egress width must not fall below 1.80m, with doors swinging outwards in direction of escape.
• Extinguishing systems require certified Class K wet chemical suppression units within 15 meters of thermal appliances.
• Under CivicFlow's zero-silent-rejection protocol, expired fire NOCs receive a 45-day provisional waiver pending municipal field inspection.`;
    } else if (qLower.includes('tax') || qLower.includes('noc') || qLower.includes('revenue')) {
      fallbackAnswer = `Municipal Revenue & Property Tax Guidelines (Ward 18 / Urban Cadastre):
• Annual commercial property tax receipts must be authenticated via the tokenized GIS Cadastre ledger.
• If an NOC receipt is unattached, the CivicFlow Interceptor halts cancellation, freezing SLA timers and enabling instant 1-click retrieval via City DigiLocker or direct PDF upload.`;
    }

    return res.json({
      query,
      answer: fallbackAnswer,
      sources: [
        { title: 'National Building Code (NBC 2025 Part IV)', url: 'https://bis.gov.in' },
        { title: 'Model Building Bye-Laws (MBBL 2025)', url: 'https://mohua.gov.in' },
        { title: 'National Industrial Classification (NIC Code 56102)', url: 'https://mospi.gov.in' },
      ],
      searchDate: new Date().toLocaleDateString(),
      confidence: 0.95,
      isGroundedSearch: false,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Regulatory query failed' });
  }
});

// Vite middleware & Static Serving setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicFlow Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
