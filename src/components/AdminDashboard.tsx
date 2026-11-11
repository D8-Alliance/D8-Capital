import React from 'react';
import { useDemoStore } from '../store/DemoStore';
import { COUNTRIES_LIST } from '../data/countries';
import { PRODUCTS } from '../data/products';
import { PROVIDERS } from '../data/providers';
import { DemoDataLabel } from './DemoDataLabel';
import { StatusBadge } from './StatusBadge';
import { CountryFlagBadge } from './CountryFlagBadge';
import {
  ShieldAlert,
  Globe2,
  Building2,
  Package,
  FileText,
  Activity,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { state } = useDemoStore();

  const totalApps = state.applications.length;
  const totalProducts = PRODUCTS.length;
  const totalProviders = PROVIDERS.length;
  const totalAuditLogs = state.auditLogs.length;

  return (
    <div id="admin-dashboard" className="space-y-8 animate-fadeIn pb-24">
      {/* Admin Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-purple-300 tracking-wider">
                Marketplace Administration Portal (§15)
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
                D8 Capital Platform Governance
              </h1>
            </div>
          </div>

          <DemoDataLabel variant="badge" className="bg-purple-900/80 text-purple-200 border-purple-700" />
        </div>

        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Manage member state jurisdictions, configure participating Shariah financial institutions, oversee product catalogues, and inspect regulatory audit trails.
        </p>
      </div>

      {/* Cross-Border Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('countries')}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-1 hover:border-purple-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Jurisdictions</span>
            <Globe2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {COUNTRIES_LIST.length} Active
          </div>
          <span className="text-[11px] text-purple-700 font-semibold">MY, TR, AZ Live</span>
        </div>

        <div
          onClick={() => onNavigateTab('providers')}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-1 hover:border-purple-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Institutions</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {totalProviders}
          </div>
          <span className="text-[11px] text-blue-700 font-semibold">Islamic & Katılım Banks</span>
        </div>

        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-1 hover:border-purple-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Financing Facilities</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {totalProducts}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Shariah Verified</span>
        </div>

        <div
          onClick={() => onNavigateTab('auditLogs')}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-1 hover:border-purple-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Audit Events</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {totalAuditLogs}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold">Immutable Logs</span>
        </div>
      </div>

      {/* Recent Platform Activity & Audit Trail Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications across all jurisdictions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-700" />
              Cross-Jurisdiction Financing Applications
            </h3>
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {state.applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500">#{app.applicationNumber}</span>
                    <CountryFlagBadge country={app.country} showCurrency={false} />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-0.5">{app.userName || app.applicantKyc?.fullName}</h4>
                  <span className="text-slate-500 text-[11px]">{app.productName}</span>
                </div>
                <StatusBadge status={app.status} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Live Audit Log Stream */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-700" />
              Real-Time Governance Audit Trail
            </h3>
            <button
              onClick={() => onNavigateTab('auditLogs')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900"
            >
              Full Trail
            </button>
          </div>

          <div className="space-y-2.5">
            {state.auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-purple-50/30 rounded-xl border border-purple-100 flex items-start gap-3 text-xs"
              >
                <span className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0"></span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
