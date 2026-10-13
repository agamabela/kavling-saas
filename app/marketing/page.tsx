"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Phone,
  Calendar,
  AlertCircle,
  Home,
  Calculator,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Search,
} from "lucide-react";
import { store } from "@/lib/store";
import { MockCustomer, MockUnit } from "@/lib/mock-data";
import { formatRupiah, formatIndonesianDate, formatRelativeTime } from "@/lib/formatters";
import { maskNik, maskNpwp } from "@/lib/security/uu-pdp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { KprCalculatorModal } from "@/components/KprCalculatorModal";
import { KprSimulationResult } from "@/lib/kpr/calculator";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getActiveUser, getHomeRouteForRole } from "@/lib/auth/session";

export default function MarketingPage() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState(getActiveUser());
  const [customers, setCustomers] = useState(store.getCustomers("MARKETING"));
  const [units] = useState(store.getUnits());
  const [projects] = useState(store.getProjects());
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = getActiveUser();
    if (!user) {
      router.push("/login");
      return;
    }
    // Only MARKETING and PROJECT_ADMIN can access
    if (user.role !== "MARKETING" && user.role !== "PROJECT_ADMIN") {
      router.push(getHomeRouteForRole(user.role));
      return;
    }
    setActiveUser(user);
  }, [router]);

  if (!activeUser || (activeUser.role !== "MARKETING" && activeUser.role !== "PROJECT_ADMIN")) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-400">
        Memeriksa hak akses departemen...
      </div>
    );
  }
  
  // Modals
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isKprCalcOpen, setIsKprCalcOpen] = useState(false);
  const [isLogTouchpointOpen, setIsLogTouchpointOpen] = useState(false);

  // Form states
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadNik, setNewLeadNik] = useState("");
  const [newLeadIncome, setNewLeadIncome] = useState("12000000");
  const [newLeadSource, setNewLeadSource] = useState<MockCustomer["leadSource"]>("INSTAGRAM");
  const [newLeadProject, setNewLeadProject] = useState(projects[0]?.id || "");
  const [newLeadNotes, setNewLeadNotes] = useState("");

  // Touchpoint log form
  const [activityType, setActivityType] = useState<"CALL" | "WHATSAPP" | "SITE_VISIT" | "MEETING">("WHATSAPP");
  const [activityNotes, setActivityNotes] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState(
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().split("T")[0]
  );

  const refreshData = () => {
    setCustomers([...store.getCustomers("MARKETING")]);
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery)
  );

  const availableUnits = units.filter((u) => u.status === "AVAILABLE");

  // Handle Add Lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    const lead = store.createLead({
      fullName: newLeadName,
      phoneNumber: newLeadPhone,
      email: newLeadEmail,
      nik: newLeadNik,
      monthlyIncome: parseInt(newLeadIncome, 10) || 0,
      leadSource: newLeadSource,
      projectId: newLeadProject,
      notes: newLeadNotes,
    });

    setIsAddLeadOpen(false);
    refreshData();
    setSelectedCustomerId(lead.id);
    // Reset
    setNewLeadName("");
    setNewLeadPhone("");
    setNewLeadEmail("");
    setNewLeadNik("");
    setNewLeadNotes("");
  };

  // Handle Log Activity
  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !activityNotes) return;

    store.logFollowUp(
      selectedCustomer.id,
      activityType,
      activityNotes,
      new Date(nextFollowUpDate).toISOString()
    );

    setIsLogTouchpointOpen(false);
    setActivityNotes("");
    refreshData();
  };

  // Handle Unit Selection
  const handleSelectUnit = (unitId: string) => {
    if (!selectedCustomer) return;
    store.selectUnitForCustomer(selectedCustomer.id, unitId);
    refreshData();
  };

  // Handle Save Simulation
  const handleSaveSimulation = (simResult: KprSimulationResult) => {
    if (!selectedCustomer) return;
    store.saveSimulation(selectedCustomer.id, simResult);
    refreshData();
  };

  // Handle Submit to SPV
  const handleSubmitToSpv = () => {
    if (!selectedCustomer) return;
    if (!selectedCustomer.interestedUnitId) {
      alert("Pilih unit kavling terlebih dahulu sebelum mengajukan ke SPV!");
      return;
    }
    if (selectedCustomer.simulations.length === 0) {
      alert("Buat simulasi KPR terlebih dahulu sebelum mengajukan ke SPV!");
      return;
    }

    store.submitToSpv(selectedCustomer.id);
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Ruang Kerja Sales Marketing</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Rian Pratama
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola prospek nasabah, simulasikan KPR, jadwalkan follow-up, dan ajukan ke Supervisor.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Prospek Baru</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Leads Directory + 360 Customer Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lead List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau no. telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Leads Card Feed */}
          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.id === selectedCustomerId;
              const isOverdue =
                cust.nextFollowUpDate &&
                new Date(cust.nextFollowUpDate).getTime() < Date.now();

              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{cust.fullName}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">{cust.projectName}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {cust.pipelineStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatRelativeTime(cust.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertCircle className="w-3 h-3" />
                          <span>Overdue</span>
                        </span>
                      )}
                      <WhatsAppButton
                        phone={cust.phoneNumber}
                        customerName={cust.fullName}
                        projectName={cust.projectName}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer Detail 360 (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCustomer ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{selectedCustomer.fullName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      Status: {selectedCustomer.pipelineStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No. WhatsApp: {selectedCustomer.phoneNumber} • Sumber: {selectedCustomer.leadSource}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <WhatsAppButton
                    phone={selectedCustomer.phoneNumber}
                    customerName={selectedCustomer.fullName}
                    projectName={selectedCustomer.projectName}
                    size="sm"
                  />
                  <button
                    onClick={() => setIsLogTouchpointOpen(true)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                  >
                    + Catat Aktivitas
                  </button>
                </div>
              </div>

              {/* Financial & Personal Profile (UU PDP Protected) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Penghasilan Bulanan</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {formatRupiah(selectedCustomer.monthlyIncome)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Kewajiban / Cicilan Lain</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {formatRupiah(selectedCustomer.existingObligations)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Pekerjaan</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedCustomer.occupation || "-"}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">NIK KTP (UU PDP)</div>
                  <div className="font-mono text-slate-700 mt-0.5">{maskNik(selectedCustomer.nik)}</div>
                </div>
              </div>

              {/* Unit Selection Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Kavling / Unit yang Diminati
                  </h3>
                  {selectedCustomer.interestedUnitId && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unit Terpilih: {selectedCustomer.unitNumber}
                    </span>
                  )}
                </div>

                {selectedCustomer.interestedUnitId ? (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-emerald-950">
                        Kavling {selectedCustomer.unitNumber}
                      </div>
                      <div className="text-xs text-emerald-700 mt-0.5">
                        Harga: {formatRupiah(units.find((u) => u.id === selectedCustomer.interestedUnitId)?.basePrice)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectUnit("")}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Ganti Unit
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Pilih unit kavling yang tersedia:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableUnits.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleSelectUnit(u.id)}
                          className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition"
                        >
                          <div className="font-bold text-xs text-slate-900">{u.unitNumber} ({u.unitType})</div>
                          <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
                            {formatRupiah(u.basePrice)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* KPR Simulation Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Simulasi KPR & Uji Kelayakan (DSR)
                  </h3>
                  <button
                    onClick={() => setIsKprCalcOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>+ Buat Simulasi Baru</span>
                  </button>
                </div>

                {selectedCustomer.simulations.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCustomer.simulations.map((sim) => (
                      <div
                        key={sim.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{sim.presetName}</div>
                          <div className="text-slate-500 mt-0.5">
                            Tenor: {sim.tenorYears} Thn • DP: {sim.dpPercentage}% ({formatRupiah(sim.dpAmount)})
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-sm text-blue-700">
                            {formatRupiah(sim.monthlyInstallment)} / bln
                          </div>
                          <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            sim.affordabilityStatus === "PASS"
                              ? "bg-emerald-100 text-emerald-800"
                              : sim.affordabilityStatus === "WARNING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}>
                            DSR {sim.dsrPercentage}% ({sim.affordabilityStatus})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
                    Belum ada simulasi KPR yang tersimpan. Klik "Buat Simulasi Baru" untuk menghitung angsuran nasabah.
                  </div>
                )}
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Riwayat Aktivitas & Pendekatan
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCustomer.activities.map((act) => (
                    <div key={act.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-bold text-slate-800">[{act.activityType}]</span>
                        <span>{formatIndonesianDate(act.followUpDate, true)}</span>
                      </div>
                      <p className="text-slate-700">{act.outcomeNotes}</p>
                      <div className="mt-1.5 text-[11px] text-blue-600 font-medium">
                        Jadwal Follow-up Selanjutnya: {formatIndonesianDate(act.nextFollowUpDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar: Submit to SPV */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {selectedCustomer.pipelineStatus === "NEW_LEAD" ||
                  selectedCustomer.pipelineStatus === "FOLLOW_UP"
                    ? "Siap untuk diproses ke SPV?"
                    : `Nasabah saat ini berstatus: ${selectedCustomer.pipelineStatus}`}
                </div>
                {(selectedCustomer.pipelineStatus === "NEW_LEAD" ||
                  selectedCustomer.pipelineStatus === "FOLLOW_UP" ||
                  selectedCustomer.pipelineStatus === "REVISION_SPV") && (
                  <button
                    onClick={handleSubmitToSpv}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ajukan ke SPV</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">Pilih prospek nasabah di sebelah kiri.</div>
          )}
        </div>
      </div>

      {/* Modal: Tambah Prospek Baru */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-4">Input Data Prospek / Nasabah Baru</h2>
            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Contoh: Budi Gunawan"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="text"
                    required
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="budi@gmail.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penghasilan Bulanan (Rp)</label>
                  <input
                    type="number"
                    value={newLeadIncome}
                    onChange={(e) => setNewLeadIncome(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sumber Prospek (Lead Source)</label>
                  <select
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="INSTAGRAM">Instagram Ads</option>
                    <option value="FACEBOOK">Facebook Ads</option>
                    <option value="EXHIBITION">Pameran / Mall</option>
                    <option value="BROCHURE">Brosur / Flyering</option>
                    <option value="WALK_IN">Datang Langsung (Walk-in)</option>
                    <option value="REFERRAL">Referral / Rekomendasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Kebutuhan</label>
                <textarea
                  rows={2}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="Kriteria rumah, preferensi blok, rencana KPR..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  Simpan Prospek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Catat Aktivitas Touchpoint */}
      {isLogTouchpointOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-4">Catat Aktivitas Pendekatan (Follow-Up)</h2>
            <form onSubmit={handleLogActivity} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Aktivitas</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["WHATSAPP", "CALL", "SITE_VISIT", "MEETING"] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setActivityType(t)}
                      className={`p-2 rounded-lg border text-center font-bold text-[11px] transition ${
                        activityType === t
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hasil Pembicaraan / Catatan *</label>
                <textarea
                  required
                  rows={3}
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  placeholder="Misal: Sudah kirim simulasi KPR, nasabah berminat dan mengajak suami/istri survei Sabtu..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jadwal Follow-up Selanjutnya *</label>
                <input
                  type="date"
                  required
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsLogTouchpointOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global KPR Calculator linked to this customer */}
      {selectedCustomer && (
        <KprCalculatorModal
          isOpen={isKprCalcOpen}
          onClose={() => setIsKprCalcOpen(false)}
          initialPrice={
            units.find((u) => u.id === selectedCustomer.interestedUnitId)?.basePrice || 385000000
          }
          customerIncome={selectedCustomer.monthlyIncome}
          customerObligations={selectedCustomer.existingObligations}
          onSaveSimulation={handleSaveSimulation}
        />
      )}
    </div>
  );
}
