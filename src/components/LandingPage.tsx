import React from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { COUNTRIES_LIST } from '../data/countries';
import { CountryCode, DemoScenarioId } from '../types';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import {
  ShieldCheck,
  Building2,
  TrendingUp,
  ArrowRight,
  Layers,
  Sparkles,
  Globe2,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { state, setScenario, setCountry } = useDemoStore();
  const { t, setLocale } = useI18n();

  const handleSelectCountry = (country: CountryCode, scenario: DemoScenarioId) => {
    setScenario(scenario);
    const countryData = COUNTRIES_LIST.find((c) => c.code === country);
    if (countryData) {
      setLocale(countryData.defaultLocale);
    }
    onEnterApp();
  };

  return (
    <div id="landing-page" className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        <span>
          <strong>D8 Capital Prototype</strong> • Standalone Shariah-Compliant Digital Financing Marketplace (HC-1 to HC-7 Compliant)
        </span>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
        {/* Brand & Value Prop */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Islamic & Katılım Banking Interoperability</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Digital Islamic Financing Marketplace
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-light">
            Connecting financing seekers with participating Islamic financial institutions in{' '}
            <strong className="text-emerald-400 font-semibold">Malaysia 🇲🇾</strong>,{' '}
            <strong className="text-red-400 font-semibold">Türkiye 🇹🇷</strong>, and{' '}
            <strong className="text-blue-400 font-semibold">Azerbaijan 🇦🇿</strong>.
          </p>
        </div>

        {/* 3 Country Selector Cards (STEP 1 & 2) */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
              Step 1 & 2: Select Country Jurisdiction
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Malaysia Card */}
            <div
              onClick={() => handleSelectCountry('MY', 'MY_PERSONAL')}
              className="group p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">🇲🇾</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    MYR (RM)
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                    Malaysia
                  </h3>
                  <span className="text-xs text-slate-400">Primary Management Demo (§20)</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Personal Financing-i (RM50,000 / 7 years), Tawarruq commodity murabahah, BNM SAC compliance, and PDS schedules.
                </p>
              </div>

              <button
                type="button"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Enter Malaysia Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Türkiye Card */}
            <div
              onClick={() => handleSelectCountry('TR', 'TR_VEHICLE')}
              className="group p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-red-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">🇹🇷</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    TRY (₺)
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition">
                    Türkiye
                  </h3>
                  <span className="text-xs text-slate-400">Katılım Finansmanı</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Taşıt Katılım Finansmanı (₺1.200.000 / 48 ay), Murabaha contract, TKBB compliance, and reducing balance profit rates.
                </p>
              </div>

              <button
                type="button"
                className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Enter Türkiye Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Azerbaijan Card */}
            <div
              onClick={() => handleSelectCountry('AZ', 'AZ_SME')}
              className="group p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">🇦🇿</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    AZN (₼)
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                    Azerbaijan
                  </h3>
                  <span className="text-xs text-slate-400">İslam Maliyyəsi & KOB</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  KOB Avadanlıq İcarəsi (₼100,000 / 36 ay), İcarə / AITAB structure, CBAR regulatory alignment, and business equipment lease.
                </p>
              </div>

              <button
                type="button"
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Enter Azerbaijan Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 D8 Capital • Digital Islamic Financing Marketplace Prototype</p>
        <p className="text-[11px] text-slate-600 max-w-2xl mx-auto px-4">
          All calculations, product rates, and provider materials are illustrative demo data for regulatory and management demonstration.
        </p>
      </footer>
    </div>
  );
};
