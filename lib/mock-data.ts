import { SessionUser } from "./auth/rbac";
import { AuditLogEntry } from "./security/uu-pdp";

export interface MockProject {
  id: string;
  name: string;
  code: string;
  city: string;
  province: string;
  address: string;
  totalUnits: number;
}

export interface MockBlock {
  id: string;
  projectId: string;
  name: string;
  description: string;
}

export interface MockUnit {
  id: string;
  projectId: string;
  blockId: string;
  unitNumber: string;
  unitType: string;
  landAreaM2: number;
  buildingAreaM2: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  bookingFeeAmount: number;
  status: "AVAILABLE" | "HOLD" | "BOOKED" | "SOLD" | "BLOCKED";
  holdExpiresAt?: string;
  currentCustomerId?: string;
}

export interface MockBank {
  id: string;
  code: string;
  name: string;
  logo: string;
}

export interface MockRatePreset {
  id: string;
  bankId: string;
  name: string;
  schemeType: "COMMERCIAL" | "FLPP_SUBSIDIZED";
  fixedRatePct: number;
  fixedPeriodYears: number;
  floatingRatePct: number;
  minDpPct: number;
  maxTenorYears: number;
}

export interface MockFollowUpActivity {
  id: string;
  customerId: string;
  userId: string;
  userName: string;
  activityType: "CALL" | "WHATSAPP" | "SITE_VISIT" | "MEETING";
  outcomeNotes: string;
  followUpDate: string;
  nextFollowUpDate: string;
}

export interface MockKprSimulation {
  id: string;
  customerId: string;
  ratePresetId: string;
  presetName: string;
  unitPrice: number;
  dpAmount: number;
  dpPercentage: number;
  loanAmount: number;
  tenorYears: number;
  monthlyInstallment: number;
  dsrPercentage: number;
  affordabilityStatus: "PASS" | "WARNING" | "FAIL";
  isPrimary: boolean;
  createdAt: string;
}

export interface MockCustomer {
  id: string;
  marketingId: string;
  marketingName: string;
  projectId: string;
  projectName: string;
  interestedUnitId?: string;
  unitNumber?: string;
  pipelineStatus: 
    | "NEW_LEAD"
    | "FOLLOW_UP"
    | "SUBMITTED_TO_SPV"
    | "REVISION_SPV"
    | "SUBMITTED_TO_DEV"
    | "REVISION_DEV"
    | "APPROVED_PENDING_BOOKING"
    | "BOOKED"
    | "KPR_PROCESSING"
    | "AKAD_SCHEDULED"
    | "AKAD_COMPLETED"
    | "DROPPED";
  fullName: string;
  phoneNumber: string;
  email: string;
  nik: string;
  npwp: string;
  address: string;
  occupation: string;
  monthlyIncome: number;
  existingObligations: number;
  leadSource: "INSTAGRAM" | "FACEBOOK" | "EXHIBITION" | "BROCHURE" | "REFERRAL" | "WALK_IN" | "WEBSITE";
  nextFollowUpDate?: string;
  notes?: string;
  spvNotes?: string;
  devNotes?: string;
  createdAt: string;
  activities: MockFollowUpActivity[];
  simulations: MockKprSimulation[];
  bookingPayment?: {
    amount: number;
    paymentDate: string;
    receiptUrl: string;
    status: "PENDING" | "VERIFIED" | "REJECTED";
  };
  kprMilestone?: {
    status: "DOCUMENTS_COLLECTION" | "SUBMITTED_TO_BANK" | "BANK_CHECKING" | "SURVEY_APPRAISAL" | "SP3K_ISSUED" | "AKAD_SCHEDULED" | "AKAD_COMPLETED";
    bankName: string;
    sp3kNumber?: string;
    akadDate?: string;
  };
}

