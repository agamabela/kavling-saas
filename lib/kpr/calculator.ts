/**
 * Indonesian KPR (Kredit Pemilikan Rumah) Calculation Engine
 * Supports Commercial KPR (Annuity, Fixed-then-Floating) & FLPP (Subsidized).
 */

export type RateSchemeType = "COMMERCIAL" | "FLPP_SUBSIDIZED";
export type AffordabilityStatus = "PASS" | "WARNING" | "FAIL";

export interface KprCalculationInput {
  propertyPrice: number;
  downPaymentAmount?: number;
  downPaymentPercent?: number;
  tenorYears: number;
  schemeType: RateSchemeType;
  fixedRatePercent: number; // e.g., 5.0 for FLPP or 3.75 for promo
  fixedPeriodYears?: number; // e.g., 3 for 3-year fixed, or full tenor for FLPP
  floatingRatePercent?: number; // e.g., 11.5
  customerMonthlyIncome: number;
  customerExistingObligations?: number;
}

export interface AmortizationScheduleRow {
  year: number;
  interestRate: number;
  monthlyInstallment: number;
  yearlyPrincipal: number;
  yearlyInterest: number;
  remainingPrincipal: number;
}

export interface KprSimulationResult {
  propertyPrice: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  loanAmount: number; // Plafon KPR
  tenorYears: number;
  schemeType: RateSchemeType;
  
  initialMonthlyInstallment: number;
  floatingMonthlyInstallment: number | null;
  totalInterestPaid: number;
  totalPayment: number;
  
  // Affordability metrics
  totalMonthlyObligations: number;
  dsrPercentage: number;
  affordabilityStatus: AffordabilityStatus;
  affordabilityRemarks: string;
  flppIncomeEligible?: boolean;
  
  schedule: AmortizationScheduleRow[];
}

