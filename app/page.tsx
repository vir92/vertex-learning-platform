export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
        color: "var(--color-neutral-900)",
        gap: "1.5rem",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="var(--color-primary-500)" />
          <path d="M12 2L3 7l9 5 9-5-9-5z" fill="var(--color-primary-400)" />
          <path d="M12 12l-9-5v10l9 5V12z" fill="var(--color-primary-500)" />
          <path d="M12 12l9-5v10l-9 5V12z" fill="var(--color-primary-400)" opacity="0.8" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: "1.5rem" }}>Vertex</span>
      </div>

      <p
        style={{
          fontSize: "1.125rem",
          color: "var(--color-neutral-500)",
          textAlign: "center",
          maxWidth: "420px",
          lineHeight: 1.6,
        }}
      >
        A modern learning platform focused on clarity, consistency, and
        intuitive experiences.
      </p>

      <a
        href="/design-system"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "44px",
          padding: "0 1.25rem",
          borderRadius: "12px",
          backgroundColor: "var(--color-primary-500)",
          color: "#fff",
          fontWeight: 500,
          fontSize: "0.875rem",
          textDecoration: "none",
          transition: "background-color 150ms ease",
        }}
      >
        View Design System →
      </a>
    </div>
  );
}
