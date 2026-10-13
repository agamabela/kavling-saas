"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  Users,
  Search,
} from "lucide-react";
import { store } from "@/lib/store";
import { MockCustomer } from "@/lib/mock-data";
import { formatRupiah, formatIndonesianDate, formatRelativeTime } from "@/lib/formatters";
import { WhatsAppButton } from "@/components/WhatsAppButton";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getActiveUser, getHomeRouteForRole } from "@/lib/auth/session";

export default function SpvPage() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState(getActiveUser());
  const [customers, setCustomers] = useState(store.getCustomers("SPV"));
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const user = getActiveUser();
    if (!user) {
      router.push("/login");
      return;
    }
    // Only SPV and PROJECT_ADMIN can access
    if (user.role !== "SPV" && user.role !== "PROJECT_ADMIN") {
      router.push(getHomeRouteForRole(user.role));
      return;
    }
    setActiveUser(user);
  }, [router]);

  if (!activeUser || (activeUser.role !== "SPV" && activeUser.role !== "PROJECT_ADMIN")) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-400">
        Memeriksa hak akses departemen...
      </div>
    );
  }
  
  // Direction form
  const [decision, setDecision] = useState<"FORWARD_TO_DEV" | "REVISION" | "DROP">("FORWARD_TO_DEV");
  const [spvNotes, setSpvNotes] = useState("");

  const refreshData = () => {
    setCustomers([...store.getCustomers("SPV")]);
  };

  const reviewQueue = customers.filter(
    (c) => c.pipelineStatus === "SUBMITTED_TO_SPV" || c.pipelineStatus === "REVISION_SPV"
  );

  const overdueFollowUps = customers.filter(
    (c) =>
      c.nextFollowUpDate &&
      new Date(c.nextFollowUpDate).getTime() < Date.now() &&
      c.pipelineStatus !== "DROPPED" &&
      c.pipelineStatus !== "AKAD_COMPLETED"
  );

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const handleProcessReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !spvNotes) return;

    store.reviewSpv(selectedCustomerId, decision, spvNotes);
    setSelectedCustomerId(null);
    setSpvNotes("");
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Ruang Kendali Supervisor (SPV)</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Siti Rahmawati
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pantau kepatuhan follow-up tim sales, kaji kelayakan calon pembeli, dan beri arahan strategi.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl">
            <span className="text-slate-500">Antrean Review:</span>{" "}
            <strong className="text-purple-700 font-extrabold">{reviewQueue.length} Nasabah</strong>
          </div>
          <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
            <span className="text-slate-500">SLA Overdue:</span>{" "}
            <strong className="text-rose-700 font-extrabold">{overdueFollowUps.length} Kasus</strong>
          </div>
        </div>
      </div>

      {/* Review Queue Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Daftar Pengajuan Menunggu Evaluasi SPV ({reviewQueue.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Verifikasi kelayakan sebelum diajukan ke Direksi Developer</span>
        </div>

        {reviewQueue.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewQueue.map((cust) => {
              const primarySim = cust.simulations.find((s) => s.isPrimary) || cust.simulations[0];
              return (
                <div
                  key={cust.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50/50 flex flex-col justify-between space-y-4 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{cust.fullName}</h3>
                        <div className="text-xs text-slate-500">
                          Marketing: <strong className="text-slate-700">{cust.marketingName}</strong>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        {cust.pipelineStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400">Unit:</span>{" "}
                        <strong className="text-slate-800">Kavling {cust.unitNumber || "Belum dipilih"}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Gaji:</span>{" "}
                        <strong className="text-slate-800">{formatRupiah(cust.monthlyIncome)}</strong>
                      </div>
                    </div>

                    {primarySim && (
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">{primarySim.presetName}</div>
                          <div className="text-[11px] text-slate-500">
                            Cicilan: {formatRupiah(primarySim.monthlyInstallment)}/bln
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          primarySim.affordabilityStatus === "PASS"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          DSR {primarySim.dsrPercentage}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <WhatsAppButton
                      phone={cust.phoneNumber}
                      customerName={cust.fullName}
                      projectName={cust.projectName}
                      size="sm"
                    />
                    <button
                      onClick={() => {
                        setSelectedCustomerId(cust.id);
                        setSpvNotes("");
                      }}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm flex items-center gap-1"
                    >
                      <span>Beri Arahan / Proses</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Tidak ada antrean pengajuan yang menunggu evaluasi SPV saat ini.
          </div>
        )}
      </div>

      {/* SLA & Overdue Monitor */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-600" />
          <span>Monitoring SLA Follow-Up Sales ({overdueFollowUps.length} Melewati Batas)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="p-3">Nama Nasabah</th>
                <th className="p-3">Sales Marketing</th>
                <th className="p-3">Target Follow-Up</th>
                <th className="p-3">Keterlambatan</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {overdueFollowUps.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{c.fullName}</td>
                  <td className="p-3 text-slate-700">{c.marketingName}</td>
                  <td className="p-3 text-rose-600 font-semibold">{formatIndonesianDate(c.nextFollowUpDate)}</td>
                  <td className="p-3 text-rose-600 font-bold">{formatRelativeTime(c.nextFollowUpDate)}</td>
                  <td className="p-3 text-right">
                    <WhatsAppButton
                      phone={c.phoneNumber}
                      customerName={c.fullName}
                      projectName={c.projectName}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Form Arahan SPV */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Evaluasi & Arahan SPV: {selectedCustomer.fullName}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Kavling: {selectedCustomer.unitNumber} • Penghasilan: {formatRupiah(selectedCustomer.monthlyIncome)}
            </p>

            <form onSubmit={handleProcessReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Pilih Keputusan SPV</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecision("FORWARD_TO_DEV")}
                    className={`p-2.5 rounded-lg border text-center font-bold text-xs transition ${
                      decision === "FORWARD_TO_DEV"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Teruskan ke Developer
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
                    onClick={() => setDecision("DROP")}
                    className={`p-2.5 rounded-lg border text-center font-bold text-xs transition ${
                      decision === "DROP"
                        ? "border-rose-600 bg-rose-50 text-rose-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Gugurkan (Drop)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Arahan SPV *</label>
                <textarea
                  required
                  rows={3}
                  value={spvNotes}
                  onChange={(e) => setSpvNotes(e.target.value)}
                  placeholder="Berikan catatan pertimbangan kelayakan kredit nasabah..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500"
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
                  className="px-5 py-2 font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm"
                >
                  Simpan Keputusan SPV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
