import React from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { DemoScenarioId, DemoRole } from '../types';
import {
  X,
  Play,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  User,
  Building2,
  ChevronRight,
} from 'lucide-react';

interface DemoFlowMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStep: (stepNumber: number, targetTab: string, role?: DemoRole) => void;
}

const STEPS_22 = [
  { step: 1, title: 'Open D8 Capital Marketplace', role: 'CUSTOMER', tab: 'landing', desc: 'Welcome screen and country selection.' },
  { step: 2, title: 'Select Malaysia Jurisdiction', role: 'CUSTOMER', tab: 'landing', desc: 'Sets currency to MYR/RM and loads SAC-compliant products.' },
  { step: 3, title: 'Login as Demo Customer', role: 'CUSTOMER', tab: 'dashboard', desc: 'Ahmad Faiz bin Ibrahim individual profile.' },
  { step: 4, title: 'Select Personal Financing-i', role: 'CUSTOMER', tab: 'financing', desc: 'Filter catalogue for Islamic personal financing.' },
  { step: 5, title: 'Enter RM50,000 Requirement', role: 'CUSTOMER', tab: 'calculator', desc: 'Set tenure to 7 years.' },
  { step: 6, title: 'Run Indicative Eligibility', role: 'CUSTOMER', tab: 'eligibility', desc: 'DSR calculation and transparent assessment factors.' },
  { step: 7, title: 'Compare Financing Products', role: 'CUSTOMER', tab: 'compare', desc: 'Evaluate 5 Shariah products side-by-side.' },
  { step: 8, title: 'Select One Product (e.g. Al-Taysir)', role: 'CUSTOMER', tab: 'financing', desc: 'Provider A Tawarruq Personal Financing-i.' },
  { step: 9, title: 'View Financing Calculator & PDS', role: 'CUSTOMER', tab: 'calculator', desc: 'Examine Product Disclosure Sheet (PDS) & monthly RM 786.31.' },
  { step: 10, title: 'Start Application Wizard', role: 'CUSTOMER', tab: 'application', desc: 'Step 1: Facility amount and tenure.' },
  { step: 11, title: 'Complete e-KYC Identity Verification', role: 'CUSTOMER', tab: 'application', desc: 'Step 2: NRIC, income, employer information.' },
  { step: 12, title: 'Upload Demo Documents', role: 'CUSTOMER', tab: 'application', desc: 'Step 3: Payslips, EPF statement, MyKad scans.' },
  { step: 13, title: 'Submit Application', role: 'CUSTOMER', tab: 'application', desc: 'Step 4: Confirm and dispatch to provider queue.' },
  { step: 14, title: 'Show Application Tracking Timeline', role: 'CUSTOMER', tab: 'applications', desc: 'Live status: Application Submitted.' },
  { step: 15, title: 'Switch to Demo Provider', role: 'PROVIDER', tab: 'dashboard', desc: 'Switch role via Demo Control Bar.' },
  { step: 16, title: 'Show Application in Provider Queue', role: 'PROVIDER', tab: 'applications', desc: 'Application appears immediately in New queue.' },
  { step: 17, title: 'Review Application & Documents', role: 'PROVIDER', tab: 'appReview', desc: 'Examine KYC dossier, DSR ratio, and documents.' },
  { step: 18, title: 'Issue Formal Financing Offer', role: 'PROVIDER', tab: 'appReview', desc: 'Approve RM50,000 at 4.50% p.a. Tawarruq terms.' },
  { step: 19, title: 'Switch Back to Customer', role: 'CUSTOMER', tab: 'applications', desc: 'Switch role via Demo Control Bar.' },
  { step: 20, title: 'Show Financing Offer Banner', role: 'CUSTOMER', tab: 'applications', desc: 'Offer received notification and acceptance dialog.' },
  { step: 21, title: 'Accept Financing Offer', role: 'CUSTOMER', tab: 'applications', desc: 'Execute digital acceptance of Shariah terms.' },
  { step: 22, title: 'Show Active Financing Account', role: 'CUSTOMER', tab: 'myFinancing', desc: 'Facility active with repayment schedule and Ibra\' info.' },
];

