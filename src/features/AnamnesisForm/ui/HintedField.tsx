import React, { useEffect, useRef, useState } from "react";

import { type Path, useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Textarea } from "@/shared/ui/Textarea";

import styles from "./styles.module.scss";

interface HintedFieldProps {
  hint?: string;
  noteKey?: string;
  noteLabel?: string;
  children: React.ReactNode;
}

export const HintedField: React.FC<HintedFieldProps> = ({
  hint,
  noteKey,
  noteLabel = "Примечание",
  children,
}) => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const [hintOpen, setHintOpen] = useState(false);

  const [noteOpen, setNoteOpen] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const notePath = noteKey
    ? (`notes.${noteKey}` as Path<AnamnesisFormData>)
    : null;

  const noteValue = notePath
    ? (watch(notePath) as string | undefined)
    : undefined;

  const noteVisible = noteOpen || Boolean(noteValue);

  const hasHint = Boolean(hint);

  /*
   * register/watch теперь гарантированно
   * существуют благодаря FormProvider.
   */
  const hasNote = Boolean(noteKey);

  useEffect(() => {
    if (!hintOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setHintOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHintOpen(false);
      }
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

  if (!hasHint && !hasNote) {
    return <>{children}</>;
  }

  return (
    <div className={styles.hintedField} ref={ref}>
      {children}

      <div className={styles.fieldIcons}>
        {hasHint && (
          <button
            type="button"
            className={styles.fieldIcon}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              setHintOpen((value) => !value);
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
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              setNoteOpen((value) => !value);
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

      {hasNote && noteVisible && notePath && (
        <div className={styles.noteBelow}>
          <Textarea label={noteLabel} {...register(notePath)} rows={2} />
        </div>
      )}
    </div>
  );
};
