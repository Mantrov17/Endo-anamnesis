import React from "react";

import { HintedField } from "./HintedField";

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
  return (
    <HintedField hint={hint} noteKey={noteKey} noteLabel={noteLabel}>
      {children}
    </HintedField>
  );
};