export const DemoFlowMapModal: React.FC<DemoFlowMapModalProps> = ({
  isOpen,
  onClose,
  onNavigateToStep,
}) => {
  const { state, setScenario, setRole } = useDemoStore();
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        id="demo-flow-map-modal"
        className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                D8 Capital — Management Demo Flow Map & Sequence Guide
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing the 3 Country Journeys and STEP 1–22 Clickable Sequence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 text-xs text-slate-700">
          {/* Section 1: Three Isolated Scenarios High-Level Flow */}
          <div>
            <h4 className="font-extrabold uppercase tracking-wider text-slate-900 text-xs mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Three Isolated Country Demo Scenarios (§8 & §20)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Malaysia Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  state.activeScenario === 'MY_PERSONAL'
                    ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base">🇲🇾 <strong>Malaysia (Primary Demo)</strong></span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                    MYR (RM)
                  </span>
                </div>
                <p className="text-slate-600 mb-3 text-[11px]">
                  <strong>Personal Financing-i</strong> (RM50,000 / 7 yrs / Tawarruq / Flat rate). Complete customer-to-provider handoff.
                </p>
                <div className="space-y-1 text-[11px] text-slate-500 font-mono">
                  <p>• Discovery → Eligibility → Comparison</p>
                  <p>• PDS Sheet → e-KYC → Uploads</p>
                  <p>• Provider Offer → Customer Acceptance</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setScenario('MY_PERSONAL');
                    setRole('CUSTOMER');
                    onClose();
                  }}
                  className="mt-3 w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition text-xs"
                >
                  Activate Malaysia Scenario
                </button>
              </div>

              {/* Türkiye Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  state.activeScenario === 'TR_VEHICLE'
                    ? 'bg-red-50/60 border-red-500 ring-2 ring-red-500/20'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base">🇹🇷 <strong>Türkiye (Katılım)</strong></span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-100 text-red-800 font-bold">
                    TRY (₺)
                  </span>
                </div>
                <p className="text-slate-600 mb-3 text-[11px]">
                  <strong>Taşıt Katılım Finansmanı</strong> (₺1.200.000 / 48 ay / Murabaha / Azalan Bakiye).
                </p>
                <div className="space-y-1 text-[11px] text-slate-500 font-mono">
                  <p>• Araç Bedeli & Peşinat Hesaplama</p>
                  <p>• TKBB Uyumlu Kâr Payı Oranları</p>
                  <p>• Katılım Bankası Teklif Yönetimi</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setScenario('TR_VEHICLE');
                    setRole('CUSTOMER');
                    onClose();
                  }}
                  className="mt-3 w-full py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold transition text-xs"
                >
                  Activate Türkiye Scenario
                </button>
              </div>

              {/* Azerbaijan Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  state.activeScenario === 'AZ_SME'
                    ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base">🇦🇿 <strong>Azerbaijan (SME)</strong></span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 text-blue-800 font-bold">
                    AZN (₼)
                  </span>
                </div>
                <p className="text-slate-600 mb-3 text-[11px]">
                  <strong>KOB Avadanlıq İcarəsi (AITAB)</strong> (₼100,000 / 36 ay / İcarə / Reducing).
                </p>
                <div className="space-y-1 text-[11px] text-slate-500 font-mono">
                  <p>• Biznes Profili & KYB VÖEN</p>
                  <p>• Avadanlıq İnvoys və Maliyyə Analizi</p>
                  <p>• Şəriət Maliyyələşmə Qərarı</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setScenario('AZ_SME');
                    setRole('CUSTOMER');
                    onClose();
                  }}
                  className="mt-3 w-full py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition text-xs"
                >
                  Activate Azerbaijan Scenario
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: STEP 1–22 Interactive Clickable Sequence */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-900 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Official STEP 1–22 Management Demo Walkthrough (§21)
              </h4>
              <span className="text-[11px] text-slate-500">
                Click any step to jump straight to its active screen!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto p-1">
              {STEPS_22.map((s) => (
                <div
                  key={s.step}
                  onClick={() => {
                    onNavigateToStep(s.step, s.tab, s.role as DemoRole);
                    onClose();
                  }}
                  className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition cursor-pointer flex items-start gap-2.5 group"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-900 group-hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {s.step}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs group-hover:text-emerald-950">
                        {s.title}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          s.role === 'PROVIDER'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {s.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{s.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0 self-center" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            HC-1 to HC-7 Compliant • D8 Capital Prototype Architecture
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