export const SEED_USERS: SessionUser[] = [
  {
    id: "user-mkt-1",
    tenantId: "tenant-bumi-01",
    fullName: "Rian Pratama",
    email: "rian.marketing@bumiproperti.co.id",
    role: "MARKETING",
    phoneNumber: "081298765432",
    assignedProjectIds: ["proj-ghs-01"],
  },
  {
    id: "user-spv-1",
    tenantId: "tenant-bumi-01",
    fullName: "Siti Rahmawati (SPV)",
    email: "siti.spv@bumiproperti.co.id",
    role: "SPV",
    phoneNumber: "081387654321",
    assignedProjectIds: ["proj-ghs-01", "proj-bac-02"],
  },
  {
    id: "user-dev-1",
    tenantId: "tenant-bumi-01",
    fullName: "Bambang Wijaya (Developer Direksi)",
    email: "bambang.direksi@bumiproperti.co.id",
    role: "DEVELOPER",
    phoneNumber: "081122334455",
    assignedProjectIds: ["proj-ghs-01", "proj-bac-02"],
  },
  {
    id: "user-adm-1",
    tenantId: "tenant-bumi-01",
    fullName: "Admin Project Management",
    email: "admin@bumiproperti.co.id",
    role: "PROJECT_ADMIN",
    phoneNumber: "081200998877",
    assignedProjectIds: ["proj-ghs-01", "proj-bac-02"],
  },
];

export const SEED_PROJECTS: MockProject[] = [
  {
    id: "proj-ghs-01",
    name: "Grand Harmoni Sentul",
    code: "GHS",
    city: "Bogor",
    province: "Jawa Barat",
    address: "Jl. Raya Sentul No. 88, Babakan Madang, Kab. Bogor",
    totalUnits: 120,
  },
  {
    id: "proj-bac-02",
    name: "Bukit Asri Cibinong",
    code: "BAC",
    city: "Bogor",
    province: "Jawa Barat",
    address: "Jl. Sukahati No. 12, Cibinong, Kab. Bogor",
    totalUnits: 65,
  },
];

export const SEED_BLOCKS: MockBlock[] = [
  {
    id: "blk-ghs-a",
    projectId: "proj-ghs-01",
    name: "Blok A (Cluster Melati)",
    description: "Cluster depan dekat gerbang utama",
  },
  {
    id: "blk-ghs-b",
    projectId: "proj-ghs-01",
    name: "Blok B (Cluster Anggrek)",
    description: "Cluster tengah view perbukitan",
  },
  {
    id: "blk-bac-a",
    projectId: "proj-bac-02",
    name: "Blok A",
    description: "Tahap 1",
  },
];

export const SEED_UNITS: MockUnit[] = [
  {
    id: "unit-01",
    projectId: "proj-ghs-01",
    blockId: "blk-ghs-a",
    unitNumber: "A-01",
    unitType: "Type 36/72",
    landAreaM2: 72,
    buildingAreaM2: 36,
    bedrooms: 2,
    bathrooms: 1,
    basePrice: 385000000,
    bookingFeeAmount: 5000000,
    status: "BOOKED",
    currentCustomerId: "cust-04",
  },
  {
    id: "unit-02",
    projectId: "proj-ghs-01",
    blockId: "blk-ghs-a",
    unitNumber: "A-02",
    unitType: "Type 36/72",
    landAreaM2: 72,
    buildingAreaM2: 36,
    bedrooms: 2,
    bathrooms: 1,
    basePrice: 385000000,
    bookingFeeAmount: 5000000,
    status: "HOLD",
    holdExpiresAt: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    currentCustomerId: "cust-03",
  },
  {
    id: "unit-03",
    projectId: "proj-ghs-01",
    blockId: "blk-ghs-a",
    unitNumber: "A-03",
    unitType: "Type 45/90",
    landAreaM2: 90,
    buildingAreaM2: 45,
    bedrooms: 3,
    bathrooms: 2,
    basePrice: 495000000,
    bookingFeeAmount: 5000000,
    status: "AVAILABLE",
  },
  {
    id: "unit-04",
    projectId: "proj-ghs-01",
    blockId: "blk-ghs-b",
    unitNumber: "B-05",
    unitType: "Type 36/72 (FLPP)",
    landAreaM2: 72,
    buildingAreaM2: 36,
    bedrooms: 2,
    bathrooms: 1,
    basePrice: 185000000,
    bookingFeeAmount: 2000000,
    status: "AVAILABLE",
  },
  {
    id: "unit-05",
    projectId: "proj-ghs-01",
    blockId: "blk-ghs-b",
    unitNumber: "B-06",
    unitType: "Type 36/72 (FLPP)",
    landAreaM2: 72,
    buildingAreaM2: 36,
    bedrooms: 2,
    bathrooms: 1,
    basePrice: 185000000,
    bookingFeeAmount: 2000000,
    status: "SOLD",
  },
];

