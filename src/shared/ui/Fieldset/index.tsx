import React from "react";
import styles from "./styles.module.scss";

interface FieldsetProps {
  legend: string;
  children: React.ReactNode;
}

export const Fieldset: React.FC<FieldsetProps> = ({ legend, children }) => {
  return (
    <fieldset className={styles.fieldset}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
};
