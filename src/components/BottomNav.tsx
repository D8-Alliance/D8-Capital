import React from 'react';
import { useI18n } from '../i18n';
import { LayoutDashboard, Search, Calculator, FileText, Wallet } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate }) => {
  const { t } = useI18n();

  const items = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'financing', label: t('nav.financing'), icon: Search },
    { id: 'calculator', label: t('nav.calculator'), icon: Calculator },
    { id: 'applications', label: t('nav.applications'), icon: FileText },
    { id: 'myFinancing', label: t('nav.myFinancing'), icon: Wallet },
  ];

  return (
    <div
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-12 left-0 right-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-md border-t border-white/5 py-1 px-2 shadow-2xl"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition cursor-pointer ${
                isActive ? 'text-[#c4a67e] font-semibold' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
