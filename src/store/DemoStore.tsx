import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import {
  CountryCode,
  DemoRole,
  DemoScenarioId,
  DemoUser,
  FinancingApplication,
  FinancingOffer,
  ActiveFinancingAccount,
  AppNotification,
  AuditLogEntry,
  ApplicationDocument,
  ApplicationStatus,
} from '../types';
import { COUNTRIES } from '../data/countries';
import { PRODUCTS } from '../data/products';
import { calculateFinancing } from '../services/calculator';

interface DemoState {
  activeScenario: DemoScenarioId;
  activeCountry: CountryCode;
  activeRole: DemoRole;
  activeUser: DemoUser;
  applications: FinancingApplication[];
  activeAccounts: ActiveFinancingAccount[];
  notifications: AppNotification[];
  auditLogs: AuditLogEntry[];
  selectedCompareProductIds: string[];
  activeDemoStep: number; // 1 to 22 for visual guide tracking
}

const SEED_USERS: Record<DemoScenarioId, DemoUser> = {
  MY_PERSONAL: {
    id: 'user-my-01',
    name: 'Ahmad Faiz bin Ibrahim',
    email: 'ahmad.faiz@example.com.my',
    role: 'CUSTOMER',
    country: 'MY',
    type: 'INDIVIDUAL',
  },
  TR_VEHICLE: {
    id: 'user-tr-01',
    name: 'Emre Çelik',
    email: 'emre.celik@example.com.tr',
    role: 'CUSTOMER',
    country: 'TR',
    type: 'INDIVIDUAL',
  },
  AZ_SME: {
    id: 'user-az-01',
    name: 'Rauf Əliyev (Caspian Agro Equipment MMC)',
    email: 'r.aliyev@caspianagro.az',
    role: 'CUSTOMER',
    country: 'AZ',
    type: 'BUSINESS',
  },
};

const PROVIDER_USER: DemoUser = {
  id: 'user-prov-01',
  name: 'Ustaz Nurul Huda (Chief Shariah Assessment Officer)',
  email: 'assessment@provider-a.finance',
  role: 'PROVIDER',
  country: 'MY',
  type: 'INDIVIDUAL',
};

const ADMIN_USER: DemoUser = {
  id: 'user-admin-01',
  name: 'D8 Capital Master Operations',
  email: 'operations@d8capital.org',
  role: 'ADMIN',
  country: 'MY',
  type: 'INDIVIDUAL',
};