export const SEED_BANKS: MockBank[] = [
  { id: "bank-btn", code: "BTN", name: "Bank BTN (Bank Tabungan Negara)", logo: "BTN" },
  { id: "bank-bca", code: "BCA", name: "Bank Central Asia (BCA)", logo: "BCA" },
  { id: "bank-mandiri", code: "MANDIRI", name: "Bank Mandiri", logo: "Mandiri" },
  { id: "bank-bsi", code: "BSI", name: "Bank Syariah Indonesia (BSI)", logo: "BSI" },
];

export const SEED_PRESETS: MockRatePreset[] = [
  {
    id: "preset-btn-flpp",
    bankId: "bank-btn",
    name: "BTN FLPP Sejahtera (Subsidi 5%)",
    schemeType: "FLPP_SUBSIDIZED",
    fixedRatePct: 5.0,
    fixedPeriodYears: 20,
    floatingRatePct: 5.0,
    minDpPct: 1.0,
    maxTenorYears: 20,
  },
  {
    id: "preset-bca-fix3",
    bankId: "bank-bca",
    name: "BCA KPR Promo Fix 3 Thn",
    schemeType: "COMMERCIAL",
    fixedRatePct: 4.25,
    fixedPeriodYears: 3,
    floatingRatePct: 11.0,
    minDpPct: 10.0,
    maxTenorYears: 25,
  },
  {
    id: "preset-mandiri-fix5",
    bankId: "bank-mandiri",
    name: "Mandiri KPR Milenial Fix 5 Thn",
    schemeType: "COMMERCIAL",
    fixedRatePct: 4.75,
    fixedPeriodYears: 5,
    floatingRatePct: 11.5,
    minDpPct: 5.0,
    maxTenorYears: 25,
  },
];

