import React, { useState } from 'react';
import { DemoStoreProvider, useDemoStore } from './store/DemoStore';
import { I18nProvider } from './i18n';
import { FinancingProduct, FinancingApplication, DemoRole } from './types';

// Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DemoControlBar } from './components/DemoControlBar';
import { DemoFlowMapModal } from './components/DemoFlowMapModal';

// Customer Pages
import { LandingPage } from './components/LandingPage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { FinancingCataloguePage } from './components/FinancingCataloguePage';
import { ComparisonPage } from './components/ComparisonPage';
import { CalculatorPage } from './components/CalculatorPage';
import { EligibilityPage } from './components/EligibilityPage';
import { ApplicationWizard } from './components/ApplicationWizard';
import { ApplicationsListPage } from './components/ApplicationsListPage';
import { ApplicationDetailPage } from './components/ApplicationDetailPage';
import { MyFinancingPage } from './components/MyFinancingPage';
import { NotificationsPage } from './components/NotificationsPage';
import { SettingsPage } from './components/SettingsPage';

// Provider Pages
import { ProviderDashboard } from './components/ProviderDashboard';
import { ProviderApplicationReview } from './components/ProviderApplicationReview';
import { ProviderDocumentsPage } from './components/ProviderDocumentsPage';
import { ProviderReportsPage } from './components/ProviderReportsPage';

// Admin Pages
import { AdminDashboard } from './components/AdminDashboard';
import { AdminCountriesPage } from './components/AdminCountriesPage';
import { AdminProductsPage } from './components/AdminProductsPage';
import { AdminProvidersPage } from './components/AdminProvidersPage';
import { AdminAuditLogsPage } from './components/AdminAuditLogsPage';

