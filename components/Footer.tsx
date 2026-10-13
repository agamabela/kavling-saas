"use client";

import React from "react";
import Link from "next/link";
import { Home, ShieldCheck, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Inspired by footer.design: Multi-column architectural density, regulatory credentials, live status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Regulatory (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black">
                <Home className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Kavling<span className="text-emerald-500">SaaS</span>
              </span>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Sistem operasi terpadu untuk pengembang perumahan Indonesia. Menghubungkan proses akuisisi prospek di lapangan, persetujuan direksi, penguncian kavling otomatis, dan analisa kredit KPR perbankan.
            </p>

            {/* Regulatory Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>UU PDP No. 27/2022</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span>Terdaftar PSE Kominfo</span>
              </div>
            </div>
          </div>

          {/* Column 2: Modul & Fitur */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Modul Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketing" className="hover:text-white transition">Sales Marketing Lapangan</Link>
              </li>
              <li>
                <Link href="/spv" className="hover:text-white transition">Supervisi & SLA SPV</Link>
              </li>
              <li>
                <Link href="/developer" className="hover:text-white transition">Underwriting Direksi</Link>
              </li>
              <li>
                <Link href="/marketing" className="hover:text-white transition">Simulasi KPR & DSR Ratio</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">Master Kavling & Audit Log</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Regulasi & Standar Perbankan */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Kepatuhan & Regulasi
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>Standar FLPP Kepmen PUPR</li>
              <li>Parameter SLIK OJK (BI Checking)</li>
              <li>Enkripsi NIK & NPWP Nasabah</li>
              <li>Audit Trail Forensik Immutable</li>
              <li>Jadwal Amortisasi Anuitas Resmi</li>
            </ul>
          </div>

          {/* Column 4: Kontak & Kantor */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Hubungi Kami
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Sentul Tower Innovation Hub, Babakan Madang, Kab. Bogor 16810</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+62 812-9876-5432 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>kontak@kavlingsaas.co.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Live Status & Copyright */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-300">Semua Sistem Operasional</span>
            <span>•</span>
            <span>Uptime 99.98%</span>
          </div>

          <div>
            © 2026 PT Kavling Teknologi Indonesia. Seluruh hak cipta dilindungi undang-undang.
          </div>
        </div>

      </div>
    </footer>
  );
}
