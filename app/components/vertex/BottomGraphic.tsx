import React from "react";

export function BottomGraphic({ className = "" }: { className?: string }) {
  // Symmetrical stepped heights across 21 columns to span up to 1440px
  const bars = [
    { height: 35, opacity: 0.6 },
    { height: 50, opacity: 0.65 },
    { height: 75, opacity: 0.75 },
    { height: 105, opacity: 0.85 },
    { height: 140, opacity: 0.95 },
    { height: 115, opacity: 0.88 },
    { height: 85, opacity: 0.8 },
    { height: 60, opacity: 0.7 },
    { height: 45, opacity: 0.6 },
    { height: 40, opacity: 0.55 },
    { height: 45, opacity: 0.6 },
    { height: 60, opacity: 0.7 },
    { height: 85, opacity: 0.8 },
    { height: 115, opacity: 0.88 },
    { height: 140, opacity: 0.95 },
    { height: 105, opacity: 0.85 },
    { height: 75, opacity: 0.75 },
    { height: 50, opacity: 0.65 },
    { height: 35, opacity: 0.6 },
  ];

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: "150px",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        pointerEvents: "none",
        marginTop: "auto",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "120%",
          height: "120px",
          background:
            "radial-gradient(ellipse at bottom, rgba(251, 146, 60, 0.4) 0%, rgba(254, 215, 170, 0.15) 50%, transparent 80%)",
          filter: "blur(20px)",
        }}
      />

      {/* Stepped vertical bars */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1440px",
          height: "100%",
          gap: "12px",
          padding: "0 2rem",
        }}
      >
        {bars.map((bar, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              maxWidth: "68px",
              height: `${bar.height}px`,
              background: `linear-gradient(180deg, rgba(254, 215, 170, 0.35) 0%, rgba(251, 146, 60, 0.7) 45%, rgba(249, 115, 22, ${bar.opacity}) 100%)`,
              borderRadius: "4px 4px 0 0",
              boxShadow: "0 -2px 10px rgba(251, 146, 60, 0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default BottomGraphic;
