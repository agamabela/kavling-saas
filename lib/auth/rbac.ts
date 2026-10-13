/**
 * Role-Based Access Control (RBAC) definitions and helpers
 */

export type UserRole = "MARKETING" | "SPV" | "DEVELOPER" | "PROJECT_ADMIN";

export interface SessionUser {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  avatarUrl?: string;
  assignedProjectIds: string[];
}

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  MARKETING: "Sales Marketing",
  SPV: "Marketing Supervisor (SPV)",
  DEVELOPER: "Property Developer (Direksi)",
  PROJECT_ADMIN: "Project Management / Admin",
};

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  MARKETING: "bg-blue-100 text-blue-800 border-blue-200",
  SPV: "bg-purple-100 text-purple-800 border-purple-200",
  DEVELOPER: "bg-amber-100 text-amber-800 border-amber-200",
  PROJECT_ADMIN: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function hasPermission(
  userRole: UserRole,
  action: 
    | "create_lead"
    | "update_own_lead"
    | "review_spv"
    | "approve_developer"
    | "verify_booking_payment"
    | "manage_master_data"
    | "view_audit_logs"
): boolean {
  switch (action) {
    case "create_lead":
    case "update_own_lead":
      return userRole === "MARKETING" || userRole === "PROJECT_ADMIN";
    case "review_spv":
      return userRole === "SPV" || userRole === "PROJECT_ADMIN";
    case "approve_developer":
    case "verify_booking_payment":
      return userRole === "DEVELOPER" || userRole === "PROJECT_ADMIN";
    case "manage_master_data":
    case "view_audit_logs":
      return userRole === "PROJECT_ADMIN";
    default:
      return false;
  }
}
