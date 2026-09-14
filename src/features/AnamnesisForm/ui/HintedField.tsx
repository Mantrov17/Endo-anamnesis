import React, { useEffect, useRef, useState } from "react";
import type { Path, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Textarea } from "@/shared/ui/Textarea";
import type { AnamnesisFormData } from "@/shared";
import styles from "./styles.module.scss";

interface HintedFieldProps {
  hint?: string;
  noteKey?: string;
  noteLabel?: string;
  register?: UseFormRegister<AnamnesisFormData>;
  watch?: UseFormWatch<AnamnesisFormData>;
  children: React.ReactNode;
}

export const HintedField: React.FC<HintedFieldProps> = ({
  hint,
  noteKey,
  noteLabel = "Примечание",
  register,
  watch,
  children,
}) => {
  const [hintOpen, setHintOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const notePath = noteKey
    ? (`notes.${noteKey}` as Path<AnamnesisFormData>)
    : null;
  const noteValue =
    notePath && watch ? (watch(notePath) as string | undefined) : undefined;
  const noteVisible = noteOpen || Boolean(noteValue);

  const hasHint = Boolean(hint);
  const hasNote = Boolean(noteKey && register && watch);

  useEffect(() => {
    if (!hintOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setHintOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHintOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [hintOpen]);

  if (!hasHint && !hasNote) return <>{children}</>;

  return (
    <div className={styles.hintedField} ref={ref}>
      {children}
      <div className={styles.fieldIcons}>
        {hasHint && (
          <button
            type="button"
            className={styles.fieldIcon}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setHintOpen((v) => !v);
            }}
            aria-label="Показать подсказку"
            aria-expanded={hintOpen}
          >
            ?
          </button>
        )}
        {hasNote && (
          <button
            type="button"
            className={styles.fieldIcon}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setNoteOpen((v) => !v);
            }}
            aria-label="Добавить примечание"
            aria-expanded={noteVisible}
            title="Добавить примечание"
          >
            +
          </button>
        )}
      </div>
      {hintOpen && (
        <div className={styles.hintPopover} role="tooltip">
          {hint}
        </div>
      )}
      {hasNote && noteVisible && (
        <div className={styles.noteBelow}>
          <Textarea label={noteLabel} {...register!(notePath!)} rows={2} />
        </div>
      )}
    </div>
  );
};
