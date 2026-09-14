import React from "react";
import { HintedField } from "./HintedField";
import { useFormFieldContext } from "./FormFieldContext";

interface FieldProps {
  hint?: string;
  noteKey?: string;
  noteLabel?: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  hint,
  noteKey,
  noteLabel,
  children,
}) => {
  const { register, watch } = useFormFieldContext();
  return (
    <HintedField
      hint={hint}
      noteKey={noteKey}
      noteLabel={noteLabel}
      register={register}
      watch={watch}
    >
      {children}
    </HintedField>
  );
};
