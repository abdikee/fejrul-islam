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

const PromptContext = createContext(null);

export function PromptProvider({ children }) {
  const [open, setOpen] = useState(false);
  const resolverRef = useRef(null);
  const optionsRef = useRef({ title: "Input Required", description: "Please provide a value:", confirmText: "Submit", cancelText: "Cancel" });
  const [value, setValue] = useState("");

  const prompt = useCallback((opts = {}) => {
    optionsRef.current = {
      title: opts.title || "Input Required",
      description: opts.description || "Please provide a value:",
      confirmText: opts.confirmText || "Submit",
      cancelText: opts.cancelText || "Cancel",
      defaultValue: opts.defaultValue || "",
      placeholder: opts.placeholder || "",
    };
    setValue(optionsRef.current.defaultValue || "");
    setOpen(true);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleCancel = () => {
    setOpen(false);
    resolverRef.current?.(null);
  };

  const handleConfirm = () => {
    setOpen(false);
    resolverRef.current?.(value || "");
  };

  const { title, description, confirmText, cancelText, placeholder } = optionsRef.current;

  const valueMemo = useMemo(() => ({ prompt }), [prompt]);

  return (
    <PromptContext.Provider value={valueMemo}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-3">
            <input
              className="w-full px-3 py-2 border rounded-md"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PromptContext.Provider>
  );
}

export function usePrompt() {
  const ctx = useContext(PromptContext);
  if (!ctx) throw new Error("usePrompt must be used within PromptProvider");
  return ctx.prompt;
}
