"use client";

import React, { useState, useMemo } from "react";
import { Calculator, X, FileText, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { formatRupiah, parseRupiah } from "@/lib/formatters";
import { calculateKpr, KprSimulationResult, RateSchemeType } from "@/lib/kpr/calculator";
import { SEED_PRESETS, SEED_BANKS } from "@/lib/mock-data";

interface KprCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
  customerIncome?: number;
  customerObligations?: number;
  onSaveSimulation?: (result: KprSimulationResult) => void;
}

export function KprCalculatorModal({
  isOpen,
  onClose,
  initialPrice = 385000000,
  customerIncome = 15000000,
  customerObligations = 1000000,
  onSaveSimulation,
}: KprCalculatorModalProps) {
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset-bca-fix3");
  const [dpPercent, setDpPercent] = useState<number>(10);
  const [tenorYears, setTenorYears] = useState<number>(20);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(customerIncome);
  const [existingObligations, setExistingObligations] = useState<number>(customerObligations);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Active preset details
  const activePreset = useMemo(() => {
    return SEED_PRESETS.find((p) => p.id === selectedPresetId) || SEED_PRESETS[1];
  }, [selectedPresetId]);

  // Run calculation
  const result = useMemo(() => {
    return calculateKpr({
      propertyPrice,
      downPaymentPercent: dpPercent,
      tenorYears,
      schemeType: activePreset.schemeType,
      fixedRatePercent: activePreset.fixedRatePct,
      fixedPeriodYears: activePreset.fixedPeriodYears,
      floatingRatePercent: activePreset.floatingRatePct,
      customerMonthlyIncome: monthlyIncome,
      customerExistingObligations: existingObligations,
    });
  }, [propertyPrice, dpPercent, tenorYears, activePreset, monthlyIncome, existingObligations]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Simulasi & Kalkulator KPR</h2>
              <p className="text-xs text-slate-500">Estimasi angsuran, debt-service ratio (DSR), dan jadwal amortisasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Preset Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Pilihan Bank & Skema Suku Bunga
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SEED_PRESETS.map((p) => {
                const bank = SEED_BANKS.find((b) => b.id === p.bankId);
                const isSelected = p.id === selectedPresetId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPresetId(p.id);
                      if (p.schemeType === "FLPP_SUBSIDIZED") {
                        setDpPercent(1);
                      } else {
                        setDpPercent(10);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {bank?.code || "Bank"}
                      </span>
                      {p.schemeType === "FLPP_SUBSIDIZED" && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          SUBSIDI
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Fix: {p.fixedRatePct}% ({p.fixedPeriodYears} thn)
                      {p.schemeType === "COMMERCIAL" && ` • Float: ${p.floatingRatePct}%`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <h3 className="text-sm font-bold text-slate-800">Parameter Perhitungan</h3>

              {/* Property Price */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Harga Properti / Kavling</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-medium text-slate-400">Rp</span>
                  <input
                    type="text"
                    value={propertyPrice.toLocaleString("id-ID")}
                    onChange={(e) => setPropertyPrice(parseRupiah(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <label className="font-medium text-slate-600">Uang Muka (Down Payment)</label>
                  <span className="font-bold text-blue-700">{dpPercent}% ({formatRupiah(result.downPaymentAmount)})</span>
                </div>
                <input
                  type="range"
                  min={activePreset.minDpPct}
                  max="50"
                  step="1"
                  value={dpPercent}
                  onChange={(e) => setDpPercent(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Tenor */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <label className="font-medium text-slate-600">Jangka Waktu (Tenor)</label>
                  <span className="font-bold text-blue-700">{tenorYears} Tahun ({tenorYears * 12} Bulan)</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={activePreset.maxTenorYears}
                  step="1"
                  value={tenorYears}
                  onChange={(e) => setTenorYears(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Income & Obligations */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Penghasilan Bulanan</label>
                  <input
                    type="text"
                    value={monthlyIncome.toLocaleString("id-ID")}
                    onChange={(e) => setMonthlyIncome(parseRupiah(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Cicilan Lain Saat Ini</label>
                  <input
                    type="text"
                    value={existingObligations.toLocaleString("id-ID")}
                    onChange={(e) => setExistingObligations(parseRupiah(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold mb-1">
                  Estimasi Angsuran Bulanan (Periode Fix)
                </div>
                <div className="text-3xl font-extrabold tracking-tight">
                  {formatRupiah(result.initialMonthlyInstallment)}
                  <span className="text-sm font-normal text-blue-200"> / bulan</span>
                </div>

                {result.floatingMonthlyInstallment && (
                  <div className="mt-2 text-xs text-blue-200 border-t border-blue-800/80 pt-2 flex justify-between">
                    <span>Estimasi Saat Periode Floating:</span>
                    <span className="font-bold text-white">{formatRupiah(result.floatingMonthlyInstallment)} / bln</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-blue-800/80 text-xs">
                  <div>
                    <div className="text-blue-300">Plafon Pinjaman KPR</div>
                    <div className="font-bold text-sm text-white">{formatRupiah(result.loanAmount)}</div>
                  </div>
                  <div>
                    <div className="text-blue-300">Total Bunga ({tenorYears} thn)</div>
                    <div className="font-bold text-sm text-white">{formatRupiah(result.totalInterestPaid)}</div>
                  </div>
                </div>
              </div>

              {/* DSR Affordability Indicator */}
              <div className={`p-4 rounded-xl border ${
                result.affordabilityStatus === "PASS"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : result.affordabilityStatus === "WARNING"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {result.affordabilityStatus === "PASS" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : result.affordabilityStatus === "WARNING" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <div className="font-bold text-sm">
                    Uji Kelayakan Finansial: {result.affordabilityStatus === "PASS" ? "LOLOS (Aman)" : result.affordabilityStatus === "WARNING" ? "PERINGATAN" : "BERISIKO DITOLAK"}
                  </div>
                  <span className="ml-auto text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/80 shadow-sm">
                    DSR: {result.dsrPercentage}%
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{result.affordabilityRemarks}</p>
              </div>
            </div>
          </div>

          {/* Amortization Schedule Accordion */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 transition"
            >
              <span>Lihat Rincian Jadwal Angsuran Tahunan (Amortisasi)</span>
              <span className="text-blue-600">{showSchedule ? "Sembunyikan ▲" : "Tampilkan ▼"}</span>
            </button>
            {showSchedule && (
              <div className="max-h-60 overflow-y-auto p-2">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0">
                    <tr>
                      <th className="p-2">Tahun</th>
                      <th className="p-2">Suku Bunga</th>
                      <th className="p-2">Angsuran/Bln</th>
                      <th className="p-2">Pokok Terbayar</th>
                      <th className="p-2">Bunga Terbayar</th>
                      <th className="p-2">Sisa Pokok</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.schedule.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50">
                        <td className="p-2 font-bold">{row.year}</td>
                        <td className="p-2">{row.interestRate}%</td>
                        <td className="p-2 font-medium">{formatRupiah(row.monthlyInstallment)}</td>
                        <td className="p-2 text-slate-600">{formatRupiah(row.yearlyPrincipal)}</td>
                        <td className="p-2 text-slate-600">{formatRupiah(row.yearlyInterest)}</td>
                        <td className="p-2 font-bold text-slate-800">{formatRupiah(row.remainingPrincipal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Legal Disclaimer */}
          <div className="flex items-start gap-2 p-3 bg-slate-100 rounded-lg text-slate-500 text-[11px] leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Disclaimer:</strong> Perhitungan simulasi ini merupakan estimasi awal dan bukan merupakan persetujuan atau penawaran resmi dari pihak perbankan. Ketentuan bunga, biaya provisi, asuransi jiwa & kebakaran, serta persetujuan plafon final tunduk pada hasil analisa credit scoring bank pelaksana.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            <FileText className="w-4 h-4" />
            Cetak Lembar Simulasi
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-200/60 transition"
            >
              Tutup
            </button>
            {onSaveSimulation && (
              <button
                onClick={() => {
                  onSaveSimulation(result);
                  onClose();
                }}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
              >
                Simpan ke Profil Nasabah
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
