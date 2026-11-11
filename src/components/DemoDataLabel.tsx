import React from 'react';
import { useI18n } from '../i18n';

interface DemoDataLabelProps {
  className?: string;
  variant?: 'subtle' | 'badge' | 'banner';
}

export const DemoDataLabel: React.FC<DemoDataLabelProps> = ({ className = '', variant = 'subtle' }) => {
  const { t } = useI18n();

  if (variant === 'badge') {
    return (
      <span
        id="demo-data-badge"
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#c4a67e]/10 text-[#c4a67e] border border-[#c4a67e]/30 tracking-wider uppercase ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#c4a67e] animate-pulse"></span>
        {t('common.demoLabel')}
      </span>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        id="demo-data-banner"
        className={`bg-[#c4a67e]/10 border border-[#c4a67e]/20 rounded-lg p-2.5 text-xs text-[#c4a67e] flex items-center justify-between ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="inline-block px-1.5 py-0.5 bg-[#c4a67e] text-black font-mono rounded text-[10px] font-bold">
            DEMO
          </span>
          <span className="text-white/80">{t('common.illustrativeData')}</span>
        </div>
        <span className="text-[11px] text-white/40">{t('common.securityPrototype')}</span>
      </div>
    );
  }

  return (
    <span
      id="demo-data-label"
      className={`text-[11px] font-medium text-white/40 flex items-center gap-1.5 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#c4a67e]"></span>
      {t('common.demoLabel')}
    </span>
  );
};