function generateSeedState(scenario: DemoScenarioId): DemoState {
  const country: CountryCode = scenario === 'MY_PERSONAL' ? 'MY' : scenario === 'TR_VEHICLE' ? 'TR' : 'AZ';
  const user = SEED_USERS[scenario];

  // Initial seed applications tailored per scenario
  let initialApps: FinancingApplication[] = [];
  let initialAccounts: ActiveFinancingAccount[] = [];

  if (scenario === 'MY_PERSONAL') {
    // Clean seed for Malaysia flow: ready for user to submit new application in STEP 1-13
    initialApps = [
      {
        id: 'APP-MY-9801',
        applicationNumber: 'D8-MY-2026-09801',
        scenarioId: 'MY_PERSONAL',
        country: 'MY',
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: '+60 12-345 6789',
        userType: 'INDIVIDUAL',
        productId: 'my-pf-02',
        productName: 'Barakah Express Personal Financing-i',
        providerId: 'provider-b',
        providerName: 'Provider B Islamic Financial Institution',
        category: 'personal',
        shariahStructure: 'Tawarruq / Commodity Murabahah',
        rateMethod: 'flat',
        requestedAmount: 30000,
        requestedTenureYears: 5,
        estimatedProfitRate: 0.048,
        estimatedMonthlyInstalment: 620.0,
        purpose: 'Home Furnishing & Renovation',
        status: 'DISBURSED',
        createdAt: '2026-07-15T09:30:00Z',
        updatedAt: '2026-07-20T14:00:00Z',
        applicantKyc: {
          fullName: user.name,
          idType: 'MyKad',
          idNumber: '880512-14-5541',
          dateOfBirth: '1988-05-12',
          nationality: 'Malaysian',
          address: 'No. 24, Jalan Bukit Bintang 3, 55100 Kuala Lumpur',
          employmentType: 'Private Sector Executive',
          employerName: 'PetroTech Global Sdn Bhd',
          monthlyIncome: 6500,
          existingCommitments: 1400,
          calculatedDsr: 31.0,
          eligibilityStatus: 'POTENTIALLY_ELIGIBLE',
        },
        documents: [
          {
            id: 'DOC-01',
            applicationId: 'APP-MY-9801',
            name: 'MyKad_Front_Back.pdf',
            type: 'Identity Document',
            fileSize: '1.4 MB',
            status: 'VERIFIED',
            uploadedAt: '2026-07-15T09:35:00Z',
          },
          {
            id: 'DOC-02',
            applicationId: 'APP-MY-9801',
            name: 'Salary_Slips_3Months.pdf',
            type: 'Income Statement',
            fileSize: '2.8 MB',
            status: 'VERIFIED',
            uploadedAt: '2026-07-15T09:36:00Z',
          },
        ],
        statusHistory: [
          { status: 'SUBMITTED', timestamp: '2026-07-15T09:30:00Z', actor: 'Ahmad Faiz' },
          { status: 'DOCUMENTS_VERIFICATION', timestamp: '2026-07-16T10:00:00Z', actor: 'Provider B Compliance' },
          { status: 'PROVIDER_ASSESSMENT', timestamp: '2026-07-17T11:20:00Z', actor: 'Provider B Underwriter' },
          { status: 'OFFER_ISSUED', timestamp: '2026-07-18T15:00:00Z', actor: 'Provider B System' },
          { status: 'ACCEPTED', timestamp: '2026-07-19T08:30:00Z', actor: 'Ahmad Faiz' },
          { status: 'DISBURSED', timestamp: '2026-07-20T14:00:00Z', actor: 'Provider B Operations' },
        ],
      },
    ];

    initialAccounts = [
      {
        id: 'ACC-MY-001',
        applicationId: 'APP-MY-9801',
        accountNumber: 'MY-IB-8829-0014',
        providerName: 'Provider B Islamic Financial Institution',
        productName: 'Barakah Express Personal Financing-i',
        country: 'MY',
        currency: 'MYR',
        facilityAmount: 30000,
        outstandingBalance: 26400,
        profitRate: 0.048,
        monthlyInstalment: 620.0,
        tenureYears: 5,
        nextPaymentDate: '2026-10-01',
        disbursedDate: '2026-07-20',
        shariahStructure: 'Tawarruq / Commodity Murabahah',
        paymentProgress: 12,
        completedTenureMonths: 6,
        remainingTenureMonths: 54,
      },
    ];
  } else if (scenario === 'TR_VEHICLE') {
    initialApps = [
      {
        id: 'APP-TR-4401',
        applicationNumber: 'D8-TR-2026-04401',
        scenarioId: 'TR_VEHICLE',
        country: 'TR',
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: '+90 532 123 4567',
        userType: 'INDIVIDUAL',
        productId: 'tr-veh-01',
        productName: 'Elit Taşıt Katılım Finansmanı',
        providerId: 'provider-tr-a',
        providerName: 'Provider A Katılım Bankası',
        category: 'vehicle',
        shariahStructure: 'Murabahah',
        rateMethod: 'reducing',
        requestedAmount: 1200000,
        requestedTenureYears: 4,
        estimatedProfitRate: 0.285,
        estimatedMonthlyInstalment: 41850.0,
        purpose: '0 Km Taşıt Alımı (Elektrikli SUV)',
        status: 'PROVIDER_ASSESSMENT',
        createdAt: '2026-08-28T10:15:00Z',
        updatedAt: '2026-08-30T16:00:00Z',
        applicantKyc: {
          fullName: user.name,
          idType: 'T.C. Kimlik Kartı',
          idNumber: '29837482910',
          dateOfBirth: '1985-11-20',
          nationality: 'T.C.',
          address: 'Bağdat Caddesi No: 142/5, Kadıköy, İstanbul',
          employmentType: 'Özel Sektör Kıdemli Mühendis',
          employerName: 'Teknoloji A.Ş.',
          monthlyIncome: 110000,
          existingCommitments: 18000,
          calculatedDsr: 54.4,
          eligibilityStatus: 'POTENTIALLY_ELIGIBLE',
        },
        documents: [
          {
            id: 'DOC-TR-01',
            applicationId: 'APP-TR-4401',
            name: 'Kimlik_Bordro_SGK.pdf',
            type: 'Kimlik & Gelir Belgesi',
            fileSize: '3.1 MB',
            status: 'VERIFIED',
            uploadedAt: '2026-08-28T10:20:00Z',
          },
          {
            id: 'DOC-TR-02',
            applicationId: 'APP-TR-4401',
            name: 'Arac_Proforma_Faturasi.pdf',
            type: 'Araç Faturası',
            fileSize: '1.8 MB',
            status: 'VERIFIED',
            uploadedAt: '2026-08-28T10:22:00Z',
          },
        ],
        statusHistory: [
          { status: 'SUBMITTED', timestamp: '2026-08-28T10:15:00Z', actor: 'Emre Çelik' },
          { status: 'DOCUMENTS_VERIFICATION', timestamp: '2026-08-29T09:00:00Z', actor: 'Provider A Evrak Birimi' },
          { status: 'PROVIDER_ASSESSMENT', timestamp: '2026-08-30T16:00:00Z', actor: 'Provider A Kredi Tahsis' },
        ],
      },
    ];
  } else if (scenario === 'AZ_SME') {
    initialApps = [
      {
        id: 'APP-AZ-3301',
        applicationNumber: 'D8-AZ-2026-03301',
        scenarioId: 'AZ_SME',
        country: 'AZ',
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: '+994 50 234 5678',
        userType: 'BUSINESS',
        productId: 'az-eq-01',
        productName: 'KOB İslami Avadanlıq İcarəsi (AITAB)',
        providerId: 'provider-az-a',
        providerName: 'Provider A İslami Maliyyə',
        category: 'equipment',
        shariahStructure: 'Ijarah Muntahia Bittamleek',
        rateMethod: 'reducing',
        requestedAmount: 100000,
        requestedTenureYears: 3,
        estimatedProfitRate: 0.115,
        estimatedMonthlyInstalment: 3298.0,
        purpose: 'Kənd Təsərrüfatı və Qablaşdırma Avadanlığı Alışı',
        status: 'PROVIDER_ASSESSMENT',
        createdAt: '2026-08-25T11:00:00Z',
        updatedAt: '2026-08-27T14:30:00Z',
        applicantKyc: {
          fullName: user.name,
          idType: 'Şəxsiyyət Vəsiqəsi & VÖEN',
          idNumber: 'AZE 14829104 / VÖEN 1902847191',
          dateOfBirth: '1980-03-15',
          nationality: 'Azərbaycan',
          address: 'Nizami küçəsi 45, Bakı şəhəri',
          employmentType: 'Təsisçi & Baş Direktor',
          employerName: 'Caspian Agro Equipment MMC',
          monthlyIncome: 18000,
          existingCommitments: 2500,
          calculatedDsr: 32.2,
          eligibilityStatus: 'POTENTIALLY_ELIGIBLE',
          companyName: 'Caspian Agro Equipment MMC',
          registrationNumber: 'VÖEN 1902847191',
          businessSector: 'Kənd təsərrüfatı və qida emalı',
          operatingYears: 5,
          annualRevenue: 450000,
        },
        documents: [
          {
            id: 'DOC-AZ-01',
            applicationId: 'APP-AZ-3301',
            name: 'VOEN_Dovlet_Reyestri.pdf',
            type: 'Dövlət Qeydiyyatı',
            fileSize: '2.5 MB',
            status: 'VERIFIED',
            uploadedAt: '2026-08-25T11:05:00Z',
          },
          {
            id: 'DOC-AZ-02',
            applicationId: 'APP-AZ-3301',
            name: 'Bank_Hesab_Dovriyyesi_12Ay.pdf',
            type: 'Bank Hesab Çıxarışı',
            fileSize: '4.2 MB',
            status: 'VERIFIED',
            uploadedAt: '2026-08-25T11:08:00Z',
          },
        ],
        statusHistory: [
          { status: 'SUBMITTED', timestamp: '2026-08-25T11:00:00Z', actor: 'Rauf Əliyev' },
          { status: 'DOCUMENTS_VERIFICATION', timestamp: '2026-08-26T10:00:00Z', actor: 'Provider A Hüquq Şöbəsi' },
          { status: 'PROVIDER_ASSESSMENT', timestamp: '2026-08-27T14:30:00Z', actor: 'Provider A Şəriət Komitəsi' },
        ],
      },
    ];
  }

  const initialNotifications: AppNotification[] = [
    {
      id: 'NOTIF-01',
      userId: user.id,
      role: 'CUSTOMER',
      title: 'Welcome to D8 Capital',
      message: `Explore Shariah-compliant financing marketplace for ${COUNTRIES[country].name}.`,
      type: 'INFO',
      timestamp: new Date().toISOString(),
      read: false,
    },
  ];

  const initialAuditLogs: AuditLogEntry[] = [
    {
      id: 'AUDIT-001',
      timestamp: new Date().toISOString(),
      actor: 'System Bootstrap',
      role: 'ADMIN',
      action: 'INITIALIZE_SCENARIO',
      resourceType: 'DEMO_STORE',
      resourceId: scenario,
      details: `Initialized demo scenario ${scenario} with jurisdiction ${country}.`,
      country,
    },
  ];

  return {
    activeScenario: scenario,
    activeCountry: country,
    activeRole: 'CUSTOMER',
    activeUser: user,
    applications: initialApps,
    activeAccounts: initialAccounts,
    notifications: initialNotifications,
    auditLogs: initialAuditLogs,
    selectedCompareProductIds: [],
    activeDemoStep: 1,
  };
}

