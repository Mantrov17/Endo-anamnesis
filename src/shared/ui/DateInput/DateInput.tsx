import React, { useEffect, useState } from "react";
import { Input } from "@/shared/ui/Input";

interface DateInputProps {
  label: string;
  /** ISO-дата (YYYY-MM-DD) или пустая строка */
  value: string;
  /** Возвращает ISO (YYYY-MM-DD) или "" */
  onChange: (iso: string) => void;
  placeholder?: string;
  error?: string;
}

// ISO (YYYY-MM-DD) → DD.MM.YYYY
const isoToDisplay = (iso: string | undefined | null): string => {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return "";
  return `${m[3]}.${m[2]}.${m[1]}`;
};

// DD.MM.YYYY → ISO (YYYY-MM-DD) или null, если дата неполная/невалидная
const displayToIso = (display: string): string | null => {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(display);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = Number(dd);
  const mo = Number(mm);
  const y = Number(yyyy);
  if (y < 1900 || y > 2100) return null;
  if (mo < 1 || mo > 12) return null;
  const daysInMonth = new Date(y, mo, 0).getDate();
  if (d < 1 || d > daysInMonth) return null;
  return `${yyyy}-${mm}-${dd}`;
};

// Оставляем только цифры, автодобавляем точки после 2 и 4 цифр
const autoFormat = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) out += ".";
    out += digits[i];
  }
  return out;
};

export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "дд.мм.гггг",
  error,
}) => {
  const [display, setDisplay] = useState<string>(isoToDisplay(value));

  // Синхронизация при внешнем изменении value (загрузка, reset и т.п.)
  useEffect(() => {
    setDisplay(isoToDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = autoFormat(e.target.value);
    setDisplay(formatted);
    const iso = displayToIso(formatted);
    onChange(iso ?? "");
  };

  const isValid = display === "" || displayToIso(display) !== null;

  return (
    <Input
      label={label}
      value={display}
      onChange={handleChange}
      placeholder={placeholder}
      inputMode="numeric"
      maxLength={10}
      error={error ?? (!isValid ? "Формат: дд.мм.гггг" : undefined)}
    />
  );
};