function MainAppContent() {
  const { state, setRole } = useDemoStore();

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isFlowMapOpen, setIsFlowMapOpen] = useState<boolean>(false);

  // Selected item contexts
  const [selectedProductForApply, setSelectedProductForApply] = useState<FinancingProduct | undefined>(undefined);
  const [selectedApplicationForDetail, setSelectedApplicationForDetail] = useState<FinancingApplication | undefined>(undefined);
  const [applyInitialAmount, setApplyInitialAmount] = useState<number | undefined>(undefined);
  const [applyInitialTenure, setApplyInitialTenure] = useState<number | undefined>(undefined);

  // Navigation handlers
  const handleNavigate = (tab: string, extraData?: any) => {
    if (tab === 'application' && extraData?.product) {
      setSelectedProductForApply(extraData.product);
    }
    if (tab === 'appDetail' && extraData?.application) {
      setSelectedApplicationForDetail(extraData.application);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyProduct = (product: FinancingProduct) => {
    setSelectedProductForApply(product);
    setActiveTab('application');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculatorApply = (amount: number, tenure: number) => {
    setApplyInitialAmount(amount);
    setApplyInitialTenure(tenure);
    setActiveTab('application');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectApplication = (app: FinancingApplication) => {
    setSelectedApplicationForDetail(app);
    if (state.activeRole === 'PROVIDER') {
      setActiveTab('appReview');
    } else {
      setActiveTab('appDetail');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepJump = (stepNumber: number, targetTab: string, role?: DemoRole) => {
    if (role && role !== state.activeRole) {
      setRole(role);
    }
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on landing tab, render Landing Page
  if (activeTab === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => {
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // Render view depending on activeTab & role
  const renderCurrentView = () => {
    // Shared / Role-agnostic utility tabs
    if (activeTab === 'notifications') {
      return (
        <NotificationsPage
          onNavigateToApp={(appId) => {
            const target = state.applications.find((a) => a.id === appId);
            if (target) {
              handleSelectApplication(target);
            } else {
              setActiveTab('applications');
            }
          }}
        />
      );
    }

    if (activeTab === 'settings') {
      return <SettingsPage />;
    }

    // Role: CUSTOMER
    if (state.activeRole === 'CUSTOMER') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <CustomerDashboard
              onNavigate={handleNavigate}
              onApplyProduct={handleApplyProduct}
            />
          );
        case 'financing':
          return (
            <FinancingCataloguePage
              onApply={handleApplyProduct}
              onNavigateToCompare={() => setActiveTab('compare')}
            />
          );
        case 'compare':
          return (
            <ComparisonPage
              onApply={handleApplyProduct}
              onNavigateToFinancing={() => setActiveTab('financing')}
            />
          );
        case 'calculator':
          return <CalculatorPage onProceedToApply={handleCalculatorApply} />;
        case 'eligibility':
          return (
            <EligibilityPage
              onProceedToProducts={() => setActiveTab('financing')}
            />
          );
        case 'application':
          return (
            <ApplicationWizard
              initialProduct={selectedProductForApply}
              initialAmount={applyInitialAmount}
              initialTenure={applyInitialTenure}
              onCompleted={(appId) => {
                const newApp = state.applications.find((a) => a.id === appId);
                if (newApp) setSelectedApplicationForDetail(newApp);
                setActiveTab('applications');
              }}
              onCancel={() => setActiveTab('dashboard')}
            />
          );
        case 'applications':
          return (
            <ApplicationsListPage
              onSelectApplication={handleSelectApplication}
              onNewApplication={() => setActiveTab('financing')}
            />
          );
        case 'appDetail':
          return selectedApplicationForDetail ? (
            <ApplicationDetailPage
              application={selectedApplicationForDetail}
              onBack={() => setActiveTab('applications')}
              onViewActiveFinancing={() => setActiveTab('myFinancing')}
            />
          ) : (
            <ApplicationsListPage
              onSelectApplication={handleSelectApplication}
              onNewApplication={() => setActiveTab('financing')}
            />
          );
        case 'myFinancing':
          return (
            <MyFinancingPage
              onExploreNewFinancing={() => setActiveTab('financing')}
            />
          );
        default:
          return (
            <CustomerDashboard
              onNavigate={handleNavigate}
              onApplyProduct={handleApplyProduct}
            />
          );
      }
    }

    // Role: PROVIDER
    if (state.activeRole === 'PROVIDER') {
      switch (activeTab) {
        case 'dashboard':
        case 'applications':
          return (
            <ProviderDashboard
              onReviewApplication={handleSelectApplication}
              onNavigateTab={handleNavigate}
            />
          );
        case 'appReview': {
          const appToReview =
            selectedApplicationForDetail ||
            state.applications.find((a) => a.country === state.activeCountry) ||
            state.applications[0];

          return appToReview ? (
            <ProviderApplicationReview
              application={appToReview}
              onBack={() => setActiveTab('dashboard')}
              onOfferIssued={() => setActiveTab('dashboard')}
            />
          ) : (
            <ProviderDashboard
              onReviewApplication={handleSelectApplication}
              onNavigateTab={handleNavigate}
            />
          );
        }
        case 'documents':
          return <ProviderDocumentsPage />;
        case 'reports':
          return <ProviderReportsPage />;
        default:
          return (
            <ProviderDashboard
              onReviewApplication={handleSelectApplication}
              onNavigateTab={handleNavigate}
            />
          );
      }
    }

    // Role: ADMIN
    if (state.activeRole === 'ADMIN') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard onNavigateTab={handleNavigate} />;
        case 'countries':
          return <AdminCountriesPage />;
        case 'products':
          return <AdminProductsPage />;
        case 'providers':
          return <AdminProvidersPage />;
        case 'applications':
          return (
            <ApplicationsListPage
              onSelectApplication={handleSelectApplication}
              onNewApplication={() => setActiveTab('products')}
            />
          );
        case 'auditLogs':
          return <AdminAuditLogsPage />;
        default:
          return <AdminDashboard onNavigateTab={handleNavigate} />;
      }
    }

    return (
      <CustomerDashboard
        onNavigate={handleNavigate}
        onApplyProduct={handleApplyProduct}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col justify-between text-[#e5e5e5] selection:bg-[#c4a67e] selection:text-black">
      {/* Header */}
      <Header activeTab={activeTab} onNavigate={handleNavigate} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderCurrentView()}
      </main>

      {/* Customer Mobile Bottom Navigation */}
      {state.activeRole === 'CUSTOMER' && (
        <BottomNav activeTab={activeTab} onNavigate={handleNavigate} />
      )}

      {/* Fixed Demo Control Bar (§19) */}
      <DemoControlBar
        onOpenFlowMap={() => setIsFlowMapOpen(true)}
        onNavigateTab={handleNavigate}
      />

      {/* Flow Map & Sequence Modal (STEP 1-22) */}
      <DemoFlowMapModal
        isOpen={isFlowMapOpen}
        onClose={() => setIsFlowMapOpen(false)}
        onNavigateToStep={handleStepJump}
      />
    </div>
  );
}

export default function App() {
  return (
    <DemoStoreProvider>
      <I18nProvider>
        <MainAppContent />
      </I18nProvider>
    </DemoStoreProvider>
  );
}
