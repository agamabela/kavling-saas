"use client";

import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Receipt,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import { store } from "@/lib/store";
import { MockCustomer } from "@/lib/mock-data";
import { formatRupiah, formatIndonesianDate } from "@/lib/formatters";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getActiveUser, getHomeRouteForRole } from "@/lib/auth/session";

export default function DeveloperPage() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState(getActiveUser());
  const [customers, setCustomers] = useState(store.getCustomers("DEVELOPER"));
  const [units] = useState(store.getUnits());
  
  useEffect(() => {
    const user = getActiveUser();
    if (!user) {
      router.push("/login");
      return;
    }
    // Only DEVELOPER and PROJECT_ADMIN can access
    if (user.role !== "DEVELOPER" && user.role !== "PROJECT_ADMIN") {
      router.push(getHomeRouteForRole(user.role));
      return;
    }
    setActiveUser(user);
  }, [router]);

  if (!activeUser || (activeUser.role !== "DEVELOPER" && activeUser.role !== "PROJECT_ADMIN")) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-400">
        Memeriksa hak akses departemen...
      </div>
    );
  }
  
  // Modals & decision states
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [decision, setDecision] = useState<"APPROVE" | "REVISION" | "REJECT">("APPROVE");
  const [devNotes, setDevNotes] = useState("");
  
  // Milestone modal state
  const [activeKprCustId, setActiveKprCustId] = useState<string | null>(null);
  const [sp3kNumber, setSp3kNumber] = useState("");
  const [akadDate, setAkadDate] = useState("");

  const refreshData = () => {
    setCustomers([...store.getCustomers("DEVELOPER")]);
  };

  const underwritingQueue = customers.filter(
    (c) => c.pipelineStatus === "SUBMITTED_TO_DEV" || c.pipelineStatus === "REVISION_DEV"
  );

  const pendingBookings = customers.filter(
    (c) => c.pipelineStatus === "APPROVED_PENDING_BOOKING"
  );

  const kprPipeline = customers.filter(
    (c) =>
      c.pipelineStatus === "BOOKED" ||
      c.pipelineStatus === "KPR_PROCESSING" ||
      c.pipelineStatus === "AKAD_SCHEDULED"
  );

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const activeKprCustomer = customers.find((c) => c.id === activeKprCustId);

  const handleDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !devNotes) return;

    store.reviewDeveloper(selectedCustomerId, decision, devNotes);
    setSelectedCustomerId(null);
    setDevNotes("");
    refreshData();
  };

  const handleVerifyBooking = (customerId: string, isApproved: boolean) => {
    store.verifyBookingPayment(customerId, isApproved);
    refreshData();
  };

  const handleAdvanceKpr = (
    customerId: string,
    nextStatus: NonNullable<MockCustomer["kprMilestone"]>["status"]
  ) => {
    store.updateKprMilestone(customerId, nextStatus, {
      sp3kNumber: sp3kNumber || undefined,
      akadDate: akadDate || undefined,
    });
    setActiveKprCustId(null);
    setSp3kNumber("");
    setAkadDate("");
    refreshData();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Portal Underwriting Direksi Developer</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              Bambang Wijaya (Direksi)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Otoritas persetujuan alokasi unit kavling, validasi transfer booking fee, dan kontrol realisasi akad KPR.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
            <span className="text-slate-500">Antrean Persetujuan:</span>{" "}
            <strong className="text-amber-800 font-extrabold">{underwritingQueue.length} Pengajuan</strong>
          </div>
          <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
            <span className="text-slate-500">Booking Menunggu Verifikasi:</span>{" "}
            <strong className="text-blue-800 font-extrabold">{pendingBookings.length} Unit</strong>
          </div>
        </div>
      </div>

      {/* 1. Underwriting Approval Queue */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Persetujuan Alokasi Kavling & Kredit ({underwritingQueue.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Persetujuan otomatis mengunci unit (HOLD 48 Jam)</span>
        </div>

        {underwritingQueue.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {underwritingQueue.map((cust) => {
              const unit = units.find((u) => u.id === cust.interestedUnitId);
              const primarySim = cust.simulations.find((s) => s.isPrimary) || cust.simulations[0];

              return (
                <div
                  key={cust.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{cust.fullName}</h3>
                        <div className="text-xs text-slate-500">
                          Diajukan oleh: {cust.marketingName} (Disetujui SPV: Siti Rahmawati)
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {cust.pipelineStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                      <div>
                        <div className="text-slate-400">Kavling Pilihan</div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {cust.unitNumber} ({unit?.unitType})
                        </div>
                        <div className="text-[11px] text-blue-600 font-semibold">{formatRupiah(unit?.basePrice)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Penghasilan Nasabah</div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {formatRupiah(cust.monthlyIncome)}
                        </div>
                        <div className="text-[11px] text-slate-500">Cicilan lain: {formatRupiah(cust.existingObligations)}</div>
                      </div>
                    </div>

                    {cust.spvNotes && (
                      <div className="p-2.5 rounded-lg bg-purple-50/80 border border-purple-200 text-xs">
                        <strong className="text-purple-900">Catatan SPV:</strong>{" "}
                        <span className="text-purple-800">{cust.spvNotes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setSelectedCustomerId(cust.id);
                        setDevNotes("");
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm"
                    >
                      Beri Keputusan Direksi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Tidak ada pengajuan unit yang menunggu persetujuan Direksi saat ini.
          </div>
        )}
      </div>

      {/* 2. Booking Fee Payment Verification */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-blue-600" />
          <span>Verifikasi Pembayaran Booking Fee ({pendingBookings.length})</span>
        </h2>

        {pendingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBookings.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{c.fullName}</h3>
                      <div className="text-xs text-slate-500">Kavling: {c.unitNumber} (Status: HOLD 48 Jam)</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Menunggu Bukti Transfer
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    Booking fee standar: <strong>Rp 5.000.000</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-200/60">
                  <button
                    onClick={() => handleVerifyBooking(c.id, true)}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  >
                    Konfirmasi Transfer Masuk (Lock BOOKED)
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Semua unit hold telah terverifikasi booking fee-nya.
          </div>
        )}
      </div>

      {/* 3. KPR Milestone Tracking Kanban */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Monitoring Proses KPR Perbankan (Lead to Closing)</span>
          </h2>
          <span className="text-xs text-slate-400">Pantau perkembangan analisa kredit bank & SP3K</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Stage 1: Berkas KPR */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-700 pb-2 border-b border-slate-200">1. Kelengkapan Berkas</div>
              <div className="mt-2 space-y-2">
                {customers
                  .filter((c) => c.kprMilestone?.status === "DOCUMENTS_COLLECTION")
                  .map((c) => (
                    <div key={c.id} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <div className="font-bold text-slate-900">{c.fullName}</div>
                      <div className="text-[11px] text-slate-500">Kavling {c.unitNumber}</div>
                      <button
                        onClick={() => handleAdvanceKpr(c.id, "SUBMITTED_TO_BANK")}
                        className="mt-2 w-full py-1 text-[10px] font-bold bg-blue-600 text-white rounded"
                      >
                        Kirim ke Bank BTN →
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Stage 2: Bank Checking & SLIK */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-700 pb-2 border-b border-slate-200">2. BI Checking / SLIK</div>
              <div className="mt-2 space-y-2">
                {customers
                  .filter((c) => c.kprMilestone?.status === "BANK_CHECKING" || c.kprMilestone?.status === "SUBMITTED_TO_BANK")
                  .map((c) => (
                    <div key={c.id} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <div className="font-bold text-slate-900">{c.fullName}</div>
                      <div className="text-[11px] text-slate-500">Bank: {c.kprMilestone?.bankName}</div>
                      <button
                        onClick={() => handleAdvanceKpr(c.id, "SURVEY_APPRAISAL")}
                        className="mt-2 w-full py-1 text-[10px] font-bold bg-purple-600 text-white rounded"
                      >
                        SLIK Lolos (Appraisal) →
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Stage 3: Survey / Appraisal */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-700 pb-2 border-b border-slate-200">3. Appraisal & Analisa</div>
              <div className="mt-2 space-y-2">
                {customers
                  .filter((c) => c.kprMilestone?.status === "SURVEY_APPRAISAL")
                  .map((c) => (
                    <div key={c.id} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <div className="font-bold text-slate-900">{c.fullName}</div>
                      <div className="text-[11px] text-slate-500">Kavling {c.unitNumber}</div>
                      <button
                        onClick={() => {
                          setActiveKprCustId(c.id);
                        }}
                        className="mt-2 w-full py-1 text-[10px] font-bold bg-amber-600 text-white rounded"
                      >
                        Input Surat SP3K Bank →
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Stage 4: SP3K Terbit */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-700 pb-2 border-b border-slate-200">4. SP3K Terbit (Approved)</div>
              <div className="mt-2 space-y-2">
                {customers
                  .filter((c) => c.kprMilestone?.status === "SP3K_ISSUED" || c.kprMilestone?.status === "AKAD_SCHEDULED")
                  .map((c) => (
                    <div key={c.id} className="p-2.5 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                      <div className="font-bold text-slate-900">{c.fullName}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        SP3K: {c.kprMilestone?.sp3kNumber || "BTN/KPR/2026/89"}
                      </div>
                      <button
                        onClick={() => handleAdvanceKpr(c.id, "AKAD_COMPLETED")}
                        className="mt-2 w-full py-1 text-[10px] font-bold bg-emerald-600 text-white rounded"
                      >
                        Konfirmasi Akad (Unit SOLD) →
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Stage 5: Akad Completed */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-700 pb-2 border-b border-slate-200">5. Akad Selesai (Closing)</div>
              <div className="mt-2 space-y-2">
                {customers
                  .filter((c) => c.pipelineStatus === "AKAD_COMPLETED")
                  .map((c) => (
                    <div key={c.id} className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-300 shadow-2xs">
                      <div className="font-bold text-emerald-950 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{c.fullName}</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 mt-0.5">Kavling {c.unitNumber} (SOLD)</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Keputusan Direksi */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Keputusan Direksi: {selectedCustomer.fullName}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Kavling {selectedCustomer.unitNumber} • Gaji: {formatRupiah(selectedCustomer.monthlyIncome)}
            </p>

            <form onSubmit={handleDecision} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Pilih Keputusan</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecision("APPROVE")}
                    className={`p-2.5 rounded-lg border text-center font-bold text-xs transition ${
                      decision === "APPROVE"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Setujui (Hold Unit 48h)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision("REVISION")}
                    className={`p-2.5 rounded-lg border text-center font-bold text-xs transition ${
                      decision === "REVISION"
                        ? "border-amber-600 bg-amber-50 text-amber-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Minta Revisi
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision("REJECT")}
                    className={`p-2.5 rounded-lg border text-center font-bold text-xs transition ${
                      decision === "REJECT"
                        ? "border-rose-600 bg-rose-50 text-rose-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Tolak Deal
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Keputusan Direksi *</label>
                <textarea
                  required
                  rows={3}
                  value={devNotes}
                  onChange={(e) => setDevNotes(e.target.value)}
                  placeholder="Catatan underwriting direksi..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedCustomerId(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm"
                >
                  Simpan Keputusan Direksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Input SP3K */}
      {activeKprCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-2">Input Nomor SP3K Bank BTN</h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Surat Penegasan (SP3K) *</label>
                <input
                  type="text"
                  placeholder="Contoh: BTN/KPR/2026/0491"
                  value={sp3kNumber}
                  onChange={(e) => setSp3kNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setActiveKprCustId(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceKpr(activeKprCustomer.id, "SP3K_ISSUED")}
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                >
                  Terbitkan SP3K
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
