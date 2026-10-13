"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Building2,
  Settings,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Home,
  FileCheck2,
  AlertCircle,
  Landmark,
} from "lucide-react";
import { store } from "@/lib/store";
import { formatRupiah } from "@/lib/formatters";
import { getActiveUser, getHomeRouteForRole } from "@/lib/auth/session";
import { HeroSection } from "@/components/HeroSection";
import { KprCalculatorModal } from "@/components/KprCalculatorModal";

export default function HomePage() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState(getActiveUser());
  const [customers, setCustomers] = useState(store.getCustomers());
  const [units, setUnits] = useState(store.getUnits());
  const [projects] = useState(store.getProjects());
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);

  useEffect(() => {
    const user = getActiveUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Role Enforcement: If not Admin, redirect directly to their specific department workspace!
    if (user.role !== "PROJECT_ADMIN") {
      router.push(getHomeRouteForRole(user.role));
      return;
    }

    setActiveUser(user);

    const interval = setInterval(() => {
      setCustomers([...store.getCustomers()]);
      setUnits([...store.getUnits()]);
    }, 2000);
    return () => clearInterval(interval);
  }, [router]);

  // If user is not yet loaded or not admin, show minimal loader
  if (!activeUser || activeUser.role !== "PROJECT_ADMIN") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-400">
        Memuat ruang kerja departemen Anda...
      </div>
    );
  }

  const totalSold = units.filter((u) => u.status === "SOLD").length;
  const totalBooked = units.filter((u) => u.status === "BOOKED").length;
  const totalHold = units.filter((u) => u.status === "HOLD").length;
  const totalAvailable = units.filter((u) => u.status === "AVAILABLE").length;

  const grossSalesVolume = units
    .filter((u) => u.status === "BOOKED" || u.status === "SOLD")
    .reduce((sum, u) => sum + u.basePrice, 0);

  const pendingSpvReviews = customers.filter(
    (c) => c.pipelineStatus === "SUBMITTED_TO_SPV" || c.pipelineStatus === "REVISION_SPV"
  ).length;

  const pendingDevApprovals = customers.filter(
    (c) => c.pipelineStatus === "SUBMITTED_TO_DEV" || c.pipelineStatus === "REVISION_DEV"
  ).length;

  const overdueFollowUps = customers.filter(
    (c) =>
      c.nextFollowUpDate &&
      new Date(c.nextFollowUpDate).getTime() < Date.now() &&
      c.pipelineStatus !== "DROPPED" &&
      c.pipelineStatus !== "AKAD_COMPLETED"
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. EXECUTIVE OPERATIONAL HEADER (Admin Master Overview) */}
      <HeroSection
        onOpenCalculator={() => setIsCalcModalOpen(true)}
        pendingSpvCount={pendingSpvReviews}
        pendingDevCount={pendingDevApprovals}
        totalGrossSales={grossSalesVolume}
      />

      {/* 2. REAL-TIME INVENTORY & METRICS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unit Available</div>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">{totalAvailable}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Siap dipasarkan tim sales</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unit Di-Hold (48 Jam)</div>
          <div className="text-2xl font-black text-amber-600 mt-1 font-mono">{totalHold}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Menunggu transfer booking fee</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unit Ter-Booking</div>
          <div className="text-2xl font-black text-blue-700 mt-1 font-mono">{totalBooked}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verifikasi berkas KPR bank</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unit Sold (Akad)</div>
          <div className="text-2xl font-black text-slate-950 mt-1 font-mono">{totalSold}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Akad kredit bank selesai</div>
        </div>
      </div>

      {/* 3. BOTTLENECK RADAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-950">Radar Hambatan Alur (Bottleneck Monitor)</h3>
          </div>
          <span className="text-xs text-slate-400">Titik yang memerlukan tindakan segera</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            overdueFollowUps > 0 ? "bg-rose-50/70 border-rose-200 text-rose-950" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}>
            <div>
              <div className="font-bold text-sm">{overdueFollowUps} Follow-up Overdue</div>
              <div className="text-[11px] text-rose-700/80 mt-0.5">Melewati jadwal janji nasabah</div>
            </div>
            <Link href="/spv" className="text-xs font-bold underline">Lihat SPV &rarr;</Link>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            pendingSpvReviews > 0 ? "bg-purple-50/70 border-purple-200 text-purple-950" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}>
            <div>
              <div className="font-bold text-sm">{pendingSpvReviews} Menunggu Review SPV</div>
              <div className="text-[11px] text-purple-700/80 mt-0.5">Prospek diajukan sales</div>
            </div>
            <Link href="/spv" className="text-xs font-bold underline">Review &rarr;</Link>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            pendingDevApprovals > 0 ? "bg-amber-50/70 border-amber-200 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}>
            <div>
              <div className="font-bold text-sm">{pendingDevApprovals} Menunggu Approval Direksi</div>
              <div className="text-[11px] text-amber-800/80 mt-0.5">Otorisasi hold unit 48 jam</div>
            </div>
            <Link href="/developer" className="text-xs font-bold underline">Approve &rarr;</Link>
          </div>
        </div>
      </div>

      {/* 4. DEPARTMENT SHORTCUTS (Admin View) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950 tracking-tight">Navigasi Antar Departemen (Khusus Administrator)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Hanya akun Administrator yang memiliki akses lintas departemen</p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Akses Penuh Admin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/marketing"
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition border border-blue-200/60">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-sm">Sales Marketing</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ruang kerja sales: intake prospek, WA instant, dan simulasi KPR.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>Masuk Modul Sales</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/spv"
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition border border-purple-200/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-sm">Marketing SPV</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Supervisi tim sales, SLA follow-up, dan teruskan ke Developer.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Masuk Ruang SPV</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/developer"
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition border border-amber-200/60">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-sm">Developer Direksi</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Persetujuan deal, hold unit 48h, dan papan KPR perbankan.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>Masuk Underwriting</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/admin"
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition border border-emerald-200/60">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-sm">Project Admin</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Master kavling, suku bunga bank, dan audit log UU PDP.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Master Konfigurasi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </div>

      {/* Global KPR Modal */}
      <KprCalculatorModal isOpen={isCalcModalOpen} onClose={() => setIsCalcModalOpen(false)} />

    </div>
  );
}
