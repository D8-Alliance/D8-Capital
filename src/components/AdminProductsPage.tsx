import React from 'react';
import { PRODUCTS } from '../data/products';
import { PROVIDERS } from '../data/providers';
import { DemoDataLabel } from './DemoDataLabel';
import { CountryFlagBadge } from './CountryFlagBadge';
import { formatProfitRate } from '../services/calculator';
import { Package, ShieldCheck, Star } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  return (
    <div id="admin-products-page" className="space-y-6 animate-fadeIn pb-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Shariah Products Catalogue Directory
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized listing of all approved Islamic financing facilities across member states
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Shariah Principle</th>
                <th className="py-3 px-4">Profit Rate</th>
                <th className="py-3 px-4">Calculation Method</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PRODUCTS.map((prod) => {
                const provider = PROVIDERS.find((p) => p.id === prod.providerId);
                return (
                  <tr key={prod.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <CountryFlagBadge country={prod.country} showCurrency={false} />
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        {prod.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                        <span>{prod.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{provider?.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {prod.shariahStructure}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {formatProfitRate(prod.annualProfitRate)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 uppercase text-[10px]">
                      {prod.rateMethod}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active Verified
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
