import React, { useState } from 'react';
import { OfficialDatasetEntry, GroundedSearchResult } from '../types';
import { OFFICIAL_MUNICIPAL_DATASETS } from '../data/datasets';
import { 
  Compass, 
  Search, 
  ExternalLink, 
  Globe, 
  Database, 
  Sparkles, 
  BookOpen, 
  Filter, 
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const RegulatoryDatasetView: React.FC = () => {
  const [datasets] = useState<OfficialDatasetEntry[]>(OFFICIAL_MUNICIPAL_DATASETS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterQuery, setFilterQuery] = useState<string>('');
  
  // Grounded Web Search State
  const [groundedQuery, setGroundedQuery] = useState<string>('');
  const [isSearchingGrounded, setIsSearchingGrounded] = useState<boolean>(false);
  const [groundedResult, setGroundedResult] = useState<GroundedSearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const categories = ['All', 'Building Bylaws', 'Fire Code', 'Tax Classification', 'Zoning Registry', 'Identity Verification'];

  const filteredDatasets = datasets.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = 
      item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleGlobalGroundedSearch = async (queryToRun?: string) => {
    const q = queryToRun || groundedQuery;
    if (!q.trim()) return;

    setIsSearchingGrounded(true);
    setSearchError(null);
    try {
      const response = await fetch('/api/regulatory/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!response.ok) {
        throw new Error(`Regulatory search returned ${response.status}`);
      }

      const data = await response.json();
      setGroundedResult(data);
    } catch (err: any) {
      setSearchError(err?.message || 'Failed to fetch grounded regulatory search');
    } finally {
      setIsSearchingGrounded(false);
    }
  };

  const samplePrompts = [
    'What are the minimum clear egress width requirements under NBC 2025?',
    'What is the maximum distance to a Class K wet chemical extinguisher in NFPA 96?',
    'Commercial kitchen ventilation and UL 1046 grease filter standards',
    'What are the penalties for operating without a municipal trade license?',
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header */}
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
              Authoritative Knowledge Base
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Open Government Data & Global Grounding
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Municipal Standards & Regulatory Registries
          </h1>
          <p className="text-xs sm:text-sm max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Integrated with official statutory datasets (National Building Code 2025, NFPA 96, NIC 56102, Ward 18 GIS Cadastre). If your query expands beyond local municipal boundaries, CivicFlow seamlessly connects to the global network via Google Grounded Search.
          </p>
        </div>
      </section>

      {/* 2. Global Grounded Search Engine (Gemini 3.8 Flash + Google Search Grounding) */}
      <section 
        id="grounded-search-section"
        className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-5"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--accent-emerald)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Global Grounded Search (Beyond Local Datasets)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Search Grounded</span>
          </span>
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              id="input-grounded-search"
              placeholder="Query any national code, municipal act, or statutory standard (e.g. NFPA 96 duct clearance)..."
              value={groundedQuery}
              onChange={(e) => setGroundedQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGlobalGroundedSearch()}
              className="w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-surface-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <button
            id="btn-run-grounded-search"
            onClick={() => handleGlobalGroundedSearch()}
            disabled={isSearchingGrounded || !groundedQuery.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-xs cursor-pointer hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-emerald)' }}
          >
            {isSearchingGrounded ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Grounding...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Search Global Registry</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Try asking:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setGroundedQuery(prompt);
                handleGlobalGroundedSearch(prompt);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer hover:border-emerald-500 hover:text-emerald-600"
              style={{
                backgroundColor: 'var(--bg-surface-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Grounded Result Display */}
        {groundedResult && (
          <div className="mt-4 p-5 rounded-2xl border space-y-4 animate-in fade-in duration-300"
            style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  Grounded Output for: "{groundedResult.query}"
                </span>
              </div>
              <span className="text-[10px] font-mono opacity-60">
                Confidence: {(groundedResult.confidence * 100).toFixed(0)}% • {groundedResult.searchDate}
              </span>
            </div>

            <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
              {groundedResult.answer}
            </div>

            {groundedResult.sources && groundedResult.sources.length > 0 && (
              <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Grounding Sources & Citations
                </div>
                <div className="flex flex-wrap gap-2">
                  {groundedResult.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors hover:border-emerald-500"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <span>{src.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Official Municipal Datasets Explorer */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Connected Municipal Datasets ({filteredDatasets.length})
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Pre-loaded statutory standards trained into the CivicFlow Rule Interceptor
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Filter standards or codes..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat ? 'shadow-xs text-white' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: selectedCategory === cat ? 'var(--accent-emerald)' : 'var(--bg-surface)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-primary)',
                borderColor: 'var(--border-color)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dataset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDatasets.map((entry) => (
            <div
              key={entry.id}
              id={`dataset-${entry.id}`}
              className="p-6 rounded-3xl border shadow-xs space-y-4 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    {entry.code}
                  </span>
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {entry.category}
                  </span>
                </div>

                <h3 className="font-bold text-base tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                  {entry.title}
                </h3>

                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {entry.description}
                </p>

                {/* Parameters Table */}
                <div className="p-3 rounded-2xl border text-xs font-mono space-y-1.5 mb-4"
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Statutory Parameter Limits
                  </div>
                  {Object.entries(entry.parameters).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between gap-2">
                      <span className="opacity-70 truncate">{key}:</span>
                      <span className="font-semibold truncate text-right text-emerald-700 dark:text-emerald-400">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t text-[11px]"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span className="truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>
                  Source: {entry.source}
                </span>

                {entry.citationUrl ? (
                  <a
                    href={entry.citationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>View Official Act</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Local Token Validated</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
