import React from 'react';
import { ApplicationStatus } from '../types';
import { useI18n } from '../i18n';
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  AlertCircle,
  FileText,
  Ban,
  Wallet,
  Sparkles,
} from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const { t } = useI18n();

  const getStatusConfig = () => {
    switch (status) {
      case 'SUBMITTED':
        return {
          bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          icon: Clock,
          label: t('status.SUBMITTED'),
        };
      case 'DOCUMENTS_VERIFICATION':
        return {
          bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          icon: FileCheck2,
          label: t('status.DOCUMENTS_VERIFICATION'),
        };
      case 'PROVIDER_ASSESSMENT':
        return {
          bg: 'bg-[#c4a67e]/10 text-[#c4a67e] border-[#c4a67e]/30',
          icon: FileText,
          label: t('status.PROVIDER_ASSESSMENT'),
        };
      case 'ADDITIONAL_INFO_REQUIRED':
        return {
          bg: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
          icon: AlertCircle,
          label: t('status.ADDITIONAL_INFO_REQUIRED'),
        };
      case 'OFFER_ISSUED':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/20 font-medium',
          icon: Sparkles,
          label: t('status.OFFER_ISSUED'),
        };
      case 'ACCEPTED':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold',
          icon: CheckCircle2,
          label: t('status.ACCEPTED'),
        };
      case 'DECLINED':
        return {
          bg: 'bg-white/5 text-white/50 border-white/10',
          icon: Ban,
          label: t('status.DECLINED'),
        };
      case 'REJECTED':
        return {
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          icon: Ban,
          label: t('status.REJECTED'),
        };
      case 'DISBURSED':
        return {
          bg: 'bg-[#c4a67e]/20 text-[#c4a67e] border-[#c4a67e]/40 font-medium',
          icon: Wallet,
          label: t('status.DISBURSED'),
        };
      default:
        return {
          bg: 'bg-white/5 text-white/60 border-white/10',
          icon: Clock,
          label: status,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <span
      id={`status-badge-${status.toLowerCase()}`}
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses} ${config.bg} ${className}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
