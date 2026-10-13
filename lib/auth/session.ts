import { UserRole, SessionUser } from "./rbac";
import { SEED_USERS } from "../mock-data";

const SESSION_STORAGE_KEY = "kavlingsaas_active_user";

export function getActiveUser(): SessionUser | null {
  if (typeof window === "undefined") {
    return SEED_USERS[0]; // fallback during SSR
  }
  const saved = localStorage.getItem(SESSION_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
  }
  return null;
}

export function setActiveUser(user: SessionUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export function getHomeRouteForRole(role: UserRole): string {
  switch (role) {
    case "MARKETING":
      return "/marketing";
    case "SPV":
      return "/spv";
    case "DEVELOPER":
      return "/developer";
    case "PROJECT_ADMIN":
      return "/";
    default:
      return "/login";
  }
}
