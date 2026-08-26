import React from "react";
import { Icon } from "./Icon";

/* =====================================================================
   Vertex Button Component
   Height: 44px · Radius: 12px · Font: Inter Medium 14–16px
   Variants: primary, secondary, tertiary, text
   States: default, hover (CSS), disabled
   ===================================================================== */

type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const baseStyles: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  height: "44px",
  borderRadius: "12px",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: "0.875rem",
  lineHeight: 1,
  cursor: "pointer",
  transition: "all 150ms ease",
  border: "none",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    ...baseStyles,
    padding: "0 1rem",
    backgroundColor: "var(--color-primary-500)",
    color: "#FFFFFF",
  },
  secondary: {
    ...baseStyles,
    padding: "0 1rem",
    backgroundColor: "transparent",
    color: "var(--color-primary-500)",
    border: "1.5px solid var(--color-primary-500)",
  },
  tertiary: {
    ...baseStyles,
    padding: "0 0.75rem",
    backgroundColor: "transparent",
    color: "var(--color-neutral-700)",
    border: "none",
  },
  text: {
    ...baseStyles,
    padding: "0",
    backgroundColor: "transparent",
    color: "var(--color-primary-500)",
    border: "none",
    height: "auto",
  },
};

const disabledStyles: React.CSSProperties = {
  opacity: 0.4,
  cursor: "not-allowed",
  pointerEvents: "none",
};

export function Button({
  variant = "primary",
  disabled,
  children,
  style,
  className = "",
  ...rest
}: ButtonProps) {
  const combinedStyle: React.CSSProperties = {
    ...variantStyles[variant],
    ...(disabled ? disabledStyles : {}),
    ...style,
  };

  return (
    <button
      className={`vertex-btn vertex-btn-${variant} ${className}`}
      style={combinedStyle}
      disabled={disabled}
      {...rest}
    >
      {children}
      {variant === "tertiary" && <Icon name="external-link" size={14} />}
      {variant === "text" && <Icon name="play-circle" size={16} color="var(--color-primary-500)" />}
    </button>
  );
}

export default Button;
