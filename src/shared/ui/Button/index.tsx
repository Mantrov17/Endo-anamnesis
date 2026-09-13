import React, { type ButtonHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
