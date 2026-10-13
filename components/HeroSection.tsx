"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Landmark,
  FileCheck2,
  AlertTriangle,
  Users,
} from "lucide-react";
import { formatRupiah } from "@/lib/formatters";

interface ExecutiveHeroProps {
  onOpenCalculator?: () => void;
  pendingSpvCount?: number;
  pendingDevCount?: number;
  totalGrossSales?: number;
}

export function HeroSection({
  onOpenCalculator,
  pendingSpvCount = 1,
  pendingDevCount = 1,
  totalGrossSales = 570000000,
}: ExecutiveHeroProps) {
  return (
    <section className="relative pt-2 pb-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Executive Progress Summary */}
          <div className="lg:col-span-7 space-y-5">
            {/* Project Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Monitoring Operasional Penjualan & KPR • Grand Harmoni Sentul</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Pusat Kendali Penjualan Kavling & Progres KPR Bank
            </h1>

            {/* Context Subtitle */}
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              Pantau seluruh pergerakan prospek dari input lapangan, verifikasi SPV, otorisasi penahanan unit 48 jam oleh direksi, hingga penerbitan SP3K dan realisasi akad kredit perbankan.
            </p>

            {/* Live Operational Action Shortcuts */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/marketing"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Ruang Kerja Sales Marketing</span>
              </Link>

              <Link
                href="/developer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold transition shadow-2xs"
              >
                <span>Antrean Persetujuan Direksi</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Critical Operational KPI Strip */}
            <div className="pt-5 border-t border-slate-200 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xs text-slate-400 font-medium">Omset Terkunci</div>
                <div className="text-lg sm:text-xl font-bold text-slate-950 font-mono mt-0.5">
                  {formatRupiah(totalGrossSales)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Antrean SPV & Direksi</div>
                <div className="text-lg sm:text-xl font-bold text-amber-700 font-mono mt-0.5">
                  {pendingSpvCount + pendingDevCount} Berkas
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Kepatuhan UU PDP</div>
                <div className="text-lg sm:text-xl font-bold text-emerald-700 font-mono mt-0.5">
                  100% Terenkripsi
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Inventory & Pipeline HUD Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-200">Radar Kavling Terkini (Blok A)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  REAL-TIME
                </span>
              </div>

              {/* Status breakdown slots */}
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">Kavling A-01</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-semibold border border-blue-700/50">
                        BOOKED
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Hendro Gunawan • Rp 385 Jt</div>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">SLIK BTN Diproses</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-500/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">Kavling A-02</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 font-semibold border border-amber-700/50">
                        HOLD (36 Jam)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Dewi Lestari • Rp 385 Jt</div>
                  </div>
                  <span className="text-[11px] text-amber-300 font-mono">Tunggu Bukti Bayar</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">Kavling A-03</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-semibold border border-emerald-700/50">
                        AVAILABLE
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Type 45/90 • Rp 495 Jt</div>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">Bisa Dipasarkan</span>
                </div>
              </div>

              {/* Botleneck Alert Banner */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Perhatian SPV: 1 follow-up overdue</span>
                </div>
                <Link href="/spv" className="text-slate-400 hover:text-white underline text-[11px]">
                  Tinjau &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
