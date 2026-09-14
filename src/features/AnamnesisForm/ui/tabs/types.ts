import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { AnamnesisFormData } from "@/shared";

export interface TabProps {
  register: UseFormRegister<AnamnesisFormData>;
  watch: UseFormWatch<AnamnesisFormData>;
  setValue: UseFormSetValue<AnamnesisFormData>; // NEW
  control: Control<AnamnesisFormData>;
  errors: FieldErrors<AnamnesisFormData>;
}
