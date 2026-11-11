import React, { useState } from 'react';
import { FinancingProduct } from '../types';
import { useI18n } from '../i18n';
import { PROVIDERS } from '../data/providers';
import { formatCurrency, formatProfitRate, calculateFinancing } from '../services/calculator';
import { DemoDataLabel } from './DemoDataLabel';
import { PdsModal } from './PdsModal';
import { ChevronDown, ChevronUp, FileText, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ComparisonTableProps {
  products: FinancingProduct[];
  sampleAmount: number;
  sampleTenureYears: number;
  onApply: (product: FinancingProduct) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  products,
  sampleAmount,
  sampleTenureYears,
  onApply,
}) => {
  const { t, locale } = useI18n();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activePdsProduct, setActivePdsProduct] = useState<FinancingProduct | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="comparison-table-container" className="w-full space-y-4">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Table Header / Summary */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold tracking-tight">{t('compare.title')}</h3>
            <p className="text-xs text-slate-300">
              Comparing {products.length} products for{' '}
              <strong className="text-emerald-400 font-mono">
                {products.length > 0 && formatCurrency(sampleAmount, products[0].country, locale)}
              </strong>{' '}
              over{' '}
              <strong className="text-emerald-400">{sampleTenureYears} {t('common.years')}</strong>
            </p>
          </div>
          <DemoDataLabel variant="badge" />
        </div>

        {/* Desktop / Tablet View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">{t('compare.providerCol')} & {t('compare.productCol')}</th>
                <th className="py-3.5 px-4">{t('compare.structureCol')}</th>
                <th className="py-3.5 px-4">{t('compare.rateCol')}</th>
                <th className="py-3.5 px-4">{t('compare.monthlyCol')}</th>
                <th className="py-3.5 px-4 hidden md:table-cell">{t('compare.marginCol')}</th>
                <th className="py-3.5 px-4 text-right">{t('compare.actionCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {products.map((product) => {
                const provider = PROVIDERS.find((p) => p.id === product.providerId);
                const isExpanded = expandedId === product.id;
                const isTakaful = product.productKind === 'TAKAFUL';
                const calc = isTakaful
                  ? undefined
                  : calculateFinancing(
                      sampleAmount,
                      product.annualProfitRate,
                      sampleTenureYears,
                      product.rateMethod
                    );

                return (
                  <React.Fragment key={product.id}>
                    <tr
                      id={`compare-row-${product.id}`}
                      className={`transition hover:bg-emerald-50/30 ${
                        isExpanded ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* Provider & Product */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                            style={{
                              backgroundColor: provider?.colorScheme.bg || '#ecfdf5',
                              color: provider?.colorScheme.primary || '#047857',
                              border: `1px solid ${provider?.colorScheme.border || '#a7f3d0'}`,
                            }}
                          >
                            {provider?.logoText || 'IB'}
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">
                              {provider?.name}
                            </span>
                            <span className="font-bold text-slate-900 text-sm block">
                              {product.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Shariah Structure */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {product.shariahStructure}
                        </span>
                      </td>

                      {/* Profit Rate */}
                      <td className="py-4 px-4">
                        <span className="text-sm font-extrabold text-emerald-900 font-mono block">
                           {isTakaful
                             ? formatCurrency(product.takafulData?.annualContribution || 0, product.country, locale)
                             : formatProfitRate(product.annualProfitRate)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                           {isTakaful ? 'Annual contribution' : product.rateMethod === 'flat' ? t('common.flatRate') : t('common.reducingRate')}
                        </span>
                      </td>

                      {/* Monthly Instalment */}
                      <td className="py-4 px-4">
                        <span className="text-sm font-extrabold text-slate-900 font-mono block">
                           {isTakaful
                             ? formatCurrency(product.takafulData?.coverageAmount || 0, product.country, locale)
                             : formatCurrency(calc?.monthlyInstalment || 0, product.country, locale)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                           {isTakaful ? 'Coverage amount' : `Total: ${formatCurrency(calc?.totalPayable || 0, product.country, locale)}`}
                        </span>
                      </td>

                      {/* Margin */}
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="font-medium text-slate-700">{product.marginOfFinancing}</span>
                        <span className="block text-[10px] text-slate-400">Processing: {product.processingFee}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => toggleExpand(product.id)}
                            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                            title="Expand Details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {product.pdsData && (
                            <button
                              type="button"
                              onClick={() => setActivePdsProduct(product)}
                              className="px-2.5 py-1.5 text-xs text-emerald-800 hover:bg-emerald-50 rounded-lg font-semibold transition hidden sm:inline-flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              PDS
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => (isTakaful ? setActivePdsProduct(product) : onApply(product))}
                            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                          >
                            <span>{isTakaful ? 'View Coverage' : t('common.apply')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/80 border-b border-slate-200">
                        <td colSpan={6} className="p-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block mb-2 text-emerald-950">
                                {t('catalogue.features')}
                              </span>
                              <ul className="space-y-1.5 text-slate-600">
                                {product.keyFeatures.map((f, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block mb-2 text-emerald-950">
                                {t('catalogue.eligibility')}
                              </span>
                              <p className="text-slate-600 leading-relaxed">{product.eligibilitySummary}</p>
                              <div className="mt-2 text-[10px] text-slate-500 font-mono">
                                Tenure: {product.minTenureYears} to {product.maxTenureYears} years
                              </div>
                            </div>

                            <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block mb-2 text-emerald-950">
                                {t('catalogue.documentsRequired')}
                              </span>
                              <ul className="space-y-1 text-slate-600 list-disc pl-4">
                                {product.requiredDocumentsSummary.map((d, i) => (
                                  <li key={i}>{d}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDS Modal */}
      {activePdsProduct && (
        <PdsModal
          product={activePdsProduct}
          isOpen={!!activePdsProduct}
          onClose={() => setActivePdsProduct(null)}
        />
      )}
    </div>
  );
};
