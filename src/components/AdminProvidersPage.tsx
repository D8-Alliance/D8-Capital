import React from 'react';
import { PROVIDERS } from '../data/providers';
import { CountryFlagBadge } from './CountryFlagBadge';
import { DemoDataLabel } from './DemoDataLabel';
import { Building2, ShieldCheck, Check } from 'lucide-react';

export const AdminProvidersPage: React.FC = () => {
  return (
    <div id="admin-providers-page" className="space-y-6 animate-fadeIn pb-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Participating Islamic Financial Institutions
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered Islamic banks, Katılım banks, and non-bank Islamic financial institutions (§4)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs"
                    style={{
                      backgroundColor: provider.colorScheme.bg,
                      color: provider.colorScheme.primary,
                      border: `1px solid ${provider.colorScheme.border}`,
                    }}
                  >
                    {provider.logoText}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{provider.name}</h3>
                    <span className="text-xs text-slate-400 font-semibold">{provider.type}</span>
                  </div>
                </div>

                <CountryFlagBadge country={provider.country} showCurrency={false} />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Shariah Supervisory Board
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {provider.shariahBoardSummary}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Licensed Islamic Institution
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
