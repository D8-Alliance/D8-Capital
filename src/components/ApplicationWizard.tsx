import React, { useState } from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { PRODUCTS } from '../data/products';
import { PROVIDERS } from '../data/providers';
import { COUNTRIES } from '../data/countries';
import { FinancingProduct, ApplicationDocument } from '../types';
import { calculateFinancing, formatCurrency, formatProfitRate } from '../services/calculator';
import { CurrencyInput } from './CurrencyInput';
import { FormField } from './FormField';
import { DocumentUploadRow } from './DocumentUploadRow';
import { DemoDataLabel } from './DemoDataLabel';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Building,
  User,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface ApplicationWizardProps {
  initialProduct?: FinancingProduct;
  initialAmount?: number;
  initialTenure?: number;
  onCompleted: (appId: string) => void;
  onCancel: () => void;
}

export const ApplicationWizard: React.FC<ApplicationWizardProps> = ({
  initialProduct,
  initialAmount,
  initialTenure,
  onCompleted,
  onCancel,
}) => {
  const { state, createApplication } = useDemoStore();
  const { t, locale } = useI18n();

  const countryConfig = COUNTRIES[state.activeCountry] || COUNTRIES.MY;
  const countryProducts = PRODUCTS.filter((p) => p.country === state.activeCountry);

  // Wizard Step State (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedProduct, setSelectedProduct] = useState<FinancingProduct>(
    initialProduct || countryProducts[0]
  );
  const [amount, setAmount] = useState<number>(
    initialAmount || (state.activeCountry === 'MY' ? 50000 : state.activeCountry === 'TR' ? 1200000 : 100000)
  );
  const [tenureYears, setTenureYears] = useState<number>(
    initialTenure || (state.activeCountry === 'MY' ? 7 : state.activeCountry === 'TR' ? 4 : 3)
  );
  const [financingPurpose, setFinancingPurpose] = useState<string>(
    state.activeCountry === 'MY'
      ? 'Home Renovation & Educational Needs'
      : state.activeCountry === 'TR'
      ? 'Commercial Vehicle Upgrade'
      : 'Bakery Expansion Equipment'
  );

  // Step 2: KYC Details (Prefilled with Demo User)
  const [fullName, setFullName] = useState(state.activeUser.name);
  const [idNumber, setIdNumber] = useState(state.activeUser.idNumber || '880512-14-5541');
  const [monthlyIncome, setMonthlyIncome] = useState(state.activeUser.monthlyIncome || 6500);
  const [employerOrCompany, setEmployerOrCompany] = useState(state.activeUser.employerOrCompany || 'PetroTech Global Sdn Bhd');
  const [email, setEmail] = useState(state.activeUser.email);
  const [phone, setPhone] = useState(state.activeUser.phone || '+60 12-345 6789');

  // Step 3: Documents Uploaded
  const [uploadedDocs, setUploadedDocs] = useState<ApplicationDocument[]>([
    {
      id: 'doc-1',
      name: `${state.activeCountry}_National_ID_Scan.pdf`,
      type: 'IDENTITY',
      uploadedAt: new Date().toISOString(),
      fileSize: '1.4 MB',
      status: 'VERIFIED',
    },
    {
      id: 'doc-2',
      name: 'Salary_Slip_Latest_3_Months.pdf',
      type: 'INCOME_PROOF',
      uploadedAt: new Date().toISOString(),
      fileSize: '2.1 MB',
      status: 'VERIFIED',
    },
  ]);

  // Step 4: Terms agreed
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const calc = calculateFinancing(
    amount,
    selectedProduct.annualProfitRate,
    tenureYears,
    selectedProduct.rateMethod
  );

  const provider = PROVIDERS.find((p) => p.id === selectedProduct.providerId);

  const handleAddDoc = (docData: { name: string; type: string; fileSize: string; status: 'VERIFIED' | 'PENDING' }) => {
    const newDoc: ApplicationDocument = {
      id: `doc-${Date.now()}`,
      name: docData.name,
      type: docData.type,
      uploadedAt: new Date().toISOString(),
      fileSize: docData.fileSize,
      status: docData.status,
    };
    setUploadedDocs((prev) => [...prev, newDoc]);
  };

  const handleRemoveDoc = (id: string) => {
    setUploadedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = () => {
    if (!termsAgreed) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const existingDebt = state.activeCountry === 'MY' ? 1800 : state.activeCountry === 'TR' ? 25000 : 1200;
      const totalCommitments = existingDebt + calc.monthlyInstalment;
      const calculatedDsr = monthlyIncome > 0 ? (totalCommitments / monthlyIncome) * 100 : 35;

      const newApp = createApplication({
        scenarioId: state.activeScenario,
        country: state.activeCountry,
        userId: state.activeUser.id,
        userName: fullName,
        userEmail: email,
        userPhone: phone,
        userType: state.activeUser.type,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        providerId: selectedProduct.providerId,
        providerName: provider?.name || 'Islamic Financial Institution',
        category: selectedProduct.category,
        shariahStructure: selectedProduct.shariahStructure,
        rateMethod: selectedProduct.rateMethod,
        requestedAmount: amount,
        requestedTenureYears: tenureYears,
        estimatedProfitRate: selectedProduct.annualProfitRate,
        estimatedMonthlyInstalment: calc.monthlyInstalment,
        purpose: financingPurpose,
        status: 'SUBMITTED',
        applicantKyc: {
          fullName,
          idType: 'National ID / Passport',
          idNumber,
          dateOfBirth: '1988-05-12',
          nationality: countryConfig.name,
          address: 'No. 24, Jalan Bukit Bintang, Kuala Lumpur',
          employmentType: 'Private Sector Executive',
          employerName: employerOrCompany,
          monthlyIncome,
          existingCommitments: existingDebt,
          calculatedDsr: Number(calculatedDsr.toFixed(1)),
          eligibilityStatus: calculatedDsr <= 60 ? 'POTENTIALLY_ELIGIBLE' : 'ADDITIONAL_INFO_REQUIRED',
        },
        documents: uploadedDocs,
      });

      setIsSubmitting(false);
      onCompleted(newApp.id);
    }, 800);
  };

  return (
    <div id="application-wizard" className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-24">
      {/* Wizard Step Indicator */}
      <div className="bg-[#111111] rounded-2xl p-6 border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-[#c4a67e] tracking-tight">
              Shariah Financing Application Wizard
            </h2>
            <p className="text-xs text-white/40">
              {countryConfig.name} • {selectedProduct.name}
            </p>
          </div>
          <DemoDataLabel variant="badge" />
        </div>

        {/* Stepper Dots */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {[
            { num: 1, label: 'Facility Details' },
            { num: 2, label: 'e-KYC Profile' },
            { num: 3, label: 'Documents' },
            { num: 4, label: 'Review & Submit' },
          ].map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="space-y-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-[#c4a67e]'
                      : 'bg-white/10'
                  }`}
                />
                <span
                  className={`text-[11px] font-mono block ${
                    isCurrent ? 'text-[#c4a67e] font-bold' : 'text-white/40'
                  }`}
                >
                  {s.num}. {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Facility Details */}
      {currentStep === 1 && (
        <div className="bg-[#111111] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6 animate-fadeIn">
          <h3 className="text-base font-serif-luxury font-bold text-[#c4a67e] flex items-center gap-2.5">
            <Building className="w-5 h-5 text-[#c4a67e]" />
            Step 1: Select Facility & Financing Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField id="select-product" label="Financing Product" required>
              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const p = countryProducts.find((item) => item.id === e.target.value);
                  if (p) setSelectedProduct(p);
                }}
                className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 px-3 text-xs font-semibold text-white focus:border-[#c4a67e] focus:outline-none"
              >
                {countryProducts.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#141414] text-white">
                    {p.name} ({p.shariahStructure} • {formatProfitRate(p.annualProfitRate)})
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id="financing-purpose" label="Financing Purpose" required>
              <input
                type="text"
                value={financingPurpose}
                onChange={(e) => setFinancingPurpose(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 px-3 text-xs font-semibold text-white placeholder:text-white/30 focus:border-[#c4a67e] focus:outline-none"
                placeholder="e.g. Asset Purchase, Working Capital"
              />
            </FormField>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-white/70 uppercase tracking-wider mb-2">
                Requested Financing Amount
              </label>
              <CurrencyInput
                id="req-amount"
                value={amount}
                onChange={setAmount}
                country={state.activeCountry}
                min={selectedProduct.minAmount}
                max={selectedProduct.maxAmount}
                step={5000}
              />
              <span className="text-[10px] text-white/40 mt-1 block font-mono">
                Permissible range: {formatCurrency(selectedProduct.minAmount, state.activeCountry, locale)} – {formatCurrency(selectedProduct.maxAmount, state.activeCountry, locale)}
              </span>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-medium text-white/70 uppercase tracking-wider">
                  Financing Tenure: <span className="text-[#c4a67e] font-mono font-bold">{tenureYears} Years</span>
                </label>
              </div>
              <input
                type="range"
                min={selectedProduct.minTenureYears}
                max={selectedProduct.maxTenureYears}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(parseInt(e.target.value))}
                className="w-full accent-[#c4a67e] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="p-4 bg-[#141414] border border-white/10 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-[#c4a67e]">Estimated Monthly Instalment</span>
              <div className="text-2xl font-bold text-white font-mono">
                {formatCurrency(calc.monthlyInstalment, state.activeCountry, locale)}
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="text-white/40 block">Total Profit: {formatCurrency(calc.totalProfit, state.activeCountry, locale)}</span>
              <span className="font-bold text-[#c4a67e] block">Total Payable: {formatCurrency(calc.totalPayable, state.activeCountry, locale)}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-xs font-medium text-white/50 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-[#c4a67e] hover:bg-[#d4b890] text-black text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Continue to e-KYC</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: e-KYC / KYB Profile */}
      {currentStep === 2 && (
        <div className="bg-[#111111] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif-luxury font-bold text-[#c4a67e] flex items-center gap-2.5">
              <User className="w-5 h-5 text-[#c4a67e]" />
              Step 2: Applicant Identity & Employment Verification (e-KYC)
            </h3>
            <span className="text-[10px] uppercase font-mono font-bold bg-[#c4a67e]/15 text-[#c4a67e] border border-[#c4a67e]/30 px-2 py-0.5 rounded">
              Demo Prefilled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <FormField id="applicant-name" label="Full Legal Name" required>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 px-3 font-semibold text-white focus:border-[#c4a67e] focus:outline-none"
              />
            </FormField>

            <FormField id="applicant-id" label="National ID / Passport Number" required>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 px-3 font-semibold font-mono text-white focus:border-[#c4a67e] focus:outline-none"
              />
            </FormField>

            <FormField id="applicant-income" label="Monthly Gross Income" required>
              <CurrencyInput
                id="applicant-income-input"
                value={monthlyIncome}
                onChange={setMonthlyIncome}
                country={state.activeCountry}
              />
            </FormField>

            <FormField id="applicant-employer" label="Employer / Company Name" required>
              <input
                type="text"
                value={employerOrCompany}
                onChange={(e) => setEmployerOrCompany(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 px-3 font-semibold text-white focus:border-[#c4a67e] focus:outline-none"
              />
            </FormField>

            <FormField id="applicant-email" label="Email Address" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 px-3 font-semibold text-white focus:border-[#c4a67e] focus:outline-none"
              />
            </FormField>

            <FormField id="applicant-phone" label="Mobile Phone Number" required>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#141414] py-2.5 px-3 font-semibold font-mono text-white focus:border-[#c4a67e] focus:outline-none"
              />
            </FormField>
          </div>

          <div className="flex justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 text-xs font-medium text-white/50 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-[#c4a67e] hover:bg-[#d4b890] text-black text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Continue to Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Document Uploads */}
      {currentStep === 3 && (
        <div className="bg-[#111111] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-serif-luxury font-bold text-[#c4a67e] flex items-center gap-2.5">
              <UploadCloud className="w-5 h-5 text-[#c4a67e]" />
              Step 3: Upload Supporting Documents
            </h3>
            <p className="text-xs text-white/40 mt-1">
              Required for institutional credit assessment under {countryConfig.name} banking regulations.
            </p>
          </div>

          <div className="space-y-3">
            {selectedProduct.requiredDocumentsSummary.map((docName, idx) => {
              const existing = uploadedDocs.find((d) => d.name.toLowerCase().includes(docName.toLowerCase().split(' ')[0]));
              return (
                <DocumentUploadRow
                  key={idx}
                  documentName={docName}
                  categoryName="Institutional Verification"
                  existingDoc={existing}
                  onUpload={(doc) => handleAddDoc(doc)}
                  onRemove={() => existing && handleRemoveDoc(existing.id)}
                />
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 text-xs font-medium text-white/50 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-[#c4a67e] hover:bg-[#d4b890] text-black text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Review & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Submit */}
      {currentStep === 4 && (
        <div className="bg-[#111111] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-serif-luxury font-bold text-[#c4a67e] flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-[#c4a67e]" />
              Step 4: Shariah Governance Review & Submission
            </h3>
            <p className="text-xs text-white/40 mt-1">
              Please verify all details before submitting to the participating Islamic institution.
            </p>
          </div>

          {/* Dossier Summary Bento */}
          <div className="p-5 bg-[#141414] rounded-xl border border-white/10 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-white/40 block">Facility Name</span>
                <span className="font-bold text-white block mt-0.5">{selectedProduct.name}</span>
                <span className="text-[10px] text-[#c4a67e] font-mono font-semibold">{selectedProduct.shariahStructure}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-white/40 block">Financing Provider</span>
                <span className="font-bold text-white block mt-0.5">{provider?.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-white/40 block">Facility Amount</span>
                <span className="font-bold text-white font-mono text-sm block mt-0.5">
                  {formatCurrency(amount, state.activeCountry, locale)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-white/40 block">Monthly Instalment</span>
                <span className="font-bold text-[#c4a67e] font-mono text-sm block mt-0.5">
                  {formatCurrency(calc.monthlyInstalment, state.activeCountry, locale)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-xs text-white/60 flex items-center justify-between">
              <span>Applicant: <strong className="text-white">{fullName}</strong> ({idNumber})</span>
              <span>Documents Attached: <strong className="text-[#c4a67e]">{uploadedDocs.length} Verified Scans</strong></span>
            </div>
          </div>

          {/* Shariah Compliance Declarations */}
          <div className="p-4 bg-[#141414] border border-[#c4a67e]/30 rounded-xl space-y-2 text-xs text-white/80">
            <div className="flex items-center gap-2 font-bold text-[#c4a67e]">
              <ShieldCheck className="w-4 h-4 text-[#c4a67e]" />
              <span>Shariah Contract & Governance Declarations</span>
            </div>
            <p className="text-[11px] leading-relaxed text-white/60">
              I acknowledge that this financing arrangement is executed under the principle of{' '}
              <strong className="text-[#c4a67e]">{selectedProduct.shariahStructure}</strong> and complies with the Shariah governance resolutions of{' '}
              {countryConfig.regulatoryBody}. In case of early settlement, Ibra' (rebate) will be granted as per institutional policy.
            </p>
            <label className="flex items-start gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 accent-[#c4a67e] w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-xs text-white/80">
                I confirm the accuracy of the information provided and authorize the participating institution to perform requisite credit and Shariah assessment checks.
              </span>
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 text-xs font-medium text-white/50 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={!termsAgreed || isSubmitting}
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#c4a67e] hover:bg-[#d4b890] disabled:opacity-40 text-black text-xs font-bold rounded-lg transition flex items-center gap-2 cursor-pointer shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>Transmitting to Provider Queue...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Submit Financing Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Regulatory Disclaimer */}
      <RegulatoryDisclaimer compact />
    </div>
  );
};
