/**
 * Indonesian Currency, Date, and Communication Formatters
 * In accordance with Indonesian real estate standards and UU PDP.
 */

export function formatRupiah(amount: number | string | bigint | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "Rp 0";
  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function parseRupiah(value: string): number {
  const clean = value.replace(/[^0-9]/g, "");
  return clean ? parseInt(clean, 10) : 0;
}

export function formatIndonesianDate(
  dateInput: string | Date | null | undefined,
  includeTime: boolean = false
): string {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  }).format(date);
}

export function formatRelativeTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Baru saja";
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatIndonesianDate(date);
}

export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

export function createWhatsAppUrl(
  phone: string,
  customerName: string,
  projectName?: string,
  customMessage?: string
): string {
  const normalized = normalizePhoneNumber(phone);
  const greeting = customMessage
    ? customMessage
    : `Halo Bapak/Ibu ${customerName}, perkenalkan saya dari tim Marketing ${
        projectName ? projectName : "Perumahan"
      }. Saya ingin menyapa dan membantu konsultasi mengenai unit dan simulasi KPR yang diminati. Apakah ada waktu luang untuk berdiskusi?`;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(greeting)}`;
}
