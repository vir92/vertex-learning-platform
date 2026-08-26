import React from "react";

/* =====================================================================
   Vertex Badge / Tag Component
   Outlined pill style with variant‑specific colors.
   ===================================================================== */

type BadgeVariant = "video" | "lesson" | "popular";

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

const variantMap: Record<
  BadgeVariant,
  { label: string; color: string; borderColor: string; bg: string }
> = {
  video: {
    label: "VIDEO",
    color: "var(--color-primary-500)",
    borderColor: "var(--color-primary-500)",
    bg: "rgba(249, 115, 22, 0.06)",
  },
  lesson: {
    label: "LESSON",
    color: "#16A34A",
    borderColor: "#16A34A",
    bg: "rgba(22, 163, 74, 0.06)",
  },
  popular: {
    label: "POPULAR",
    color: "#DC2626",
    borderColor: "#DC2626",
    bg: "rgba(220, 38, 38, 0.06)",
  },
};

export function Badge({ variant, children, className = "" }: BadgeProps) {
  const v = variantMap[variant];

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.125rem 0.625rem",
        borderRadius: "9999px",
        border: `1.5px solid ${v.borderColor}`,
        backgroundColor: v.bg,
        color: v.color,
        fontFamily: "var(--font-body)",
        fontSize: "0.6875rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        lineHeight: "1.25rem",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children ?? v.label}
    </span>
  );
}

export default Badge;
