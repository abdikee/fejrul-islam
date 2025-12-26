"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [open, setOpen] = useState(false);
  const resolverRef = useRef(null);
  const optionsRef = useRef({ title: "Are you sure?", description: "This action cannot be undone.", confirmText: "Confirm", cancelText: "Cancel" });

  const confirm = useCallback((opts = {}) => {
    optionsRef.current = {
      title: opts.title || "Are you sure?",
      description: opts.description || "This action cannot be undone.",
      confirmText: opts.confirmText || "Confirm",
      cancelText: opts.cancelText || "Cancel",
    };
    setOpen(true);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  const handleCancel = () => {
    setOpen(false);
    resolverRef.current?.(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    resolverRef.current?.(true);
  };

  const { title, description, confirmText, cancelText } = optionsRef.current;

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx.confirm;
}
