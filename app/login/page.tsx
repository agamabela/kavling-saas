"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  ShieldCheck,
  Building2,
  Settings,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  KeyRound,
} from "lucide-react";
import { SEED_USERS } from "@/lib/mock-data";
import { UserRole, ROLE_DISPLAY_NAMES } from "@/lib/auth/rbac";
import { setActiveUser, getHomeRouteForRole } from "@/lib/auth/session";
import { store } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("rian.marketing@bumiproperti.co.id");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleDepartmentQuickLogin = (role: UserRole) => {
    const user = SEED_USERS.find((u) => u.role === role);
    if (!user) return;

    // Set global store & session
    store.setCurrentRole(role);
    setActiveUser(user);

    // Redirect specifically to their department workspace
    const targetRoute = getHomeRouteForRole(role);
    router.push(targetRoute);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      setError("Email tidak terdaftar dalam sistem developer.");
      return;
    }

    store.setCurrentRole(user.role);
    setActiveUser(user);

    const targetRoute = getHomeRouteForRole(user.role);
    router.push(targetRoute);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-950 text-white font-black shadow-md mb-2">
            <Home className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Masuk Berdasarkan Departemen
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Sistem terisolasi per departemen. Anda hanya akan melihat modul dan data yang diizinkan sesuai peran Anda.
          </p>
        </div>

        {/* 1. Quick Department Sign-In Buttons */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span>Pilih Departemen / Peran Anda:</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {/* Marketing */}
            <button
              type="button"
              onClick={() => handleDepartmentQuickLogin("MARKETING")}
              className="group p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                    Sales Marketing
                  </div>
                  <div className="text-[11px] text-slate-500">Rian Pratama • Modul Sales & Prospek</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
            </button>

            {/* SPV */}
            <button
              type="button"
              onClick={() => handleDepartmentQuickLogin("SPV")}
              className="group p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-purple-900">
                    Marketing Supervisor (SPV)
                  </div>
                  <div className="text-[11px] text-slate-500">Siti Rahmawati • Supervisi & SLA Review</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Developer Direksi */}
            <button
              type="button"
              onClick={() => handleDepartmentQuickLogin("DEVELOPER")}
              className="group p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
                    Developer (Direksi)
                  </div>
                  <div className="text-[11px] text-slate-500">Bambang Wijaya • Underwriting & KPR Board</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-700 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => handleDepartmentQuickLogin("PROJECT_ADMIN")}
              className="group p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 flex items-center gap-1.5">
                    <span>Project Admin</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                      Bisa Switch Akun
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Administrator Master Data & Hak Akses</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

        {/* 2. Manual Form Login */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Atau Masuk dengan Email & Password:
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Email Kerja</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@bumiproperti.co.id"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
            >
              Masuk ke Departemen
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Keamanan Data Terlindungi UU PDP No. 27 Tahun 2022</span>
        </div>

      </div>
    </div>
  );
}
