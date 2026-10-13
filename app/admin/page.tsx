"use client";

import React, { useState } from "react";
import {
  Settings,
  Building2,
  Landmark,
  ShieldAlert,
  Database,
  Layers,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { store } from "@/lib/store";
import { formatRupiah, formatIndonesianDate } from "@/lib/formatters";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getActiveUser, getHomeRouteForRole } from "@/lib/auth/session";

export default function AdminPage() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState(getActiveUser());
  const [activeTab, setActiveTab] = useState<"INVENTORY" | "BANKS" | "AUDIT">("INVENTORY");

  useEffect(() => {
    const user = getActiveUser();
    if (!user) {
      router.push("/login");
      return;
    }
    // Only PROJECT_ADMIN can access master config
    if (user.role !== "PROJECT_ADMIN") {
      router.push(getHomeRouteForRole(user.role));
      return;
    }
    setActiveUser(user);
  }, [router]);

  if (!activeUser || activeUser.role !== "PROJECT_ADMIN") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-400">
        Memeriksa hak akses administrator master...
      </div>
    );
  }

  const units = store.getUnits();
  const projects = store.getProjects();
  const presets = store.getRatePresets();
  const banks = store.getBanks();
  const auditLogs = store.getAuditLogs();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Project Management & Konfigurasi Master</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Administrator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan inventaris kavling, suku bunga rekanan bank, dan audit pelindungan data pribadi (UU PDP).
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("INVENTORY")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "INVENTORY"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Master Kavling & Unit ({units.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("BANKS")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "BANKS"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Suku Bunga & Rekanan Bank ({presets.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("AUDIT")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "AUDIT"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Audit Trail UU PDP ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Inventory Table */}
      {activeTab === "INVENTORY" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Daftar Kavling & Status Penjualan</h2>
            <span className="text-xs text-slate-400">Total Proyek: Grand Harmoni Sentul & Bukit Asri Cibinong</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b">
                <tr>
                  <th className="p-3">No. Kavling</th>
                  <th className="p-3">Tipe Rumah</th>
                  <th className="p-3">Luas (LT / LB)</th>
                  <th className="p-3">Kamar</th>
                  <th className="p-3">Harga Jual (IDR)</th>
                  <th className="p-3">Booking Fee</th>
                  <th className="p-3">Status Saat Ini</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {units.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{u.unitNumber}</td>
                    <td className="p-3 text-slate-700">{u.unitType}</td>
                    <td className="p-3 text-slate-600">{u.landAreaM2} m² / {u.buildingAreaM2} m²</td>
                    <td className="p-3 text-slate-600">{u.bedrooms} KT / {u.bathrooms} KM</td>
                    <td className="p-3 font-bold text-blue-700">{formatRupiah(u.basePrice)}</td>
                    <td className="p-3 text-slate-600">{formatRupiah(u.bookingFeeAmount)}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === "AVAILABLE"
                          ? "bg-emerald-100 text-emerald-800"
                          : u.status === "HOLD"
                          ? "bg-amber-100 text-amber-800"
                          : u.status === "BOOKED"
                          ? "bg-blue-100 text-blue-800"
                          : u.status === "SOLD"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-slate-200 text-slate-700"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bank Presets */}
      {activeTab === "BANKS" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Preset Suku Bunga & Program KPR Rekanan</h2>
            <span className="text-xs text-slate-400">Parameter acuan kalkulator KPR</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b">
                <tr>
                  <th className="p-3">Nama Program</th>
                  <th className="p-3">Skema</th>
                  <th className="p-3">Suku Bunga Fix</th>
                  <th className="p-3">Periode Fix</th>
                  <th className="p-3">Suku Bunga Floating</th>
                  <th className="p-3">Min. DP</th>
                  <th className="p-3">Maks. Tenor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {presets.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.schemeType === "FLPP_SUBSIDIZED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {p.schemeType}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{p.fixedRatePct}%</td>
                    <td className="p-3 text-slate-700">{p.fixedPeriodYears} Tahun</td>
                    <td className="p-3 text-slate-700">{p.floatingRatePct}%</td>
                    <td className="p-3 text-slate-700">{p.minDpPct}%</td>
                    <td className="p-3 text-slate-700">{p.maxTenorYears} Tahun</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: UU PDP Audit Trail */}
      {activeTab === "AUDIT" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Jejak Audit Pelindungan Data Pribadi (UU PDP)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Perekaman perubahan status, keputusan persetujuan, dan akses identitas nasabah yang tidak dapat diubah (immutable).
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-600">
              UU No. 27/2022
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 border-b font-sans">
                <tr>
                  <th className="p-3">Waktu Kejadian</th>
                  <th className="p-3">Pelaku / Pengguna</th>
                  <th className="p-3">Peran (Role)</th>
                  <th className="p-3">Aksi Sistem</th>
                  <th className="p-3">Entitas</th>
                  <th className="p-3">Rincian Perubahan (Payload Diff)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500 whitespace-nowrap">
                      {formatIndonesianDate(log.createdAt, true)}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{log.userName || log.userId}</td>
                    <td className="p-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-sans font-bold">
                        {log.userRole || "USER"}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-blue-700">{log.action}</td>
                    <td className="p-3 text-slate-600">{log.entityType} ({log.entityId.slice(0, 10)}...)</td>
                    <td className="p-3 text-[11px] text-slate-500 max-w-xs truncate">
                      {JSON.stringify(log.changes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
