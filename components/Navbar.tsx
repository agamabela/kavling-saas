"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  ShieldCheck,
  Building2,
  Settings,
  Calculator,
  ChevronDown,
  LogOut,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { store } from "@/lib/store";
import { UserRole, ROLE_DISPLAY_NAMES } from "@/lib/auth/rbac";
import { getActiveUser, setActiveUser } from "@/lib/auth/session";
import { KprCalculatorModal } from "./KprCalculatorModal";

export function Navbar({ onRoleChange }: { onRoleChange?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [activeUser, setLocalActiveUser] = useState(getActiveUser());
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  useEffect(() => {
    setLocalActiveUser(getActiveUser());
  }, [pathname]);

  const currentRole: UserRole = activeUser?.role || store.getCurrentUser().role;
  const isAdmin = currentRole === "PROJECT_ADMIN";

  const handleRoleSelect = (role: UserRole) => {
    store.setCurrentRole(role);
    const updated = store.getCurrentUser();
    setActiveUser(updated);
    setLocalActiveUser(updated);
    setIsRoleMenuOpen(false);
    if (onRoleChange) onRoleChange();
  };

  const handleLogout = () => {
    setActiveUser(null);
    setLocalActiveUser(null);
    router.push("/login");
  };

  // Build role-isolated nav links
  const getPermittedNavLinks = () => {
    if (!activeUser) return [];

    if (isAdmin) {
      // Admin has holistic access across all departments
      return [
        { href: "/", label: "Overview", icon: Home },
        { href: "/marketing", label: "Marketing", icon: Users },
        { href: "/spv", label: "SPV Review", icon: ShieldCheck },
        { href: "/developer", label: "Developer", icon: Building2 },
        { href: "/admin", label: "Admin Master", icon: Settings },
      ];
    }

    if (currentRole === "MARKETING") {
      return [{ href: "/marketing", label: "Sales Marketing", icon: Users }];
    }

    if (currentRole === "SPV") {
      return [{ href: "/spv", label: "Supervisi & Review SPV", icon: ShieldCheck }];
    }

    if (currentRole === "DEVELOPER") {
      return [{ href: "/developer", label: "Underwriting Direksi", icon: Building2 }];
    }

    return [];
  };

  const navLinks = getPermittedNavLinks();

  // If on login page, render minimal header
  if (pathname === "/login") {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black">
              <Home className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-950">
              Kavling<span className="text-emerald-600">SaaS</span>
            </span>
          </Link>
          <div className="text-xs text-slate-500 font-medium">Portal Internal Perumahan</div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand + Department Navigation */}
            <div className="flex items-center gap-4">
              <Link href={isAdmin ? "/" : `/${currentRole.toLowerCase()}`} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black">
                  <Home className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight text-slate-950 block leading-none">
                    Kavling<span className="text-emerald-600">SaaS</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Grand Harmoni Sentul</span>
                </div>
              </Link>

              {/* Department Badge */}
              <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs">
                <span className="text-slate-400">Departemen:</span>
                <span className="font-bold text-slate-900">{ROLE_DISPLAY_NAMES[currentRole]}</span>
              </div>

              {/* Dynamic Role-Filtered Navigation */}
              <nav className="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-slate-200">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Tools & Profile / Role Control */}
            <div className="flex items-center gap-3">
              {/* KPR Calculator (Available for all roles) */}
              <button
                onClick={() => setIsCalcOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition shadow-2xs"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Simulasi KPR</span>
                <span className="sm:hidden">KPR</span>
              </button>

              {/* ROLE SWITCHER: ONLY VISIBLE & USABLE IF ADMIN */}
              {isAdmin ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition shadow-2xs"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Switch Akun (Admin)</span>
                    <ChevronDown className="w-3 h-3 text-emerald-700" />
                  </button>

                  {isRoleMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                        <span>Hak Akses Admin Khusus</span>
                        <ShieldAlert className="w-3 h-3 text-emerald-600" />
                      </div>
                      {(["MARKETING", "SPV", "DEVELOPER", "PROJECT_ADMIN"] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleRoleSelect(r)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                            currentRole === r ? "font-bold text-emerald-700 bg-emerald-50/60" : "text-slate-700"
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{ROLE_DISPLAY_NAMES[r]}</div>
                            <div className="text-[10px] text-slate-400">
                              {r === "MARKETING" && "Simulasikan login sebagai Sales"}
                              {r === "SPV" && "Simulasikan login sebagai SPV"}
                              {r === "DEVELOPER" && "Simulasikan login sebagai Direksi"}
                              {r === "PROJECT_ADMIN" && "Kembali ke Administrator"}
                            </div>
                          </div>
                          {currentRole === r && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Non-Admin User Profile Pill: Pure Display, No Switching Permitted */
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    currentRole === "MARKETING" ? "bg-blue-600" :
                    currentRole === "SPV" ? "bg-purple-600" : "bg-amber-600"
                  }`} />
                  <span className="font-bold text-slate-900">{activeUser?.fullName || "Pengguna"}</span>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">({currentRole})</span>
                </div>
              )}

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                title="Keluar / Ganti Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Global KPR Modal */}
      <KprCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </>
  );
}
