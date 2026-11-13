import React, { useState } from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { DemoRole, DemoScenarioId } from '../types';
import { COUNTRIES } from '../data/countries';
import {
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  ChevronUp,
  ChevronDown,
  UserCheck,
  Building2,
  ShieldAlert,
  Globe2,
  Sparkles,
} from 'lucide-react';

interface DemoControlBarProps {
  onOpenFlowMap: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({ onOpenFlowMap, onNavigateTab }) => {
  const { state, setScenario, setRole, resetScenario } = useDemoStore();
  const { locale } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeCountryConfig = COUNTRIES[state.activeCountry];

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scenario = e.target.value as DemoScenarioId;
    setScenario(scenario);
    onNavigateTab('dashboard');
  };

  const handleRoleChange = (role: DemoRole) => {
    setRole(role);
    onNavigateTab('dashboard');
  };

  return (
    <div
      id="demo-control-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 text-slate-800 border-t border-slate-200 shadow-2xl backdrop-blur-md transition-all duration-300"
    >
      {/* Mini Toggle Header when collapsed */}
      {isCollapsed ? (
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono min-w-0 overflow-hidden whitespace-nowrap">
            <span className="flex items-center gap-1.5 font-bold text-[#8a6a3a]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c4a67e] animate-pulse"></span>
              DEMO CONTROL
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-700">{activeCountryConfig.flag} {activeCountryConfig.name}</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden md:inline bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-600">
              ROLE: {state.activeRole}
            </span>
          </div>

          <button
            onClick={() => setIsCollapsed(false)}
            className="shrink-0 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 bg-stone-50 px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
          >
            <span className="hidden sm:inline">Expand Controls</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-3 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
            {/* Left: Branding & Scenario Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
                <SlidersHorizontal className="w-4 h-4 text-[#8a6a3a]" />
                <span className="font-mono font-bold uppercase tracking-widest text-[10px] text-[#8a6a3a]">
                  Demo Controls
                </span>
              </div>

              {/* Scenario Selector */}
              <div className="flex items-center gap-1.5">
                <label htmlFor="scenario-select" className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                  Scenario:
                </label>
                <select
                  id="scenario-select"
                  value={state.activeScenario}
                  onChange={handleScenarioChange}
                  className="bg-stone-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-[#c4a67e] cursor-pointer"
                >
                  <option value="MY_PERSONAL">🇲🇾 Malaysia — Personal Financing-i (Primary Demo)</option>
                  <option value="TR_VEHICLE">🇹🇷 Türkiye — Vehicle Participation Financing</option>
                  <option value="AZ_SME">🇦🇿 Azerbaijan — SME Equipment Financing</option>
                </select>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={resetScenario}
                className="p-1.5 bg-stone-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 transition cursor-pointer"
                title="Reset Scenario to Seed State"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Middle: Role Switcher */}
            <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-lg border border-slate-200">
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 px-2">Role:</span>
              <button
                type="button"
                onClick={() => handleRoleChange('CUSTOMER')}
                className={`px-3 py-1 rounded-md font-medium text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  state.activeRole === 'CUSTOMER'
                    ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Customer
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('PROVIDER')}
                className={`px-3 py-1 rounded-md font-medium text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  state.activeRole === 'PROVIDER'
                    ? 'bg-[#c4a67e]/20 text-[#8a6a3a] border border-[#c4a67e]/30'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Provider
                {state.applications.filter((a) => a.status === 'SUBMITTED').length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4a67e] animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`px-3 py-1 rounded-md font-medium text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  state.activeRole === 'ADMIN'
                    ? 'bg-purple-500/20 text-purple-700 border border-purple-500/30'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

            {/* Right: Flow Map / Demo Sequence Guide & Collapse */}
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={onOpenFlowMap}
                className="px-3 py-1.5 bg-[#c4a67e]/15 hover:bg-[#c4a67e]/25 text-[#8a6a3a] border border-[#c4a67e]/30 rounded-lg font-medium flex items-center gap-1.5 transition cursor-pointer text-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Demo Sequence Guide (STEP 1–22)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Collapse Control Bar"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