interface DemoStoreContextType {
  state: DemoState;
  setScenario: (scenario: DemoScenarioId) => void;
  setRole: (role: DemoRole) => void;
  setCountry: (country: CountryCode) => void;
  setDemoStep: (step: number) => void;
  createApplication: (app: Omit<FinancingApplication, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => FinancingApplication;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, notes?: string) => void;
  uploadDocument: (appId: string, doc: Omit<ApplicationDocument, 'id' | 'uploadedAt'>) => void;
  issueOffer: (appId: string, offer: Omit<FinancingOffer, 'id' | 'issuedAt' | 'status'>) => void;
  acceptOffer: (appId: string) => void;
  declineOffer: (appId: string) => void;
  toggleCompareProduct: (productId: string) => void;
  clearComparison: () => void;
  markNotificationRead: (notifId: string) => void;
  resetScenario: () => void;
}

const DemoStoreContext = createContext<DemoStoreContextType | null>(null);

const STORAGE_KEY = 'd8_demo_store_state_v2';

export const DemoStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DemoState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved demo state, defaulting to Malaysia scenario.', e);
    }
    return generateSeedState('MY_PERSONAL');
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist demo state:', e);
    }
  }, [state]);

  const setScenario = (scenario: DemoScenarioId) => {
    const newState = generateSeedState(scenario);
    setState(newState);
    // Align language
    const countryConfig = COUNTRIES[newState.activeCountry];
    if (countryConfig) {
      localStorage.setItem('d8_locale', countryConfig.defaultLocale);
    }
  };

  const setRole = (role: DemoRole) => {
    setState((prev) => {
      let user = prev.activeUser;
      if (role === 'CUSTOMER') {
        user = SEED_USERS[prev.activeScenario];
      } else if (role === 'PROVIDER') {
        user = PROVIDER_USER;
      } else if (role === 'ADMIN') {
        user = ADMIN_USER;
      }

      const auditEntry: AuditLogEntry = {
        id: `AUDIT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: user.name,
        role,
        action: 'SWITCH_ROLE',
        resourceType: 'SESSION',
        resourceId: role,
        details: `Switched user role to ${role}.`,
        country: prev.activeCountry,
      };

      return {
        ...prev,
        activeRole: role,
        activeUser: user,
        auditLogs: [auditEntry, ...prev.auditLogs],
      };
    });
  };

  const setCountry = (country: CountryCode) => {
    setState((prev) => {
      // Switch scenario if needed to match country
      let scenario: DemoScenarioId = prev.activeScenario;
      if (country === 'MY') scenario = 'MY_PERSONAL';
      else if (country === 'TR') scenario = 'TR_VEHICLE';
      else if (country === 'AZ') scenario = 'AZ_SME';

      const user = SEED_USERS[scenario];
      return {
        ...prev,
        activeCountry: country,
        activeScenario: scenario,
        activeUser: user,
      };
    });
  };

  const setDemoStep = (step: number) => {
    setState((prev) => ({ ...prev, activeDemoStep: step }));
  };

  const createApplication = (
    appData: Omit<FinancingApplication, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>
  ): FinancingApplication => {
    const timestamp = new Date().toISOString();
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const appId = `APP-${appData.country}-${Date.now().toString().slice(-4)}${randSuffix}`;
    const appNumber = `D8-${appData.country}-2026-${randSuffix}`;

    const newApp: FinancingApplication = {
      ...appData,
      id: appId,
      applicationNumber: appNumber,
      status: 'SUBMITTED',
      createdAt: timestamp,
      updatedAt: timestamp,
      statusHistory: [
        {
          status: 'SUBMITTED',
          timestamp,
          actor: appData.userName,
          notes: 'Application submitted via D8 Capital Digital Marketplace.',
        },
      ],
    };

    const providerNotif: AppNotification = {
      id: `NOTIF-${Date.now()}-1`,
      userId: PROVIDER_USER.id,
      role: 'PROVIDER',
      title: 'New Financing Application Received',
      message: `${newApp.userName} submitted application #${appNumber} for ${newApp.productName}.`,
      type: 'ACTION_REQUIRED',
      timestamp,
      read: false,
      relatedApplicationId: appId,
    };

    const customerNotif: AppNotification = {
      id: `NOTIF-${Date.now()}-2`,
      userId: newApp.userId,
      role: 'CUSTOMER',
      title: 'Application Received',
      message: `Your application #${appNumber} has been received by ${newApp.providerName}.`,
      type: 'SUCCESS',
      timestamp,
      read: false,
      relatedApplicationId: appId,
    };

    const audit: AuditLogEntry = {
      id: `AUDIT-${Date.now()}`,
      timestamp,
      actor: newApp.userName,
      role: 'CUSTOMER',
      action: 'SUBMIT_APPLICATION',
      resourceType: 'FINANCING_APPLICATION',
      resourceId: appId,
      details: `Submitted ${newApp.category} financing request of ${newApp.requestedAmount} to ${newApp.providerName}.`,
      country: newApp.country,
    };

    setState((prev) => ({
      ...prev,
      applications: [newApp, ...prev.applications],
      notifications: [providerNotif, customerNotif, ...prev.notifications],
      auditLogs: [audit, ...prev.auditLogs],
      activeDemoStep: 14,
    }));

    return newApp;
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus, notes?: string) => {
    const timestamp = new Date().toISOString();
    setState((prev) => {
      const apps = prev.applications.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status,
            updatedAt: timestamp,
            providerNotes: notes || app.providerNotes,
            statusHistory: [
              ...app.statusHistory,
              {
                status,
                timestamp,
                actor: prev.activeUser.name,
                notes,
              },
            ],
          };
        }
        return app;
      });

      const targetApp = prev.applications.find((a) => a.id === appId);

      const notif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        userId: targetApp?.userId || 'all',
        role: 'CUSTOMER',
        title: `Application Status Updated: ${status}`,
        message: `Your application status changed to ${status}. ${notes ? `Note: ${notes}` : ''}`,
        type: status === 'REJECTED' ? 'WARNING' : 'INFO',
        timestamp,
        read: false,
        relatedApplicationId: appId,
      };

      const audit: AuditLogEntry = {
        id: `AUDIT-${Date.now()}`,
        timestamp,
        actor: prev.activeUser.name,
        role: prev.activeRole,
        action: 'UPDATE_STATUS',
        resourceType: 'FINANCING_APPLICATION',
        resourceId: appId,
        details: `Status updated to ${status}. Notes: ${notes || 'None'}`,
        country: prev.activeCountry,
      };

      return {
        ...prev,
        applications: apps,
        notifications: [notif, ...prev.notifications],
        auditLogs: [audit, ...prev.auditLogs],
      };
    });
  };

  const uploadDocument = (appId: string, doc: Omit<ApplicationDocument, 'id' | 'uploadedAt'>) => {
    const timestamp = new Date().toISOString();
    const newDoc: ApplicationDocument = {
      ...doc,
      id: `DOC-${Date.now()}`,
      uploadedAt: timestamp,
    };

    setState((prev) => {
      const apps = prev.applications.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            documents: [...app.documents, newDoc],
            updatedAt: timestamp,
          };
        }
        return app;
      });

      return {
        ...prev,
        applications: apps,
      };
    });
  };

  const issueOffer = (appId: string, offerData: Omit<FinancingOffer, 'id' | 'issuedAt' | 'status'>) => {
    const timestamp = new Date().toISOString();
    const offerId = `OFFER-${Date.now()}`;

    const newOffer: FinancingOffer = {
      ...offerData,
      id: offerId,
      applicationId: appId,
      issuedAt: timestamp,
      status: 'PENDING',
    };

    setState((prev) => {
      const apps = prev.applications.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'OFFER_ISSUED' as ApplicationStatus,
            updatedAt: timestamp,
            offer: newOffer,
            statusHistory: [
              ...app.statusHistory,
              {
                status: 'OFFER_ISSUED' as ApplicationStatus,
                timestamp,
                actor: prev.activeUser.name,
                notes: `Issued financing offer of ${offerData.offeredAmount} at ${(offerData.approvedProfitRate * 100).toFixed(2)}% p.a.`,
              },
            ],
          };
        }
        return app;
      });

      const targetApp = prev.applications.find((a) => a.id === appId);

      const customerNotif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        userId: targetApp?.userId || 'all',
        role: 'CUSTOMER',
        title: 'Formal Shariah Financing Offer Available!',
        message: `${offerData.providerName} has issued a financing offer for your application. Review and accept in the portal.`,
        type: 'SUCCESS',
        timestamp,
        read: false,
        relatedApplicationId: appId,
      };

      const audit: AuditLogEntry = {
        id: `AUDIT-${Date.now()}`,
        timestamp,
        actor: prev.activeUser.name,
        role: 'PROVIDER',
        action: 'ISSUE_FINANCING_OFFER',
        resourceType: 'FINANCING_OFFER',
        resourceId: offerId,
        details: `Issued offer for application ${appId}: Amount ${offerData.offeredAmount}, Rate ${(offerData.approvedProfitRate * 100).toFixed(2)}%.`,
        country: prev.activeCountry,
      };

      return {
        ...prev,
        applications: apps,
        notifications: [customerNotif, ...prev.notifications],
        auditLogs: [audit, ...prev.auditLogs],
        activeDemoStep: 19,
      };
    });
  };

  const acceptOffer = (appId: string) => {
    const timestamp = new Date().toISOString();

    setState((prev) => {
      let createdAccount: ActiveFinancingAccount | null = null;

      const apps = prev.applications.map((app) => {
        if (app.id === appId && app.offer) {
          const updatedOffer: FinancingOffer = {
            ...app.offer,
            status: 'ACCEPTED',
          };

          const accNumber = `${app.country}-IB-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
          createdAccount = {
            id: `ACC-${Date.now()}`,
            applicationId: appId,
            accountNumber: accNumber,
            providerName: app.providerName,
            productName: app.productName,
            country: app.country,
            currency: COUNTRIES[app.country]?.currency || 'MYR',
            facilityAmount: app.offer.offeredAmount,
            outstandingBalance: app.offer.offeredAmount,
            profitRate: app.offer.approvedProfitRate,
            monthlyInstalment: app.offer.monthlyInstalment,
            tenureYears: app.offer.tenureYears,
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            disbursedDate: timestamp.split('T')[0],
            shariahStructure: app.shariahStructure,
            paymentProgress: 0,
            completedTenureMonths: 0,
            remainingTenureMonths: app.offer.tenureYears * 12,
          };

          return {
            ...app,
            status: 'ACCEPTED' as ApplicationStatus,
            updatedAt: timestamp,
            offer: updatedOffer,
            statusHistory: [
              ...app.statusHistory,
              {
                status: 'ACCEPTED' as ApplicationStatus,
                timestamp,
                actor: prev.activeUser.name,
                notes: 'Customer accepted Shariah financing offer and terms.',
              },
            ],
          };
        }
        return app;
      });

      const notif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        userId: prev.activeUser.id,
        role: 'CUSTOMER',
        title: 'Financing Offer Confirmed & Activated',
        message: 'Your financing facility has been activated. View repayment schedule in My Financing.',
        type: 'SUCCESS',
        timestamp,
        read: false,
        relatedApplicationId: appId,
      };

      const audit: AuditLogEntry = {
        id: `AUDIT-${Date.now()}`,
        timestamp,
        actor: prev.activeUser.name,
        role: 'CUSTOMER',
        action: 'ACCEPT_OFFER',
        resourceType: 'FINANCING_OFFER',
        resourceId: appId,
        details: 'Customer accepted financing offer.',
        country: prev.activeCountry,
      };

      return {
        ...prev,
        applications: apps,
        activeAccounts: createdAccount ? [createdAccount, ...prev.activeAccounts] : prev.activeAccounts,
        notifications: [notif, ...prev.notifications],
        auditLogs: [audit, ...prev.auditLogs],
        activeDemoStep: 22,
      };
    });
  };

  const declineOffer = (appId: string) => {
    const timestamp = new Date().toISOString();
    setState((prev) => {
      const apps = prev.applications.map((app) => {
        if (app.id === appId && app.offer) {
          return {
            ...app,
            status: 'DECLINED' as ApplicationStatus,
            updatedAt: timestamp,
            offer: { ...app.offer, status: 'DECLINED' as const },
            statusHistory: [
              ...app.statusHistory,
              {
                status: 'DECLINED' as ApplicationStatus,
                timestamp,
                actor: prev.activeUser.name,
                notes: 'Customer declined financing offer.',
              },
            ],
          };
        }
        return app;
      });

      return {
        ...prev,
        applications: apps,
      };
    });
  };

  const toggleCompareProduct = (productId: string) => {
    setState((prev) => {
      const current = prev.selectedCompareProductIds;
      if (current.includes(productId)) {
        return { ...prev, selectedCompareProductIds: current.filter((id) => id !== productId) };
      }
      if (current.length >= 3) {
        return { ...prev, selectedCompareProductIds: [current[1], current[2], productId] };
      }
      return { ...prev, selectedCompareProductIds: [...current, productId] };
    });
  };

  const clearComparison = () => {
    setState((prev) => ({ ...prev, selectedCompareProductIds: [] }));
  };

  const markNotificationRead = (notifId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n)),
    }));
  };

  const resetScenario = () => {
    setScenario(state.activeScenario);
  };

  return (
    <DemoStoreContext.Provider
      value={{
        state,
        setScenario,
        setRole,
        setCountry,
        setDemoStep,
        createApplication,
        updateApplicationStatus,
        uploadDocument,
        issueOffer,
        acceptOffer,
        declineOffer,
        toggleCompareProduct,
        clearComparison,
        markNotificationRead,
        resetScenario,
      }}
    >
      {children}
    </DemoStoreContext.Provider>
  );
};

export function useDemoStore(): DemoStoreContextType {
  const context = useContext(DemoStoreContext);
  if (!context) {
    throw new Error('useDemoStore must be used within a DemoStoreProvider');
  }
  return context;
}
