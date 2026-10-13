/**
 * Indonesian Personal Data Protection (UU PDP) Compliance Utilities
 * UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi
 */

export function maskNik(nik: string | null | undefined): string {
  if (!nik) return "-";
  const clean = nik.trim();
  if (clean.length < 8) return "******";
  // Display first 4 digits (province & regency code) and mask the rest
  return clean.substring(0, 4) + "************";
}

export function maskNpwp(npwp: string | null | undefined): string {
  if (!npwp) return "-";
  const clean = npwp.trim();
  if (clean.length < 8) return "******";
  return clean.substring(0, 2) + ".***.***.*-***.***";
}

export function maskEmail(email: string | null | undefined): string {
  if (!email) return "-";
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? name.substring(0, 2) + "***" : name + "***";
  return `${maskedName}@${domain}`;
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  userId: string | null;
  userName?: string;
  userRole?: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export function createAuditLog(
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, any>,
  userId?: string,
  userName?: string,
  userRole?: string
): AuditLogEntry {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    tenantId: "tenant-default-01",
    userId: userId || "system",
    userName: userName || "System Automated",
    userRole: userRole || "SYSTEM",
    action,
    entityType,
    entityId,
    changes: changes || {},
    ipAddress: "127.0.0.1",
    userAgent: "KavlingSaaS/1.0",
    createdAt: new Date().toISOString(),
  };
}
