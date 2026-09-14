import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { DateInput } from "@/shared/ui/DateInput/DateInput";

interface DateFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  placeholder?: string;
}

export function DateField<T extends FieldValues>({
  label,
  name,
  watch,
  setValue,
  placeholder,
}: DateFieldProps<T>) {
  const value = (watch(name) as string | undefined) ?? "";
  return (
    <DateInput
      label={label}
      value={value}
      onChange={(iso) =>
        setValue(name, iso as PathValue<T, Path<T>>, { shouldDirty: true })
      }
      placeholder={placeholder}
    />
  );
}
