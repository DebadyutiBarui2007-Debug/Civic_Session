import React, { useState } from 'react';
import { NavigationTab, ThemeMode } from '../types';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  Sparkles, 
  Flame, 
  HelpCircle, 
  User, 
  CheckCircle2, 
  Cpu, 
  Compass, 
  FileText, 
  BarChart3,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onOpenHelp,
}) => {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const themeLabels: Record<ThemeMode, { label: string; icon: React.ReactNode }> = {
    light: { label: 'Nordic Biophilic (Light)', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    dark: { label: 'Nordic Obsidian (Dark)', icon: <Moon className="w-4 h-4 text-emerald-400" /> },
    'warm-oasis': { label: 'Warm Oasis (Sepia)', icon: <Sparkles className="w-4 h-4 text-orange-400" /> },
    'midnight-aurora': { label: 'Midnight Aurora', icon: <Flame className="w-4 h-4 text-cyan-400" /> },
    system: { label: 'System Default', icon: <SlidersHorizontal className="w-4 h-4 text-slate-400" /> },
  };

  const navItems: Array<{ id: NavigationTab; label: string; icon: React.ReactNode }> = [
    { id: 'citizen-portal', label: 'Citizen Portal', icon: <User className="w-4 h-4" /> },
    { id: 'back-office-reviewer', label: 'Back-Office Reviewer', icon: <FileText className="w-4 h-4" /> },
    { id: 'workflow-simulator', label: 'Workflow Simulator', icon: <Cpu className="w-4 h-4" /> },
    { id: 'regulatory-dataset', label: 'Regulatory Datasets', icon: <Compass className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Benchmarks', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor: 'var(--accent-emerald)', color: '#ffffff' }}
            onClick={() => setActiveTab('citizen-portal')}
            title="CivicFlow E-Governance Engine"
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
                CivicFlow
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                DAG Engine v2.4
              </span>
            </div>
            <p className="hidden md:block text-xs" style={{ color: 'var(--text-muted)' }}>
              Deterministic Zero-Silent-Rejection Public Infrastructure
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full border shadow-xs"
          style={{
            backgroundColor: 'var(--bg-surface-subtle)',
            borderColor: 'var(--border-color)',
          }}
          aria-label="Primary Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'shadow-xs text-white'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--accent-emerald)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Telemetry, Theme Switcher, Keyboard Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dept Indicator */}
          <div 
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
            style={{ 
              backgroundColor: 'var(--bg-surface-subtle)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)'
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Civil Registry</span>
          </div>

          {/* Theme Switcher Button & Dropdown */}
          <div className="relative">
            <button
              id="btn-theme-switcher"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-xs cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              title="Switch Color Theme (Golden Ratio Balanced)"
              aria-label="Theme selector"
              aria-expanded={themeDropdownOpen}
            >
              {themeLabels[theme].icon}
              <span className="hidden md:inline">{themeLabels[theme].label.split(' ')[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {themeDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border shadow-xl p-1.5 z-50 transition-all"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider opacity-60" style={{ color: 'var(--text-muted)' }}>
                  Golden Ratio Palettes
                </div>
                {(Object.keys(themeLabels) as ThemeMode[]).map((modeKey) => (
                  <button
                    key={modeKey}
                    id={`theme-opt-${modeKey}`}
                    onClick={() => {
                      setTheme(modeKey);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                      theme === modeKey ? 'font-bold' : ''
                    }`}
                    style={{
                      backgroundColor: theme === modeKey ? 'var(--bg-surface-elevated)' : 'transparent',
                      color: theme === modeKey ? 'var(--accent-emerald)' : 'var(--text-primary)',
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {themeLabels[modeKey].icon}
                      {themeLabels[modeKey].label}
                    </span>
                    {theme === modeKey && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Dialog Trigger */}
          <button
            id="btn-help-shortcuts"
            onClick={onOpenHelp}
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all shadow-xs cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            title="Keyboard Shortcuts & Guidance (Press ?)"
            aria-label="Keyboard Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden px-3 py-2 border-t overflow-x-auto flex gap-1.5"
        style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          borderColor: 'var(--border-color)',
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`mob-nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === item.id ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === item.id ? 'var(--accent-emerald)' : 'transparent',
              color: activeTab === item.id ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
