"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/app/components/vertex";

export function HeroSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  // Listen for Cmd+K / Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const inputEl = document.getElementById("vertex-hero-search-input");
        if (inputEl) inputEl.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="vertex-search-bar"
      style={{
        width: "100%",
        maxWidth: "600px",
        height: "54px",
        borderRadius: "14px",
        backgroundColor: "var(--color-white, #FFFFFF)",
        border: "1px solid var(--color-neutral-200)",
        display: "flex",
        alignItems: "center",
        padding: "0 1.125rem",
        boxShadow:
          "0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
      }}
    >
      <Icon name="search" size={20} color="#94A3B8" />
      <input
        id="vertex-hero-search-input"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Ask anything about your learning..."
        style={{
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          fontFamily: "var(--font-body)",
          fontSize: "0.9375rem",
          color: "var(--color-neutral-900)",
          flex: 1,
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
        }}
      />
      <kbd
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
          padding: "3px 7px",
          borderRadius: "6px",
          border: "1px solid var(--color-neutral-200)",
          backgroundColor: "var(--color-neutral-50, #F8FAFC)",
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--color-neutral-500)",
          lineHeight: 1,
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        ⌘ K
      </kbd>
    </div>
  );
}