/**
 * Standard Annuity Monthly Installment Formula (PMT)
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateAnnuityMonthlyInstallment(
  principal: number,
  annualRatePct: number,
  months: number
): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRatePct <= 0) return Math.round(principal / months);

  const monthlyRate = annualRatePct / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, months);
  const installment = (principal * (monthlyRate * factor)) / (factor - 1);
  return Math.round(installment);
}

export function calculateKpr(input: KprCalculationInput): KprSimulationResult {
  const propertyPrice = input.propertyPrice;
  
  // Resolve Down Payment
  let dpAmount = input.downPaymentAmount || 0;
  let dpPercent = input.downPaymentPercent || 0;

  if (input.downPaymentAmount && !input.downPaymentPercent) {
    dpPercent = (dpAmount / propertyPrice) * 100;
  } else if (input.downPaymentPercent) {
    dpAmount = (propertyPrice * input.downPaymentPercent) / 100;
  } else {
    // Default 10%
    dpPercent = input.schemeType === "FLPP_SUBSIDIZED" ? 1 : 10;
    dpAmount = (propertyPrice * dpPercent) / 100;
  }

  const loanAmount = Math.max(0, propertyPrice - dpAmount);
  const totalMonths = input.tenorYears * 12;
  const fixedYears = input.schemeType === "FLPP_SUBSIDIZED" 
    ? input.tenorYears 
    : (input.fixedPeriodYears || input.tenorYears);
  const fixedMonths = Math.min(fixedYears * 12, totalMonths);

  // 1. Initial installment during Fixed Period
  const initialMonthlyInstallment = calculateAnnuityMonthlyInstallment(
    loanAmount,
    input.fixedRatePercent,
    totalMonths
  );

  // 2. Amortization and Floating Period computation
  const schedule: AmortizationScheduleRow[] = [];
  let remainingBalance = loanAmount;
  let totalInterestAccumulated = 0;
  let floatingInstallment: number | null = null;

  for (let y = 1; y <= input.tenorYears; y++) {
    const isFixedPeriod = y <= fixedYears;
    const currentRate = isFixedPeriod ? input.fixedRatePercent : (input.floatingRatePercent || input.fixedRatePercent);
    const remainingMonthsAtYearStart = (input.tenorYears - y + 1) * 12;

    // Recalculate installment when floating rate kicks in
    let currentInstallment = initialMonthlyInstallment;
    if (!isFixedPeriod && input.floatingRatePercent) {
      currentInstallment = calculateAnnuityMonthlyInstallment(
        remainingBalance,
        currentRate,
        remainingMonthsAtYearStart
      );
      if (floatingInstallment === null) {
        floatingInstallment = currentInstallment;
      }
    }

    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    const monthlyRate = currentRate / 100 / 12;

    for (let m = 1; m <= 12; m++) {
      if (remainingBalance <= 0) break;
      const monthInterest = remainingBalance * monthlyRate;
      let monthPrincipal = currentInstallment - monthInterest;
      
      if (monthPrincipal > remainingBalance) {
        monthPrincipal = remainingBalance;
      }

      yearlyInterest += monthInterest;
      yearlyPrincipal += monthPrincipal;
      remainingBalance = Math.max(0, remainingBalance - monthPrincipal);
    }

    totalInterestAccumulated += yearlyInterest;

    schedule.push({
      year: y,
      interestRate: currentRate,
      monthlyInstallment: Math.round(currentInstallment),
      yearlyPrincipal: Math.round(yearlyPrincipal),
      yearlyInterest: Math.round(yearlyInterest),
      remainingPrincipal: Math.round(remainingBalance),
    });
  }

  const totalPayment = loanAmount + Math.round(totalInterestAccumulated);

  // 3. Affordability / Debt-to-Income / DSR Check
  const income = input.customerMonthlyIncome || 0;
  const obligations = input.customerExistingObligations || 0;
  const totalMonthlyObligations = initialMonthlyInstallment + obligations;
  
  let dsrPercentage = 0;
  let affordabilityStatus: AffordabilityStatus = "PASS";
  let affordabilityRemarks = "Cicilan ideal (beban cicilan di bawah 35% penghasilan bulanan).";

  if (income > 0) {
    dsrPercentage = (totalMonthlyObligations / income) * 100;
    if (dsrPercentage > 45) {
      affordabilityStatus = "FAIL";
      affordabilityRemarks = "Risiko tinggi (beban cicilan melebihi 45% penghasilan). Potensi besar ditolak bank jika tanpa co-borrower/penghasilan pasangan.";
    } else if (dsrPercentage > 35) {
      affordabilityStatus = "WARNING";
      affordabilityRemarks = "Peringatan (beban cicilan 35%-45% penghasilan). Bank mungkin mensyaratkan slip gaji pasangan atau DP diperbesar.";
    }
  } else {
    affordabilityStatus = "WARNING";
    affordabilityRemarks = "Penghasilan belum diisi. Lengkapi data keuangan nasabah.";
  }

  // 4. Subsidized FLPP rules check (Kepmen PUPR threshold max ~Rp 8M / Rp 10M)
  let flppIncomeEligible = true;
  if (input.schemeType === "FLPP_SUBSIDIZED") {
    const maxFlppIncome = 8000000; // Standar max single/married FLPP nasional
    if (income > maxFlppIncome) {
      flppIncomeEligible = false;
      affordabilityRemarks += ` Catatan FLPP: Penghasilan melebihi batas subsidi PUPR (Maksimal Rp 8.000.000).`;
    }
  }

  return {
    propertyPrice,
    downPaymentAmount: Math.round(dpAmount),
    downPaymentPercent: parseFloat(dpPercent.toFixed(2)),
    loanAmount: Math.round(loanAmount),
    tenorYears: input.tenorYears,
    schemeType: input.schemeType,
    initialMonthlyInstallment,
    floatingMonthlyInstallment: floatingInstallment,
    totalInterestPaid: Math.round(totalInterestAccumulated),
    totalPayment,
    totalMonthlyObligations,
    dsrPercentage: parseFloat(dsrPercentage.toFixed(2)),
    affordabilityStatus,
    affordabilityRemarks,
    flppIncomeEligible,
    schedule,
  };
}
