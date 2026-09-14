import React from "react";
import styles from "./styles.module.scss";

export const Hint: React.FC<{ text: string }> = ({ text }) => (
  <span className={styles.hint} title={text}>
    ❓
  </span>
);
