import React from 'react';
import { COUNTRIES_LIST } from '../data/countries';
import { DemoDataLabel } from './DemoDataLabel';
import { Globe2, ShieldCheck, Check, Settings2 } from 'lucide-react';

export const AdminCountriesPage: React.FC = () => {
  return (
    <div id="admin-countries-page" className="space-y-6 animate-fadeIn pb-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Jurisdiction & Regulatory Governance
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure D-8 member state regulatory frameworks, currency parameters, and category permissions (§3)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COUNTRIES_LIST.map((country) => (
          <div
            key={country.code}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{country.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">{country.localName}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 font-mono">
                  {country.currency} ({country.currencySymbol})
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Central Shariah Regulatory Body
                </span>
                <span className="font-semibold text-slate-800 block">
                  {country.regulatoryBody}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Regulatory Mandates
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {country.regulatoryFramework}
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Permitted Financing Categories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {country.activeCategories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Active Jurisdiction
              </span>
              <span className="font-mono text-slate-400">Max DSR: {(country.maxDsr * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
