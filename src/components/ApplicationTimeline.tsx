import React from 'react';
import { ApplicationStatus } from '../types';
import { useI18n } from '../i18n';
import { Check, Clock, Sparkles, AlertCircle, Wallet } from 'lucide-react';

interface ApplicationTimelineProps {
  currentStatus: ApplicationStatus;
  statusHistory?: {
    status: ApplicationStatus;
    timestamp: string;
    actor: string;
    notes?: string;
  }[];
  className?: string;
}

const STAGES: { status: ApplicationStatus; labelKey: string }[] = [
  { status: 'SUBMITTED', labelKey: 'status.SUBMITTED' },
  { status: 'DOCUMENTS_VERIFICATION', labelKey: 'status.DOCUMENTS_VERIFICATION' },
  { status: 'PROVIDER_ASSESSMENT', labelKey: 'status.PROVIDER_ASSESSMENT' },
  { status: 'OFFER_ISSUED', labelKey: 'status.OFFER_ISSUED' },
  { status: 'ACCEPTED', labelKey: 'status.ACCEPTED' },
  { status: 'DISBURSED', labelKey: 'status.DISBURSED' },
];

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  currentStatus,
  statusHistory = [],
  className = '',
}) => {
  const { t } = useI18n();

  const getStageIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return 0;
      case 'DOCUMENTS_VERIFICATION':
        return 1;
      case 'PROVIDER_ASSESSMENT':
      case 'ADDITIONAL_INFO_REQUIRED':
        return 2;
      case 'OFFER_ISSUED':
        return 3;
      case 'ACCEPTED':
      case 'DECLINED':
        return 4;
      case 'DISBURSED':
      case 'REJECTED':
        return 5;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div id="application-timeline" className={`w-full ${className}`}>
      {/* Stepper bar */}
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
            style={{
              width: `${(currentIndex / (STAGES.length - 1)) * 100}%`,
            }}
          />
        </div>

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const historyEntry = statusHistory.find((h) => h.status === stage.status);

          return (
            <div
              key={stage.status}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-semibold text-xs shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : isCurrent
                    ? 'bg-emerald-950 text-white ring-4 ring-emerald-400 animate-pulse'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  stage.status === 'OFFER_ISSUED' ? (
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              <div className="mt-2 text-center max-w-[90px] sm:max-w-[110px]">
                <p
                  className={`text-[11px] sm:text-xs font-semibold leading-tight ${
                    isCurrent
                      ? 'text-emerald-900 font-bold'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {t(stage.labelKey as any)}
                </p>
                {historyEntry && (
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                    {new Date(historyEntry.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Special notices for conditional states */}
      {currentStatus === 'ADDITIONAL_INFO_REQUIRED' && (
        <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-2.5 text-xs text-orange-900">
          <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
          <span>
            <strong>Action Required:</strong> The participating provider has requested additional verification documents before completing the assessment.
          </span>
        </div>
      )}
    </div>
  );
};
