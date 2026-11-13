import React from 'react';
import { useI18n } from '../i18n';
import { ShieldCheck, Info } from 'lucide-react';

interface RegulatoryDisclaimerProps {
  className?: string;
  compact?: boolean;
}

export const RegulatoryDisclaimer: React.FC<RegulatoryDisclaimerProps> = ({ className = '', compact = false }) => {
  const { t } = useI18n();

  if (compact) {
    return (
      <div
        id="regulatory-disclaimer-compact"
        className={`p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5 ${className}`}
      >
        <Info className="w-4 h-4 text-[#8a6a3a] shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t('common.disclaimer')}</p>
      </div>
    );
  }

  return (
    <div
      id="regulatory-disclaimer"
      className={`p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-3 shadow-lg ${className}`}
    >
      <div className="p-2 rounded-lg bg-stone-50 border border-[#c4a67e]/30 text-[#8a6a3a] shrink-0">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-[#8a6a3a] uppercase tracking-wider text-[10px]">
            Shariah Governance & Regulatory Transparency
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded font-mono">
            Demo Environment
          </span>
        </div>
        <p className="leading-relaxed text-slate-500">{t('common.disclaimer')}</p>
      </div>
    </div>
  );
};
