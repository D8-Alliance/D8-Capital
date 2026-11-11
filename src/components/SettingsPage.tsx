import React from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { COUNTRIES } from '../data/countries';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import {
  SlidersHorizontal,
  User,
  Globe2,
  RotateCcw,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { state, resetScenario } = useDemoStore();
  const { locale, setLocale, t } = useI18n();

  const countryConfig = COUNTRIES[state.activeCountry] || COUNTRIES.MY;

  return (
    <div id="settings-page" className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('nav.settings')}
          </h1>
          <DemoDataLabel variant="badge" />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Demo profile preferences, active jurisdiction, and architecture settings
        </p>
      </div>

      {/* Active Profile Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-700" />
          Active Demo Profile ({state.activeRole})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">User Name</span>
            <span className="font-bold text-slate-900 block mt-0.5">{state.activeUser.name}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">National ID / Passport</span>
            <span className="font-bold font-mono text-slate-900 block mt-0.5">
              {state.activeUser.idNumber}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
            <span className="font-semibold text-slate-900 block mt-0.5">{state.activeUser.email}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Jurisdiction</span>
            <span className="font-bold text-emerald-800 block mt-0.5">
              {countryConfig.flag} {countryConfig.name} ({countryConfig.currency})
            </span>
          </div>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-emerald-700" />
          Language Selection (§17)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { code: 'en', label: 'English', desc: 'Global Default' },
            { code: 'ms', label: 'Bahasa Malaysia', desc: 'Malaysia Standard' },
            { code: 'tr', label: 'Türkçe', desc: 'Türkiye Katılım' },
            { code: 'az', label: 'Azərbaycan', desc: 'Azərbaycan Dili' },
          ].map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLocale(l.code as any)}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                locale === l.code
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="font-bold text-xs text-slate-900 block">{l.label}</span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">{l.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Static "Future D8 SuperApp Integration" (HC-1 & Section 16) */}
      <div
        id="future-superapp-integration-section"
        className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-emerald-800/60"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-400/20 text-amber-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
              Architectural Roadmap (HC-1 & §16)
            </span>
            <h3 className="text-lg font-bold text-white">
              Future D8 SuperApp & Cross-Border Ecosystem Integration
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          While D8 Capital operates currently as a <strong>standalone Shariah-compliant digital financing marketplace PWA</strong>, its microservice-ready schema and modular OAuth2/OpenID Connect contracts are architected for seamless federation into the future <strong>D8 Organization Multi-Country SuperApp</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-amber-300 font-bold block text-xs">1. Single Sign-On (SSO)</span>
            <p className="text-[11px] text-slate-300">
              Future federated identity across all D-8 member state portals (Malaysia, Türkiye, Azerbaijan, Indonesia, Pakistan, Egypt, Nigeria, Iran).
            </p>
          </div>

          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-amber-300 font-bold block text-xs">2. Halal Cross-Border Trade</span>
            <p className="text-[11px] text-slate-300">
              Direct Murabaha & Letter of Credit (LC) trade financing for intra-D8 Halal supply chains.
            </p>
          </div>

          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-amber-300 font-bold block text-xs">3. Unified Shariah Registry</span>
            <p className="text-[11px] text-slate-300">
              Cross-border recognition of SAC resolutions across participating central banks and supervision boards.
            </p>
          </div>
        </div>
      </div>

      {/* Demo State Reset */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Reset Demo Scenario State</h4>
          <p className="text-xs text-slate-500">
            Re-initializes all demo applications, KYC profiles, and simulated audit logs to clean seed state.
          </p>
        </div>

        <button
          type="button"
          onClick={resetScenario}
          className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Scenarios</span>
        </button>
      </div>

      {/* Regulatory Disclaimer */}
      <RegulatoryDisclaimer />
    </div>
  );
};
