import React from "react";
import { Icon } from "./Icon";

/* =====================================================================
   Vertex Input Components
   Height: 44px · Radius: 12px · Border: 1px solid #E2E8F0
   Focus: border-color #FB923C
   Variants: search, select, field
   ===================================================================== */

const fieldBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  height: "44px",
  borderRadius: "12px",
  border: "1px solid var(--color-neutral-200)",
  padding: "0 1rem",
  fontFamily: "var(--font-body)",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  color: "var(--color-neutral-900)",
  backgroundColor: "var(--color-white, #fff)",
  outline: "none",
  transition: "border-color 150ms ease",
  width: "100%",
};

/* ---------- SearchInput ---------- */

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Search anything...",
  className = "",
}: SearchInputProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "320px",
      }}
    >
      <Icon
        name="search"
        size={18}
        color="var(--color-neutral-500)"
        className=""
      />
      <input
        type="text"
        placeholder={placeholder}
        style={{
          ...fieldBase,
          border: "none",
          paddingLeft: "0.5rem",
          flex: 1,
        }}
      />
      <kbd
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
          padding: "2px 6px",
          borderRadius: "6px",
          border: "1px solid var(--color-neutral-200)",
          backgroundColor: "var(--color-neutral-100)",
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          color: "var(--color-neutral-500)",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        ⌘K
      </kbd>
    </div>
  );
}

/* ---------- SelectInput ---------- */

interface SelectInputProps {
  options?: string[];
  defaultValue?: string;
  className?: string;
}

export function SelectInput({
  options = ["Most Relevant"],
  defaultValue,
  className = "",
}: SelectInputProps) {
  return (
    <div className={className} style={{ position: "relative", maxWidth: "320px", width: "100%" }}>
      <select
        defaultValue={defaultValue ?? options[0]}
        style={{
          ...fieldBase,
          appearance: "none",
          paddingRight: "2.5rem",
          cursor: "pointer",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-right"
        size={16}
        color="var(--color-neutral-500)"
        className=""
      />
    </div>
  );
}

/* ---------- FieldInput ---------- */

interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export function FieldInput({
  label,
  className = "",
  style,
  ...rest
}: FieldInputProps) {
  return (
    <div className={className} style={{ maxWidth: "320px", width: "100%" }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "0.375rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-neutral-700)",
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          ...fieldBase,
          ...style,
        }}
        {...rest}
      />
    </div>
  );
}

export default SearchInput;
