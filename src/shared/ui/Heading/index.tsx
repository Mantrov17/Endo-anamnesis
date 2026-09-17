import React from "react";
import styles from "./styles.module.scss";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingVariant = "page" | "section" | "card" | "subsection";

interface HeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: HeadingLevel;
  variant?: HeadingVariant;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  variant = "section",
  className,
  children,
  ...props
}) => {
  const classNames = [styles.heading, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div role="heading" aria-level={level} className={classNames} {...props}>
      {children}
    </div>
  );
};
