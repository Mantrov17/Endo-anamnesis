import { createContext, useContext } from "react";
import type { UseFormRegister, UseFormWatch } from "react-hook-form";
import type { AnamnesisFormData } from "@/shared";

interface FormFieldContextValue {
  register: UseFormRegister<AnamnesisFormData>;
  watch: UseFormWatch<AnamnesisFormData>;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(
  null,
);

export const useFormFieldContext = () => {
  const ctx = useContext(FormFieldContext);
  if (!ctx) throw new Error("FormFieldContext is missing");
  return ctx;
};
