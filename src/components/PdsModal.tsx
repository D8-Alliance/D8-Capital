import React from 'react';
import { FinancingProduct } from '../types';
import { useI18n } from '../i18n';
import { formatCurrency, formatProfitRate } from '../services/calculator';
import { PROVIDERS } from '../data/providers';
import { X, FileSpreadsheet, ShieldCheck, AlertCircle } from 'lucide-react';

interface PdsModalProps {
  product: FinancingProduct;
  isOpen: boolean;
  onClose: () => void;
}

export const PdsModal: React.FC<PdsModalProps> = ({ product, isOpen, onClose }) => {
  const { t, locale } = useI18n();

  if (!isOpen) return null;

  const provider = PROVIDERS.find((p) => p.id === product.providerId);
  const pds = product.pdsData;
  const isTakaful = product.productKind === 'TAKAFUL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        id="pds-modal-container"
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-800 text-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Product Disclosure Sheet (PDS)</h3>
              <p className="text-xs text-emerald-300 font-mono">
                {product.name} • {provider?.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-emerald-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Watermark Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs text-amber-900 font-semibold">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            Standardized BNM Product Disclosure Format (Illustrative Demo Data)
          </span>
          <span className="font-mono text-[10px] bg-amber-200/60 px-2 py-0.5 rounded">
            SAC / IFSA 2013 Template
          </span>
        </div>

        {/* PDS Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Section 1 */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-950">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-[10px]">1</span>
              What is this product about?
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              {pds?.productDescription || 'A Shariah-compliant financing facility.'}
            </p>
          </div>

          {/* Section 2 */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-950">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-[10px]">2</span>
              What is the Shariah concept applicable?
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Governed by the Shariah principle of <strong>{product.shariahStructure}</strong>. {provider?.shariahBoardSummary}
            </p>
          </div>

          {/* Section 3: Key Financial Terms */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-950">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-[10px]">3</span>
              What do I get from this product?
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    {isTakaful ? 'Coverage Amount' : 'Facility Limit'}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {isTakaful
                      ? formatCurrency(product.takafulData?.coverageAmount || 0, product.country, locale)
                      : `${formatCurrency(product.minAmount, product.country, locale)} – ${formatCurrency(product.maxAmount, product.country, locale)}`}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    {isTakaful ? 'Annual Contribution' : 'Profit Rate'}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 font-mono">
                    {isTakaful
                      ? formatCurrency(product.takafulData?.annualContribution || 0, product.country, locale)
                      : `${formatProfitRate(product.annualProfitRate)} (${product.rateMethod === 'flat' ? 'Flat' : 'Reducing'})`}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    {isTakaful ? 'Contribution Frequency' : 'Tenure Range'}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {isTakaful ? product.takafulData?.contributionFrequency : `${product.minTenureYears} to ${product.maxTenureYears} Years`}
                  </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Margin</span>
                <span className="text-xs font-bold text-slate-900">
                  {product.marginOfFinancing}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Fees & Charges */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-950">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-[10px]">4</span>
              What are the fees and charges I have to pay?
            </h4>
            <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
              <li><strong>Processing Fee:</strong> {product.processingFee}</li>
              <li><strong>Stamp Duty:</strong> {product.stampDutyNote}</li>
              <li><strong>Takaful Coverage:</strong> {product.takafulNote}</li>
            </ul>
          </div>

          {/* Section 5: Early Settlement & Ibra */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-emerald-50/60 border-emerald-200">
            <h4 className="font-bold text-emerald-950 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">5</span>
                  {isTakaful ? 'Certificate Termination & Benefits' : 'What if I fully settle before maturity (Ibra\')?'}
            </h4>
            <p className="text-emerald-900 text-xs leading-relaxed font-medium">
              {product.earlySettlementIbra}
            </p>
          </div>

          {/* Section 6: Late Payment Ta'widh */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-rose-50/60 border-rose-200">
            <h4 className="font-bold text-rose-950 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-rose-700 text-white flex items-center justify-center text-[10px]">6</span>
              What if I fail to fulfill my obligations?
            </h4>
            <p className="text-rose-900 text-xs leading-relaxed">
              {pds?.financialPenaltyLatePayment || 'Late payment charges (Ta\'widh) applied in accordance with Shariah Advisory Council BNM resolutions.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Verified Shariah Governance Schedule
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-emerald-950 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
