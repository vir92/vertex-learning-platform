import React from "react";

/* =====================================================================
   Vertex Progress Bar
   Orange fill · percentage label · rounded track
   ===================================================================== */

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        width: "100%",
      }}
    >
      {/* Track */}
      <div
        style={{
          flex: 1,
          height: "8px",
          borderRadius: "9999px",
          backgroundColor: "var(--color-neutral-100)",
          overflow: "hidden",
        }}
      >
        {/* Fill */}
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            borderRadius: "9999px",
            backgroundColor: "var(--color-primary-500)",
            transition: "width 400ms ease",
          }}
        />
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "var(--color-neutral-700)",
          whiteSpace: "nowrap",
        }}
      >
        {clamped}% complete
      </span>
    </div>
  );
}

export default ProgressBar;
