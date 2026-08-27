import React from "react";

/* =====================================================================
   Vertex Icon Component
   24×24 grid · 2px stroke (outline) · rounded line caps
   ===================================================================== */

export type IconName =
  | "bell"
  | "search"
  | "play"
  | "file"
  | "monitor"
  | "bookmark"
  | "chart"
  | "clock"
  | "smile"
  | "user"
  | "chevron-right"
  | "arrow-right"
  | "check"
  | "lock"
  | "external-link"
  | "play-circle"
  | "modules"
  | "difficulty"
  | "download"
  | "star";

export type IconVariant = "outline" | "filled";

interface IconProps {
  name: IconName;
  variant?: IconVariant;
  size?: number;
  className?: string;
  color?: string;
}

const icons: Record<IconName, { outline: string; filled?: string }> = {
  bell: {
    outline: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    filled: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="currentColor"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  search: {
    outline: `<circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    filled: `<circle cx="11" cy="11" r="8" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  },
  play: {
    outline: `<polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    filled: `<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>`,
  },
  file: {
    outline: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    filled: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  monitor: {
    outline: `<rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    filled: `<rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  },
  bookmark: {
    outline: `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    filled: `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"/>`,
  },
  chart: {
    outline: `<line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    filled: `<rect x="4" y="14" width="4" height="6" rx="1" fill="currentColor"/><rect x="10" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="16" y="10" width="4" height="10" rx="1" fill="currentColor"/>`,
  },
  clock: {
    outline: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    filled: `<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  smile: {
    outline: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    filled: `<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  },
  user: {
    outline: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>`,
    filled: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" fill="currentColor"/>`,
  },
  "chevron-right": {
    outline: `<polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  "arrow-right": {
    outline: `<line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  check: {
    outline: `<polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  lock: {
    outline: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>`,
    filled: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="currentColor"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>`,
  },
  "external-link": {
    outline: `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="15 3 21 3 21 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  },
  "play-circle": {
    outline: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><polygon points="10 8 16 12 10 16 10 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    filled: `<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>`,
  },
  modules: {
    outline: `<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>`,
  },
  difficulty: {
    outline: `<line x1="6" y1="20" x2="6" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="18" y1="20" x2="18" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  },
  download: {
    outline: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  },
  star: {
    outline: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    filled: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>`,
  },
};

export function Icon({
  name,
  variant = "outline",
  size = 24,
  className = "",
  color,
}: IconProps) {
  const iconData = icons[name];
  if (!iconData) return null;

  const svgContent = (variant === "filled" && iconData.filled) ? iconData.filled : iconData.outline;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={color ? { color } : undefined}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export default Icon;
