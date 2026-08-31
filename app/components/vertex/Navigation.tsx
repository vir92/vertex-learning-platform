"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";

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
        <Link
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
        </Link>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link
            href="/courses"
            style={{
              color: activeLink === "courses" ? "var(--color-neutral-900)" : "var(--color-neutral-700)",
              fontWeight: activeLink === "courses" ? 500 : 400,
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
          >
            Courses
          </Link>
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

      {/* Right: Auth controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "38px",
                padding: "0 1.125rem",
                borderRadius: "9px",
                border: "1px solid var(--color-neutral-200)",
                backgroundColor: "transparent",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-neutral-700)",
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
            >
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "38px",
                padding: "0 1.125rem",
                borderRadius: "9px",
                border: "none",
                backgroundColor: "#EA580C",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "#FFFFFF",
                cursor: "pointer",
                boxShadow: "0 2px 8px 0 rgba(234, 88, 12, 0.3)",
                transition: "all 150ms ease",
              }}
            >
              Sign up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: 36,
                  height: 36,
                },
              },
            }}
          />
        </Show>
      </div>
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
