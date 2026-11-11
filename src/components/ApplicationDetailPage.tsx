import React, { useState } from 'react';
import { FinancingApplication } from '../types';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { StatusBadge } from './StatusBadge';
import { CountryFlagBadge } from './CountryFlagBadge';
import { ApplicationTimeline } from './ApplicationTimeline';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import { formatCurrency, formatProfitRate } from '../services/calculator';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Building2,
  User,
  Clock,
  Download,
  FileText,
} from 'lucide-react';

interface ApplicationDetailPageProps {
  application: FinancingApplication;
  onBack: () => void;
  onViewActiveFinancing: () => void;
}

export const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = ({
  application,
  onBack,
  onViewActiveFinancing,
}) => {
  const { state, acceptOffer, declineOffer } = useDemoStore();
  const { t, locale } = useI18n();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get freshest app state from store
  const currentApp = state.applications.find((a) => a.id === application.id) || application;
  const isOfferIssued = currentApp.status === 'OFFER_ISSUED';
  const isAcceptedOrDisbursed = currentApp.status === 'ACCEPTED' || currentApp.status === 'DISBURSED';

  const handleAcceptOffer = () => {
    setIsProcessing(true);
    setTimeout(() => {
      acceptOffer(currentApp.id);
      setIsProcessing(false);
    }, 600);
  };

  const handleDeclineOffer = () => {
    declineOffer(currentApp.id);
  };

  return (
    <div id="application-detail-page" className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-24">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </button>

        <div className="flex items-center gap-2">
          <CountryFlagBadge country={currentApp.country} />
          <DemoDataLabel variant="badge" />
        </div>
      </div>

      {/* Main Header Dossier Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 block">
              Application ID: #{currentApp.applicationNumber}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              {currentApp.productName}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Provider: <strong>{currentApp.providerName}</strong> • Shariah Structure:{' '}
              <span className="font-semibold text-emerald-800">{currentApp.shariahStructure}</span>
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <StatusBadge status={currentApp.status} size="lg" />
            <span className="text-[11px] text-slate-400 font-mono">
              Submitted: {new Date(currentApp.submittedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* 8-Stage Visual Timeline Stepper */}
        <div className="py-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
            Application Lifecycle Stage
          </h3>
          <ApplicationTimeline
            currentStatus={currentApp.status}
            statusHistory={currentApp.statusHistory}
          />
        </div>
      </div>

      {/* SPECIAL OFFER ISSUED BANNER / LETTER (STEP 20 & 21) */}
      {isOfferIssued && currentApp.offer && (
        <div
          id="shariah-offer-banner"
          className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/80 space-y-6 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                  Official Financing Approval
                </span>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Shariah Financing Facility Offer Issued
                </h2>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
              Valid until: {new Date(currentApp.offer.validUntil).toLocaleDateString()}
            </span>
          </div>

          {/* Approved Terms Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Approved Amount</span>
              <span className="text-lg font-extrabold text-white font-mono mt-0.5 block">
                {formatCurrency(currentApp.offer.approvedAmount, currentApp.country, locale)}
              </span>
            </div>

            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Approved Profit Rate</span>
              <span className="text-lg font-extrabold text-amber-300 font-mono mt-0.5 block">
                {formatProfitRate(currentApp.offer.approvedProfitRate)}
              </span>
            </div>

            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Instalment</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono mt-0.5 block">
                {formatCurrency(currentApp.offer.monthlyInstalment, currentApp.country, locale)}
              </span>
            </div>

            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Approved Tenure</span>
              <span className="text-lg font-extrabold text-white mt-0.5 block">
                {currentApp.offer.approvedTenureYears} Years
              </span>
            </div>
          </div>

          {/* Shariah Conditions & Ibra' Terms */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Offer Conditions & Shariah Governance Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {currentApp.offer.specialConditions} This facility operates strictly under the approved{' '}
              <strong>{currentApp.shariahStructure}</strong> master agreement.
            </p>
          </div>

          {/* Digital Acceptance Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handleDeclineOffer}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              Decline Offer
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleAcceptOffer}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Executing Digital Contract...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Digital Acceptance (STEP 21)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ACCEPTED / ACTIVE BANNER (STEP 22) */}
      {isAcceptedOrDisbursed && (
        <div className="p-6 bg-emerald-50 border-2 border-emerald-500/50 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                Financing Contract Digitally Executed & Facility Active!
              </h3>
              <p className="text-xs text-emerald-800">
                Your Shariah financing facility is active with {currentApp.providerName}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onViewActiveFinancing}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>View Active Financing Account (STEP 22)</span>
            <FileText className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Application Details Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applicant Profile */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-700" />
            Applicant & Income Profile
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Legal Name</span>
              <span className="font-semibold text-slate-900">{currentApp.applicantName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Identification</span>
              <span className="font-mono font-semibold text-slate-900">{currentApp.applicantIdNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Declared Monthly Income</span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(currentApp.monthlyIncome, currentApp.country, locale)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Purpose of Financing</span>
              <span className="font-semibold text-slate-900">{currentApp.financingPurpose}</span>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-700" />
            Verified Dossier Documents
          </h4>
          <div className="space-y-2 text-xs">
            {currentApp.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="font-semibold text-slate-900 block">{doc.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regulatory Disclaimer */}
      <RegulatoryDisclaimer />
    </div>
  );
};
