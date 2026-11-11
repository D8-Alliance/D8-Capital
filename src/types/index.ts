export type CountryCode = 'MY' | 'TR' | 'AZ';
export type LocaleCode = 'en' | 'ms' | 'tr' | 'az';
export type DemoRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type DemoScenarioId = 'MY_PERSONAL' | 'TR_VEHICLE' | 'AZ_SME';

export type FinancingCategoryType =
  | 'personal'
  | 'vehicle'
  | 'property'
  | 'business'
  | 'equipment'
  | 'trade'
  | 'project'
  | 'takaful';

export type ShariahStructure =
  | 'Tawarruq / Commodity Murabahah'
  | 'Murabahah'
  | 'Ijarah Thumma Al-Bai (AITAB)'
  | 'Ijarah Muntahia Bittamleek'
  | 'Musharakah Mutanaqisah'
  | 'Musharakah'
  | 'Mudarabah'
  | 'Istisna'
  | 'Tabarru / Wakalah'
  | 'Illustrative Shariah Structure';

export type RateMethod = 'flat' | 'reducing';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  nativeName: string;
  localName?: string;
  currency: string;
  currencySymbol: string;
  defaultLocale: LocaleCode;
  supportedLocales: LocaleCode[];
  flag: string;
  phoneCode: string;
  activeCategories: FinancingCategoryType[];
  regulatoryBody: string;
  shariahRegulatoryBody?: string;
  regulatoryFramework?: string;
  maxDsr?: number;
  shariahFrameworkNote: string;
}

export interface FinancingProvider {
  id: string;
  name: string;
  code: string;
  country: CountryCode;
  type: 'Islamic Bank' | 'Participation Bank' | 'Islamic Financial Institution';
  logoText: string;
  colorScheme: {
    primary: string;
    bg: string;
    border: string;
  };
  rating: number;
  reviewsCount: number;
  shariahBoardSummary: string;
  headquarters: string;
  active: boolean;
}

export interface FinancingProduct {
  id: string;
  providerId: string;
  country: CountryCode;
  category: FinancingCategoryType;
  name: string;
  shariahStructure: ShariahStructure;
  rateMethod: RateMethod;
  annualProfitRate: number; // e.g. 0.045 for 4.5%
  minAmount: number;
  maxAmount: number;
  minTenureYears: number;
  maxTenureYears: number;
  marginOfFinancing: string; // e.g. "Up to 100%" or "Up to 90%"
  processingFee: string;
  stampDutyNote: string;
  takafulNote: string;
  earlySettlementIbra: string;
  eligibilitySummary: string;
  requiredDocumentsSummary: string[];
  keyFeatures: string[];
  targetAudience: 'Individual' | 'SME' | 'Corporate';
  productKind?: 'FINANCING' | 'TAKAFUL';
  takafulData?: {
    coverageType: string;
    coverageAmount: number;
    annualContribution: number;
    contributionFrequency: string;
  };
  pdsData?: {
    productDescription: string;
    majorObligations: string;
    financialPenaltyLatePayment: string;
    earlyTerminationTerms: string;
    contactComplaintChannel: string;
  };
  featured?: boolean;
}

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'DOCUMENTS_VERIFICATION'
  | 'PROVIDER_ASSESSMENT'
  | 'ADDITIONAL_INFO_REQUIRED'
  | 'OFFER_ISSUED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'REJECTED'
  | 'DISBURSED';

export interface ApplicationDocument {
  id: string;
  applicationId?: string;
  name: string;
  type: string;
  fileSize: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'ADDITIONAL_REQUIRED';
  uploadedAt: string;
  notes?: string;
}

export interface FinancingOffer {
  id: string;
  applicationId: string;
  providerId: string;
  providerName: string;
  offeredAmount: number;
  approvedProfitRate: number;
  rateMethod: RateMethod;
  tenureYears: number;
  monthlyInstalment: number;
  totalRepayment: number;
  totalProfit: number;
  shariahStructure: ShariahStructure;
  validUntil: string;
  issuedAt: string;
  termsAndConditions: string[];
  takafulContribution: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
}

export interface FinancingApplication {
  id: string;
  applicationNumber: string;
  scenarioId: DemoScenarioId;
  country: CountryCode;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userType: 'INDIVIDUAL' | 'BUSINESS';
  productId: string;
  productName: string;
  providerId: string;
  providerName: string;
  category: FinancingCategoryType;
  shariahStructure: ShariahStructure;
  rateMethod: RateMethod;
  requestedAmount: number;
  requestedTenureYears: number;
  estimatedProfitRate: number;
  estimatedMonthlyInstalment: number;
  purpose: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  applicantKyc: {
    fullName: string;
    idType: string;
    idNumber: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
    employmentType: string;
    employerName: string;
    monthlyIncome: number;
    existingCommitments: number;
    calculatedDsr: number;
    eligibilityStatus: 'POTENTIALLY_ELIGIBLE' | 'ADDITIONAL_INFO_REQUIRED' | 'MAY_NOT_MEET';
    // Business specific
    companyName?: string;
    registrationNumber?: string;
    businessSector?: string;
    operatingYears?: number;
    annualRevenue?: number;
  };
  documents: ApplicationDocument[];
  offer?: FinancingOffer;
  providerNotes?: string;
  statusHistory: {
    status: ApplicationStatus;
    timestamp: string;
    actor: string;
    notes?: string;
  }[];
}

export interface ActiveFinancingAccount {
  id: string;
  applicationId: string;
  accountNumber: string;
  providerName: string;
  productName: string;
  country: CountryCode;
  currency: string;
  facilityAmount: number;
  outstandingBalance: number;
  profitRate: number;
  monthlyInstalment: number;
  tenureYears: number;
  nextPaymentDate: string;
  disbursedDate: string;
  shariahStructure: ShariahStructure;
  paymentProgress: number; // 0-100%
  completedTenureMonths: number;
  remainingTenureMonths: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  role: DemoRole;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ACTION_REQUIRED';
  timestamp: string;
  read: boolean;
  relatedApplicationId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: DemoRole;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  country: CountryCode;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  country: CountryCode;
  type: 'INDIVIDUAL' | 'BUSINESS';
  idNumber?: string;
  phone?: string;
  monthlyIncome?: number;
  employerOrCompany?: string;
  providerName?: string;
  providerId?: string;
}
