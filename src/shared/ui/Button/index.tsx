import React, { type ButtonHTMLAttributes } from "react";

import styles from "./styles.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}) => {
  const buttonClassName = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...props} type={type} className={buttonClassName}>
      {children}
    </button>
  );
};
