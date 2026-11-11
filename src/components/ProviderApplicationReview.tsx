import React, { useState } from 'react';
import { FinancingApplication } from '../types';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { StatusBadge } from './StatusBadge';
import { CountryFlagBadge } from './CountryFlagBadge';
import { CurrencyInput } from './CurrencyInput';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import { calculateFinancing, formatCurrency, formatProfitRate } from '../services/calculator';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Building,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

interface ProviderApplicationReviewProps {
  application: FinancingApplication;
  onBack: () => void;
  onOfferIssued: () => void;
}

export const ProviderApplicationReview: React.FC<ProviderApplicationReviewProps> = ({
  application,
  onBack,
  onOfferIssued,
}) => {
  const { state, issueOffer, updateApplicationStatus } = useDemoStore();
  const { t, locale } = useI18n();

  const currentApp = state.applications.find((a) => a.id === application.id) || application;

  // Offer Form state
  const [approvedAmount, setApprovedAmount] = useState<number>(currentApp.requestedAmount);
  const [approvedRate, setApprovedRate] = useState<number>(currentApp.estimatedProfitRate || 0.045);
  const [approvedTenure, setApprovedTenure] = useState<number>(currentApp.requestedTenureYears);
  const [validityDays, setValidityDays] = useState<number>(14);
  const [specialConditions, setSpecialConditions] = useState<string>(
    'Subject to execution of standard Tawarruq commodity sale agency agreement and salary auto-debit assignment.'
  );

  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  // Recalculate based on offer parameters
  const offerCalc = calculateFinancing(
    approvedAmount,
    approvedRate,
    approvedTenure,
    currentApp.rateMethod
  );

  // DSR calculation
  const monthlyIncome = currentApp.applicantKyc?.monthlyIncome || 5000;
  const existingCommitments = currentApp.applicantKyc?.existingCommitments || 0;
  const totalCommitments = existingCommitments + offerCalc.monthlyInstalment;
  const dsr = monthlyIncome > 0 ? (totalCommitments / monthlyIncome) * 100 : 0;

  const handleIssueOffer = () => {
    setIsSubmittingOffer(true);
    setTimeout(() => {
      const validUntilDate = new Date();
      validUntilDate.setDate(validUntilDate.getDate() + validityDays);

      issueOffer(currentApp.id, {
        applicationId: currentApp.id,
        providerId: currentApp.providerId,
        providerName: currentApp.providerName,
        offeredAmount: approvedAmount,
        approvedProfitRate: approvedRate,
        rateMethod: currentApp.rateMethod,
        tenureYears: approvedTenure,
        monthlyInstalment: offerCalc.monthlyInstalment,
        totalRepayment: offerCalc.totalPayable,
        totalProfit: offerCalc.totalProfit,
        shariahStructure: currentApp.shariahStructure,
        validUntil: validUntilDate.toISOString(),
        termsAndConditions: [
          specialConditions,
          'Shariah governance under Bank Negara Malaysia SAC / TKBB Standards.',
        ],
        takafulContribution: Math.round(approvedAmount * 0.012),
      });

      setIsSubmittingOffer(false);
      onOfferIssued();
    }, 600);
  };

  const handleRequestMoreInfo = () => {
    updateApplicationStatus(
      currentApp.id,
      'ADDITIONAL_INFO_REQUIRED',
      'Additional 3 months bank statements requested.'
    );
    onBack();
  };

  const handleReject = () => {
    updateApplicationStatus(
      currentApp.id,
      'REJECTED',
      'Debt Service Ratio exceeds institution policy limit.'
    );
    onBack();
  };

  return (
    <div id="provider-application-review" className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <CountryFlagBadge country={currentApp.country} />
          <DemoDataLabel variant="badge" />
        </div>
      </div>

      {/* Main Dossier Overview Card (STEP 17) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400">
              Dossier Assessment: #{currentApp.applicationNumber}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              {currentApp.userName || currentApp.applicantKyc?.fullName}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Facility: <strong>{currentApp.productName}</strong> ({currentApp.shariahStructure})
            </p>
          </div>

          <StatusBadge status={currentApp.status} size="lg" />
        </div>

        {/* Applicant Metrics & Risk Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Requested Amount</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono mt-0.5 block">
              {formatCurrency(currentApp.requestedAmount, currentApp.country, locale)}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Income</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono mt-0.5 block">
              {formatCurrency(monthlyIncome, currentApp.country, locale)}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated DSR</span>
            <span
              className={`text-lg font-extrabold font-mono mt-0.5 block ${
                dsr <= 60 ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {dsr.toFixed(1)}%
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Shariah Compliance</span>
            <span className="text-xs font-bold text-emerald-800 mt-1 block flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Structure
            </span>
          </div>
        </div>

        {/* Uploaded Verification Documents */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-700" />
            Applicant Verified Documentation ({currentApp.documents.length} Files)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {currentApp.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-blue-50/40 rounded-xl border border-blue-200/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-700" />
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

      {/* FORM: Issue Shariah Financing Offer (STEP 18) */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
              Step 18 Action
            </span>
            <h3 className="text-lg font-bold text-white">
              Issue Shariah Financing Facility Offer
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Approved Facility Amount
            </label>
            <CurrencyInput
              id="offer-amount"
              value={approvedAmount}
              onChange={setApprovedAmount}
              country={currentApp.country}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Approved Profit Rate (% p.a.)
            </label>
            <input
              type="number"
              step={0.1}
              value={(approvedRate * 100).toFixed(2)}
              onChange={(e) => setApprovedRate(parseFloat(e.target.value) / 100 || 0.01)}
              className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 px-3 text-sm font-bold text-white font-mono focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Approved Tenure (Years)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={approvedTenure}
              onChange={(e) => setApprovedTenure(parseInt(e.target.value) || 1)}
              className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 px-3 text-sm font-bold text-white font-mono focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Special Shariah Conditions / Stipulations
            </label>
            <input
              type="text"
              value={specialConditions}
              onChange={(e) => setSpecialConditions(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 px-3 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Real-time Offer Preview */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300">Resulting Monthly Instalment</span>
            <div className="text-xl font-extrabold text-white font-mono">
              {formatCurrency(offerCalc.monthlyInstalment, currentApp.country, locale)}
            </div>
          </div>
          <div className="text-right text-slate-300 font-mono">
            <span>Total Payable: {formatCurrency(offerCalc.totalPayable, currentApp.country, locale)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRequestMoreInfo}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Request Info</span>
            </button>

            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer"
            >
              Reject
            </button>
          </div>

          <button
            type="button"
            disabled={isSubmittingOffer}
            onClick={handleIssueOffer}
            className="w-full sm:w-auto px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold rounded-xl transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmittingOffer ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Generating Offer...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Issue Financing Offer to Customer (STEP 18)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <RegulatoryDisclaimer compact />
    </div>
  );
};
