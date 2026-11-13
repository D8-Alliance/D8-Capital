import React, { useState } from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { COUNTRIES, COUNTRIES_LIST } from '../data/countries';
import { CountryCode, LocaleCode } from '../types';
import {
  Globe2,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  ShieldCheck,
  User,
  Menu,
  X,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onNavigate }) => {
  const { state, setCountry, setRole } = useDemoStore();
  const { locale, setLocale, t } = useI18n();
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeCountryConfig = COUNTRIES[state.activeCountry] || COUNTRIES.MY;
  const unreadNotifications = state.notifications.filter(
    (n) => !n.read && (n.role === state.activeRole || n.userId === state.activeUser.id)
  ).length;

  const getNavLinks = () => {
    if (state.activeRole === 'CUSTOMER') {
      return [
        { id: 'dashboard', label: t('nav.dashboard') },
        { id: 'financing', label: t('nav.financing') },
        { id: 'compare', label: t('nav.compare') },
        { id: 'calculator', label: t('nav.calculator') },
        { id: 'applications', label: t('nav.applications') },
        { id: 'myFinancing', label: t('nav.myFinancing') },
      ];
    } else if (state.activeRole === 'PROVIDER') {
      return [
        { id: 'dashboard', label: t('nav.dashboard') },
        { id: 'applications', label: t('nav.applications') },
        { id: 'appReview', label: t('nav.appReview') },
        { id: 'documents', label: t('nav.documents') },
        { id: 'reports', label: t('nav.reports') },
      ];
    } else {
      // ADMIN
      return [
        { id: 'dashboard', label: t('nav.dashboard') },
        { id: 'countries', label: t('nav.countries') },
        { id: 'products', label: t('nav.products') },
        { id: 'providers', label: t('nav.providers') },
        { id: 'applications', label: t('nav.applications') },
        { id: 'auditLogs', label: t('nav.auditLogs') },
      ];
    }
  };

  const navLinks = getNavLinks();

  const handleCountrySelect = (code: CountryCode) => {
    setCountry(code);
    setShowCountryMenu(false);
    // Align default locale for that country
    const cfg = COUNTRIES[code];
    if (cfg) {
      setLocale(cfg.defaultLocale);
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex items-center justify-between gap-2 h-14 sm:h-16">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3 lg:gap-6 min-w-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-stone-50 border border-[#c4a67e]/30 flex items-center justify-center text-[#8a6a3a] font-serif-luxury font-bold text-xl shadow-inner group-hover:border-[#c4a67e] group-hover:scale-105 transition">
                D8
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-luxury font-bold text-slate-900 tracking-tight text-lg sm:text-xl whitespace-nowrap">
                    D8 Capital
                  </span>
                  <span className="hidden sm:inline text-[10px] uppercase font-mono font-bold tracking-widest bg-[#c4a67e]/15 text-[#8a6a3a] border border-[#c4a67e]/30 px-1.5 py-0.5 rounded">
                    ISLAMIC
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] text-slate-500 tracking-widest uppercase font-medium leading-none mt-0.5">
                  Private Wealth & Financing
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 ml-2">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-slate-100 text-[#8a6a3a] border border-[#c4a67e]/30 shadow-xs'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#c4a67e]"></span>}
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Country Selector, Language Selector, Notifications, Role Badge */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Country Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowCountryMenu(!showCountryMenu);
                  setShowLangMenu(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-800 transition cursor-pointer"
              >
                <span className="text-sm leading-none">{activeCountryConfig.flag}</span>
                <span className="hidden sm:inline text-slate-700">{activeCountryConfig.name}</span>
                <span className="text-[#8a6a3a] font-mono text-[11px] font-semibold">
                  {activeCountryConfig.currency}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showCountryMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 tracking-widest border-b border-slate-200">
                    Jurisdiction (§3)
                  </div>
                  {COUNTRIES_LIST.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleCountrySelect(c.code)}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 transition cursor-pointer ${
                        state.activeCountry === c.code ? 'bg-slate-100 font-semibold text-[#8a6a3a]' : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{c.flag}</span>
                        <span>{c.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#8a6a3a] bg-[#c4a67e]/10 border border-[#c4a67e]/20 px-1.5 py-0.5 rounded">
                        {c.currency}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector Dropdown (§17) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowCountryMenu(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 transition cursor-pointer uppercase font-mono"
              >
                <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{locale}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 tracking-widest border-b border-slate-200">
                    Language (§17)
                  </div>
                  <button
                    onClick={() => {
                      setLocale('en');
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 ${
                      locale === 'en' ? 'font-semibold text-[#8a6a3a] bg-slate-100' : 'text-slate-600'
                    }`}
                  >
                    <span>English</span>
                    <span className="font-mono text-[10px] text-slate-500">EN</span>
                  </button>
                  <button
                    onClick={() => {
                      setLocale('ms');
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 ${
                      locale === 'ms' ? 'font-semibold text-[#8a6a3a] bg-slate-100' : 'text-slate-600'
                    }`}
                  >
                    <span>Bahasa Malaysia</span>
                    <span className="font-mono text-[10px] text-slate-500">MS</span>
                  </button>
                  <button
                    onClick={() => {
                      setLocale('tr');
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 ${
                      locale === 'tr' ? 'font-semibold text-[#8a6a3a] bg-slate-100' : 'text-slate-600'
                    }`}
                  >
                    <span>Türkçe</span>
                    <span className="font-mono text-[10px] text-slate-500">TR</span>
                  </button>
                  <button
                    onClick={() => {
                      setLocale('az');
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 ${
                      locale === 'az' ? 'font-semibold text-[#8a6a3a] bg-slate-100' : 'text-slate-600'
                    }`}
                  >
                    <span>Azərbaycan</span>
                    <span className="font-mono text-[10px] text-slate-500">AZ</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#c4a67e] text-black text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Role Badge Indicator */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border ${
                state.activeRole === 'CUSTOMER'
                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                  : state.activeRole === 'PROVIDER'
                  ? 'bg-[#c4a67e]/10 text-[#8a6a3a] border-[#c4a67e]/25'
                  : 'bg-purple-500/10 text-purple-700 border-purple-500/20'
              }`}
            >
              {state.activeRole === 'CUSTOMER' && <User className="w-3.5 h-3.5" />}
              {state.activeRole === 'PROVIDER' && <Building2 className="w-3.5 h-3.5" />}
              {state.activeRole === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
              <span className="tracking-wider uppercase text-[10px]">{state.activeRole}</span>
            </div>

            {/* Profile / Settings Button */}
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
              title={t('nav.settings')}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 px-2 space-y-1 bg-stone-50 animate-fadeIn">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-slate-100 text-[#8a6a3a] border border-[#c4a67e]/30'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#c4a67e]"></span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
