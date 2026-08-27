import React from "react";

export function NextJsIcon({ size = 52 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "14px",
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 180 180" fill="none">
        <mask
          id="mask0_next"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="180"
          height="180"
        >
          <circle cx="90" cy="90" r="90" fill="black" />
        </mask>
        <g mask="url(#mask0_next)">
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3831L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="url(#paint0_linear_next)"
          />
          <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_next)" />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_next"
            x1="109"
            y1="116.5"
            x2="144.5"
            y2="160.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_next"
            x1="121"
            y1="54"
            x2="120.799"
            y2="106.875"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function DockerIcon({ size = 52 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
        {/* Whale Body */}
        <path
          d="M51.5 28.5c-.8-.6-2.6-.5-3.8.4-.2-.6-.6-1.2-1.1-1.7-1.4-1.5-3.5-1.9-5.3-1.4-.2-1.3-1.1-2.5-2.2-3.3-.2-.2-.6-.4-.8-.5-.4-.2-.8-.4-1.2-.5l-.9-.2h-5.6v5.3h-5.3v-5.3h-5.3v5.3h-5.3v-5.3h-5.3v5.3h-5.3v-5.3H4.5v10.5c0 3.9 1.5 7.6 4.2 10.3s6.4 4.2 10.3 4.2c9.9 0 18.2-6.3 21.2-15.2 1.9.1 3.7-.4 5.1-1.4 1.5-1.2 2.2-3 2.1-4.9l-.4-1.8 4.5-1.6z"
          fill="#0091E2"
        />
        {/* Eye */}
        <circle cx="42" cy="31.5" r="1.2" fill="#FFFFFF" />
        {/* Bottom container row */}
        <rect x="10.5" y="22" width="4.2" height="4.2" rx="0.6" fill="#38BDF8" stroke="#0077B6" strokeWidth="0.8" />
        <rect x="15.8" y="22" width="4.2" height="4.2" rx="0.6" fill="#38BDF8" stroke="#0077B6" strokeWidth="0.8" />
        <rect x="21.1" y="22" width="4.2" height="4.2" rx="0.6" fill="#38BDF8" stroke="#0077B6" strokeWidth="0.8" />
        <rect x="26.4" y="22" width="4.2" height="4.2" rx="0.6" fill="#38BDF8" stroke="#0077B6" strokeWidth="0.8" />
        
        {/* Middle container row */}
        <rect x="15.8" y="16.7" width="4.2" height="4.2" rx="0.6" fill="#38BDF8" stroke="#0077B6" strokeWidth="0.8" />
        <rect x="21.1" y="16.7" width="4.2" height="4.2" rx="0.6" fill="#38BDF8" stroke="#0077B6" strokeWidth="0.8" />
        <rect x="26.4" y="16.7" width="4.2" height="4.2" rx="0.6" fill="#38BDF8" stroke="#0077B6" strokeWidth="0.8" />
        
        {/* Top container row */}
        <rect x="21.1" y="11.4" width="4.2" height="4.2" rx="0.6" fill="#38BDF8" stroke="#0077B6" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

export function TypeScriptIcon({ size = 52 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "14px",
        backgroundColor: "#2D79C7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 8px rgba(45, 121, 199, 0.25)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body), system-ui, -apple-system, sans-serif",
          fontWeight: 700,
          fontSize: size * 0.44,
          color: "#FFFFFF",
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        TS
      </span>
    </div>
  );
}
