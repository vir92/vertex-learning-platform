import React from "react";
import { Icon } from "./Icon";

/* =====================================================================
   Vertex Status Indicator Component
   In Progress · Completed · Now Playing · Locked
   ===================================================================== */

type StatusType = "in-progress" | "completed" | "now-playing" | "locked";

interface StatusIndicatorProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  { label: string; color: string }
> = {
  "in-progress": { label: "In Progress", color: "var(--color-neutral-500)" },
  completed:     { label: "Completed",   color: "#16A34A" },
  "now-playing": { label: "Now Playing", color: "#DC2626" },
  locked:        { label: "Locked",      color: "var(--color-neutral-500)" },
};

function StatusIcon({ status }: { status: StatusType }) {
  const size = 18;

  switch (status) {
    case "in-progress":
      return (
        <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="7.5" stroke="var(--color-neutral-300)" strokeWidth="2" fill="none" />
          <path
            d="M9 1.5A7.5 7.5 0 0 1 16.5 9"
            stroke="var(--color-neutral-500)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
    case "completed":
      return (
        <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="8" fill="#16A34A" />
          <polyline
            points="5.5 9 8 11.5 12.5 6.5"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
    case "now-playing":
      return (
        <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6" fill="#DC2626" />
        </svg>
      );
    case "locked":
      return <Icon name="lock" size={size} color="var(--color-neutral-500)" />;
  }
}

export function StatusIndicator({ status, className = "" }: StatusIndicatorProps) {
  const cfg = statusConfig[status];

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        color: cfg.color,
      }}
    >
      <StatusIcon status={status} />
      {cfg.label}
    </span>
  );
}

export default StatusIndicator;
