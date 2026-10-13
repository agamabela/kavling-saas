"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { createWhatsAppUrl } from "@/lib/formatters";

interface WhatsAppButtonProps {
  phone: string;
  customerName: string;
  projectName?: string;
  customMessage?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WhatsAppButton({
  phone,
  customerName,
  projectName,
  customMessage,
  size = "md",
  className = "",
}: WhatsAppButtonProps) {
  const url = createWhatsAppUrl(phone, customerName, projectName, customMessage);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition shadow-sm ${sizeClasses[size]} ${className}`}
      title={`Kirim pesan WhatsApp ke ${customerName}`}
    >
      <MessageSquare className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      <span>WhatsApp</span>
    </a>
  );
}
