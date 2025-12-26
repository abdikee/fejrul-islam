"use client";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

export default function GlobalToaster() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Replace intrusive browser alert() with in-page toast
    const originalAlert = window.alert;
    window.alert = (message) => {
      try {
        const text = typeof message === "string" ? message : JSON.stringify(message);
        toast({ title: "Notice", description: text });
      } catch {
        // Fallback to original if something goes wrong
        originalAlert(message);
      }
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  return <Toaster />;
}
