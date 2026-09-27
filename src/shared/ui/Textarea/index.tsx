import React, {
  type ComponentPropsWithRef,
  useId,
  useLayoutEffect,
  useRef,
} from "react";

import styles from "./styles.module.scss";

type TextareaProps = ComponentPropsWithRef<"textarea"> & {
  label?: string;
  error?: string;
};

const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
  if (!textarea) {
    return;
  }

  /*
   * Сначала сбрасываем высоту, чтобы textarea
   * могла не только увеличиваться, но и уменьшаться
   * после удаления текста.
   */
  textarea.style.height = "auto";

  /*
   * +2px учитывают границы элемента.
   */
  textarea.style.height = `${textarea.scrollHeight + 2}px`;
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className,
  id,
  ref,

  onInput,

  "aria-describedby": ariaDescribedBy,

  "aria-invalid": ariaInvalid,

  ...props
}) => {
  const generatedId = useId();

  const textareaId = id ?? `textarea-${generatedId}`;

  const errorId = error ? `${textareaId}-error` : undefined;

  const describedBy = [ariaDescribedBy, errorId]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  const textareaClassName = [styles.textarea, className]
    .filter(Boolean)
    .join(" ");

  const internalRef = useRef<HTMLTextAreaElement | null>(null);

  const setRefs = (element: HTMLTextAreaElement | null) => {
    internalRef.current = element;

    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  /*
   * Нужен для уже заполненных textarea:
   * например, при открытии сохранённого анамнеза
   * или дневника на редактирование.
   */
  useLayoutEffect(() => {
    resizeTextarea(internalRef.current);
  }, [props.value, props.defaultValue]);

  const handleInput: React.FormEventHandler<HTMLTextAreaElement> = (event) => {
    resizeTextarea(event.currentTarget);

    onInput?.(event);
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}

      <textarea
        {...props}
        ref={setRefs}
        id={textareaId}
        className={textareaClassName}
        onInput={handleInput}
        aria-describedby={describedBy || undefined}
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
      />

      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};