export const SEED_CUSTOMERS: MockCustomer[] = [
  {
    id: "cust-01",
    marketingId: "user-mkt-1",
    marketingName: "Rian Pratama",
    projectId: "proj-ghs-01",
    projectName: "Grand Harmoni Sentul",
    pipelineStatus: "NEW_LEAD",
    fullName: "Ahmad Fauzi",
    phoneNumber: "081234567890",
    email: "ahmad.fauzi@gmail.com",
    nik: "3201011204900001",
    npwp: "09.123.456.7-403.000",
    address: "Jl. Tebet Barat No. 14, Jakarta Selatan",
    occupation: "Karyawan Swasta (IT Engineer)",
    monthlyIncome: 14000000,
    existingObligations: 1200000,
    leadSource: "INSTAGRAM",
    nextFollowUpDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // Overdue!
    notes: "Tertarik rumah 2 kamar dekat stasiun atau tol Sentul. Tanya skema KPR BCA.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    activities: [
      {
        id: "act-1",
        customerId: "cust-01",
        userId: "user-mkt-1",
        userName: "Rian Pratama",
        activityType: "WHATSAPP",
        outcomeNotes: "Mengirimkan e-brosur GHS dan share lokasi kantor pemasaran.",
        followUpDate: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
        nextFollowUpDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
    ],
    simulations: [],
  },
  {
    id: "cust-02",
    marketingId: "user-mkt-1",
    marketingName: "Rian Pratama",
    projectId: "proj-ghs-01",
    projectName: "Grand Harmoni Sentul",
    interestedUnitId: "unit-03",
    unitNumber: "A-03",
    pipelineStatus: "SUBMITTED_TO_SPV",
    fullName: "Budi Santoso & Ratna",
    phoneNumber: "081311223344",
    email: "budi.santoso@yahoo.com",
    nik: "3201021508880002",
    npwp: "08.987.654.3-401.000",
    address: "Jl. Sukasari III No. 8, Bogor",
    occupation: "PNS Pemda Bogor",
    monthlyIncome: 17500000,
    existingObligations: 2000000,
    leadSource: "EXHIBITION",
    nextFollowUpDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    notes: "Sudah site visit. Cocok dengan Blok A-03 (Type 45/90). Siap diajukan ke SPV.",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    activities: [
      {
        id: "act-2",
        customerId: "cust-02",
        userId: "user-mkt-1",
        userName: "Rian Pratama",
        activityType: "SITE_VISIT",
        outcomeNotes: "Kunjungan lokasi bersama istri. Sangat menyukai posisi taman dan row jalan 8 meter.",
        followUpDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        nextFollowUpDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      },
    ],
    simulations: [
      {
        id: "sim-01",
        customerId: "cust-02",
        ratePresetId: "preset-bca-fix3",
        presetName: "BCA KPR Promo Fix 3 Thn (4.25%)",
        unitPrice: 495000000,
        dpAmount: 49500000,
        dpPercentage: 10,
        loanAmount: 445500000,
        tenorYears: 20,
        monthlyInstallment: 2758000,
        dsrPercentage: 27.18,
        affordabilityStatus: "PASS",
        isPrimary: true,
        createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "cust-03",
    marketingId: "user-mkt-1",
    marketingName: "Rian Pratama",
    projectId: "proj-ghs-01",
    projectName: "Grand Harmoni Sentul",
    interestedUnitId: "unit-02",
    unitNumber: "A-02",
    pipelineStatus: "APPROVED_PENDING_BOOKING",
    fullName: "Dewi Lestari",
    phoneNumber: "081599887766",
    email: "dewi.lestari@gmail.com",
    nik: "3201054406930005",
    npwp: "07.456.789.0-402.000",
    address: "Apartemen Kalibata City, Tower E, Jakarta",
    occupation: "Senior Accountant di BUMN",
    monthlyIncome: 16000000,
    existingObligations: 1500000,
    leadSource: "REFERRAL",
    nextFollowUpDate: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    notes: "Deal disetujui Direksi. Menunggu transfer booking fee Rp 5.000.000 (Unit di-HOLD).",
    devNotes: "Disetujui. Unit A-02 di-hold 48 jam. Segera infokan nomor VA pengembang.",
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    activities: [],
    simulations: [
      {
        id: "sim-02",
        customerId: "cust-03",
        ratePresetId: "preset-mandiri-fix5",
        presetName: "Mandiri KPR Milenial Fix 5 Thn (4.75%)",
        unitPrice: 385000000,
        dpAmount: 38500000,
        dpPercentage: 10,
        loanAmount: 346500000,
        tenorYears: 20,
        monthlyInstallment: 2235000,
        dsrPercentage: 23.34,
        affordabilityStatus: "PASS",
        isPrimary: true,
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "cust-04",
    marketingId: "user-mkt-1",
    marketingName: "Rian Pratama",
    projectId: "proj-ghs-01",
    projectName: "Grand Harmoni Sentul",
    interestedUnitId: "unit-01",
    unitNumber: "A-01",
    pipelineStatus: "KPR_PROCESSING",
    fullName: "Hendro Gunawan",
    phoneNumber: "081288776655",
    email: "hendro.gunawan@company.id",
    nik: "3201091211850003",
    npwp: "06.333.222.1-404.000",
    address: "Jl. Pajajaran No. 45, Bogor",
    occupation: "Branch Manager Retail",
    monthlyIncome: 22000000,
    existingObligations: 2500000,
    leadSource: "WALK_IN",
    notes: "Booking fee sudah lunas. Berkas KPR telah lengkap dan dikirim ke analis Bank BTN.",
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    activities: [],
    simulations: [],
    bookingPayment: {
      amount: 5000000,
      paymentDate: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
      receiptUrl: "/receipts/bukti-transfer-hendro.jpg",
      status: "VERIFIED",
    },
    kprMilestone: {
      status: "BANK_CHECKING",
      bankName: "Bank BTN",
    },
  },
];

export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-01",
    tenantId: "tenant-bumi-01",
    userId: "user-dev-1",
    userName: "Bambang Wijaya (Developer)",
    userRole: "DEVELOPER",
    action: "DEAL_APPROVED",
    entityType: "Customer",
    entityId: "cust-03",
    changes: {
      before: { status: "SUBMITTED_TO_DEV", unitStatus: "AVAILABLE" },
      after: { status: "APPROVED_PENDING_BOOKING", unitStatus: "HOLD" },
    },
    ipAddress: "182.253.110.24",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: "audit-02",
    tenantId: "tenant-bumi-01",
    userId: "user-spv-1",
    userName: "Siti Rahmawati (SPV)",
    userRole: "SPV",
    action: "LEAD_FORWARDED_TO_DEV",
    entityType: "Customer",
    entityId: "cust-03",
    changes: {
      before: { status: "SUBMITTED_TO_SPV" },
      after: { status: "SUBMITTED_TO_DEV" },
    },
    ipAddress: "114.122.34.89",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];
