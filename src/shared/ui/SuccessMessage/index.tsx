import React from "react";
import styles from "./styles.module.scss";

export const SuccessMessage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className={styles.message}>{children}</div>;
};
