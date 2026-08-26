import React from "react";
import { Icon } from "./Icon";

/* =====================================================================
   Vertex Navigation Components
   Navbar · Breadcrumbs · Pagination
   ===================================================================== */

/* ---------- Navbar ---------- */

interface NavbarProps {
  className?: string;
  activeLink?: "courses" | "my-learning" | "none";
  showUser?: boolean;
  avatarSrc?: string;
  style?: React.CSSProperties;
}

export function Navbar({
  className = "",
  activeLink = "courses",
  showUser = false,
  avatarSrc,
  style,
}: NavbarProps) {
  return (
    <header
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        fontWeight: 500,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        {/* Logo */}
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 700,
            fontSize: "1.125rem",
            color: "var(--color-neutral-900)",
            textDecoration: "none",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2L3 7v10l9 5 9-5V7l-9-5z"
              fill="var(--color-primary-500)"
            />
            <path
              d="M12 2L3 7l9 5 9-5-9-5z"
              fill="var(--color-primary-400)"
            />
            <path
              d="M12 12l-9-5v10l9 5V12z"
              fill="var(--color-primary-500)"
            />
            <path
              d="M12 12l9-5v10l-9 5V12z"
              fill="var(--color-primary-400)"
              opacity="0.8"
            />
          </svg>
          <span>Vertex</span>
        </a>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a
            href="/courses"
            style={{
              color: activeLink === "courses" ? "var(--color-neutral-900)" : "var(--color-neutral-700)",
              fontWeight: activeLink === "courses" ? 500 : 400,
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
          >
            Courses
          </a>
          <a
            href="/my-learning"
            style={{
              color: activeLink === "my-learning" ? "var(--color-neutral-900)" : "var(--color-neutral-700)",
              fontWeight: activeLink === "my-learning" ? 500 : 400,
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
          >
            My Learning
          </a>
        </div>
      </div>

      {/* Right User actions */}
      {showUser && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            type="button"
            aria-label="Notifications"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.375rem",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-neutral-700)",
              transition: "background-color 150ms ease",
            }}
          >
            <Icon name="bell" size={20} color="var(--color-neutral-700)" />
          </button>
          
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              overflow: "hidden",
              border: "1.5px solid var(--color-neutral-200)",
              backgroundColor: "var(--color-neutral-100)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt="User Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#E2E8F0" />
                {/* Stylized woman portrait avatar matching mockup */}
                <circle cx="18" cy="14" r="6" fill="#A0AEC0" />
                <path
                  d="M8 32c0-5.523 4.477-10 10-10s10 4.477 10 10"
                  fill="#718096"
                />
              </svg>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Breadcrumbs ---------- */

interface BreadcrumbsProps {
  items: string[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      className={className}
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.8125rem",
        color: "var(--color-neutral-500)",
      }}
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <Icon name="chevron-right" size={14} color="var(--color-neutral-300)" />
          )}
          <a
            href="#"
            style={{
              color:
                i === items.length - 1
                  ? "var(--color-neutral-900)"
                  : "var(--color-neutral-500)",
              textDecoration: "none",
              fontWeight: i === items.length - 1 ? 500 : 400,
            }}
          >
            {item}
          </a>
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ---------- Pagination ---------- */

interface PaginationProps {
  current?: number;
  total?: number;
  className?: string;
}

export function Pagination({
  current = 1,
  total = 8,
  className = "",
}: PaginationProps) {
  // Show: prev, first 3 pages, ellipsis, last page, next
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= Math.min(3, total); i++) pages.push(i);
  if (total > 4) pages.push("...");
  if (total > 3) pages.push(total);

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: "8px",
    border: "1px solid var(--color-neutral-200)",
    backgroundColor: "transparent",
    fontFamily: "var(--font-body)",
    fontSize: "0.875rem",
    color: "var(--color-neutral-700)",
    cursor: "pointer",
    transition: "all 150ms ease",
  };

  const activeBtn: React.CSSProperties = {
    ...btnBase,
    backgroundColor: "var(--color-primary-500)",
    borderColor: "var(--color-primary-500)",
    color: "#FFFFFF",
    fontWeight: 600,
  };

  return (
    <nav
      className={className}
      aria-label="Pagination"
      style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
    >
      <button style={btnBase} aria-label="Previous page">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polyline
            points="15 18 9 12 15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            style={{
              width: 36,
              textAlign: "center",
              color: "var(--color-neutral-500)",
              fontSize: "0.875rem",
            }}
          >
            …
          </span>
        ) : (
          <button key={p} style={p === current ? activeBtn : btnBase}>
            {p}
          </button>
        )
      )}

      <button style={btnBase} aria-label="Next page">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polyline
            points="9 18 15 12 9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}
