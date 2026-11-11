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
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0d]/95 text-[#e5e5e5] border-t border-white/10 shadow-2xl backdrop-blur-md transition-all duration-300"
    >
      {/* Mini Toggle Header when collapsed */}
      {isCollapsed ? (
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 font-bold text-[#c4a67e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c4a67e] animate-pulse"></span>
              DEMO CONTROL
            </span>
            <span className="text-white/20">|</span>
            <span className="text-white/80">{activeCountryConfig.flag} {activeCountryConfig.name}</span>
            <span className="text-white/20">|</span>
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-white/70">
              ROLE: {state.activeRole}
            </span>
          </div>

          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-1 text-xs text-white/50 hover:text-white bg-[#141414] px-2.5 py-1 rounded-lg border border-white/10 transition cursor-pointer"
          >
            <span>Expand Controls</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-3 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
            {/* Left: Branding & Scenario Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 pr-2 border-r border-white/10">
                <SlidersHorizontal className="w-4 h-4 text-[#c4a67e]" />
                <span className="font-mono font-bold uppercase tracking-widest text-[10px] text-[#c4a67e]">
                  Demo Controls
                </span>
              </div>

              {/* Scenario Selector */}
              <div className="flex items-center gap-1.5">
                <label htmlFor="scenario-select" className="text-[10px] uppercase font-mono text-white/40 tracking-wider">
                  Scenario:
                </label>
                <select
                  id="scenario-select"
                  value={state.activeScenario}
                  onChange={handleScenarioChange}
                  className="bg-[#141414] border border-white/10 text-white/90 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-[#c4a67e] cursor-pointer"
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
                className="p-1.5 bg-[#141414] hover:bg-white/5 text-white/60 hover:text-white rounded-lg border border-white/10 transition cursor-pointer"
                title="Reset Scenario to Seed State"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Middle: Role Switcher */}
            <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-lg border border-white/10">
              <span className="text-[9px] uppercase font-mono tracking-widest text-white/30 px-2">Role:</span>
              <button
                type="button"
                onClick={() => handleRoleChange('CUSTOMER')}
                className={`px-3 py-1 rounded-md font-medium text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  state.activeRole === 'CUSTOMER'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-white/40 hover:text-white/80'
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
                    ? 'bg-[#c4a67e]/20 text-[#c4a67e] border border-[#c4a67e]/30'
                    : 'text-white/40 hover:text-white/80'
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
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-white/40 hover:text-white/80'
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
                className="px-3 py-1.5 bg-[#c4a67e]/15 hover:bg-[#c4a67e]/25 text-[#c4a67e] border border-[#c4a67e]/30 rounded-lg font-medium flex items-center gap-1.5 transition cursor-pointer text-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Demo Sequence Guide (STEP 1–22)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
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
