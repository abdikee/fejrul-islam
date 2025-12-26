"use client";

import { toast } from "@/hooks/use-toast";

function toStringSafe(value) {
  if (typeof value === "string") return value;
  try { return JSON.stringify(value); } catch { return String(value); }
}

export const notify = {
  success(message, opts = {}) {
    toast({ title: opts.title || "Success", description: toStringSafe(message) });
  },
  error(message, opts = {}) {
    toast({ title: opts.title || "Error", description: toStringSafe(message), variant: "destructive" });
  },
  warning(message, opts = {}) {
    toast({ title: opts.title || "Warning", description: toStringSafe(message) });
  },
  info(message, opts = {}) {
    toast({ title: opts.title || "Info", description: toStringSafe(message) });
  },
};

export default notify;
