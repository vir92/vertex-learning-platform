import React from "react";
import { Icon } from "./Icon";
import { Badge } from "./Badge";

/* =====================================================================
   Vertex Card Components
   Four variants: Course, LessonVideo, LessonLesson, Resource
   ===================================================================== */

const cardBase: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  borderRadius: "12px",
  border: "1px solid var(--color-neutral-200)",
  backgroundColor: "var(--color-white, #fff)",
  overflow: "hidden",
  transition: "box-shadow 200ms ease",
  fontFamily: "var(--font-body)",
};

function DifficultyBars({ level = "Intermediate" }: { level?: string }) {
  const isBeginner = level.toLowerCase() === "beginner";
  const isIntermediate = level.toLowerCase() === "intermediate";
  const isAdvanced = level.toLowerCase() === "advanced";

  const bar1 = true;
  const bar2 = isIntermediate || isAdvanced;
  const bar3 = isAdvanced;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        gap: "1.5px",
        height: "12px",
        marginRight: "2px",
      }}
      aria-hidden="true"
    >
      <span
        style={{
          width: "2px",
          height: "4px",
          borderRadius: "0.5px",
          backgroundColor: bar1 ? "var(--color-neutral-500)" : "var(--color-neutral-300)",
        }}
      />
      <span
        style={{
          width: "2px",
          height: "8px",
          borderRadius: "0.5px",
          backgroundColor: bar2 ? "var(--color-neutral-500)" : "var(--color-neutral-300)",
        }}
      />
      <span
        style={{
          width: "2px",
          height: "12px",
          borderRadius: "0.5px",
          backgroundColor: bar3 ? "var(--color-neutral-500)" : "var(--color-neutral-300)",
        }}
      />
    </span>
  );
}

/* ---------- Course Card ---------- */

interface CourseCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  difficulty?: string;
  duration?: string;
  modules?: number;
  variant?: "horizontal" | "vertical";
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CourseCard({
  icon,
  title,
  description,
  difficulty = "Intermediate",
  duration = "18h 24m",
  modules = 12,
  variant = "vertical",
  href,
  className = "",
  style,
}: CourseCardProps) {
  const content = (
    <>
      {variant === "vertical" ? (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Top Icon */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {icon ?? (
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "14px",
                  backgroundColor: "var(--color-neutral-900)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                }}
              >
                N
              </div>
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              margin: "1.25rem 0 0.5rem",
              fontFamily: "var(--font-display)",
              fontSize: "1.1875rem",
              fontWeight: 600,
              color: "var(--color-neutral-900)",
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "var(--color-neutral-500)",
              lineHeight: 1.55,
              marginBottom: "1.5rem",
              flex: 1,
            }}
          >
            {description}
          </p>

          {/* Footer Metadata */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "1rem",
              paddingTop: "0.875rem",
              borderTop: "1px solid var(--color-neutral-100)",
              fontSize: "0.75rem",
              color: "var(--color-neutral-500)",
              marginTop: "auto",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", whiteSpace: "nowrap" }}>
              <DifficultyBars level={difficulty} />
              <span>{difficulty}</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", whiteSpace: "nowrap" }}>
              <Icon name="clock" size={13} color="var(--color-neutral-500)" />
              <span>{duration}</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", whiteSpace: "nowrap" }}>
              <Icon name="file" size={13} color="var(--color-neutral-500)" />
              <span>{modules} modules</span>
            </span>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            {icon ?? (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  backgroundColor: "var(--color-neutral-900)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                }}
              >
                N
              </div>
            )}
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--color-neutral-900)",
                  lineHeight: 1.4,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "0.8125rem",
                  color: "var(--color-neutral-500)",
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid var(--color-neutral-100)",
              fontSize: "0.75rem",
              color: "var(--color-neutral-500)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              <DifficultyBars level={difficulty} /> {difficulty}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              <Icon name="clock" size={14} /> {duration}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              <Icon name="modules" size={14} /> {modules} modules
            </span>
          </div>
        </>
      )}
    </>
  );

  const containerStyle: React.CSSProperties = {
    ...cardBase,
    padding: variant === "vertical" ? "1.5rem 1.25rem 1.25rem" : "1.25rem",
    gap: variant === "vertical" ? 0 : "0.75rem",
    borderRadius: variant === "vertical" ? "16px" : "12px",
    textDecoration: "none",
    color: "inherit",
    ...style,
  };

  if (href) {
    return (
      <a href={href} className={`vertex-card ${className}`} style={containerStyle}>
        {content}
      </a>
    );
  }

  return (
    <div className={`vertex-card ${className}`} style={containerStyle}>
      {content}
    </div>
  );
}

/* ---------- Lesson Card (Video) ---------- */

interface LessonCardVideoProps {
  title: string;
  description: string;
  lesson?: string;
  duration?: string;
  watchFrom?: string;
  className?: string;
}

export function LessonCardVideo({
  title,
  description,
  lesson = "Lesson 5.1",
  duration = "12:45",
  watchFrom = "Watch from 12:45",
  className = "",
}: LessonCardVideoProps) {
  return (
    <div className={className} style={{ ...cardBase, padding: "1.25rem", gap: "0.625rem" }}>
      <Badge variant="video" />
      <h3
        style={{
          margin: 0,
          fontSize: "0.9375rem",
          fontWeight: 600,
          color: "var(--color-neutral-900)",
          lineHeight: 1.4,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: "0.8125rem",
          color: "var(--color-neutral-500)",
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "0.625rem",
          borderTop: "1px solid var(--color-neutral-100)",
          fontSize: "0.75rem",
          color: "var(--color-neutral-500)",
        }}
      >
        <span>
          {lesson} · {duration}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "var(--color-primary-500)",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <Icon name="play-circle" size={14} color="var(--color-primary-500)" /> {watchFrom}
        </span>
      </div>
    </div>
  );
}

/* ---------- Lesson Card (Lesson) ---------- */

interface LessonCardLessonProps {
  title: string;
  description: string;
  module?: string;
  className?: string;
}

export function LessonCardLesson({
  title,
  description,
  module = "Module 5",
  className = "",
}: LessonCardLessonProps) {
  return (
    <div className={className} style={{ ...cardBase, padding: "1.25rem", gap: "0.625rem" }}>
      <Badge variant="lesson" />
      <h3
        style={{
          margin: 0,
          fontSize: "0.9375rem",
          fontWeight: 600,
          color: "var(--color-neutral-900)",
          lineHeight: 1.4,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: "0.8125rem",
          color: "var(--color-neutral-500)",
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "0.625rem",
          borderTop: "1px solid var(--color-neutral-100)",
          fontSize: "0.75rem",
          color: "var(--color-neutral-500)",
        }}
      >
        <span>{module}</span>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "var(--color-primary-500)",
            fontWeight: 500,
            textDecoration: "none",
            fontSize: "0.75rem",
          }}
        >
          View lesson <Icon name="external-link" size={12} color="var(--color-primary-500)" />
        </a>
      </div>
    </div>
  );
}

/* ---------- Resource Card ---------- */

interface ResourceCardProps {
  title: string;
  description: string;
  fileType?: string;
  fileSize?: string;
  className?: string;
}

export function ResourceCard({
  title,
  description,
  fileType = "PDF",
  fileSize = "1.2 MB",
  className = "",
}: ResourceCardProps) {
  return (
    <div className={className} style={{ ...cardBase, padding: "1.25rem", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            backgroundColor: "var(--color-neutral-100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="file" size={20} color="var(--color-neutral-500)" />
        </div>
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "var(--color-neutral-900)",
              lineHeight: 1.4,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "0.25rem 0 0",
              fontSize: "0.8125rem",
              color: "var(--color-neutral-500)",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "0.625rem",
          borderTop: "1px solid var(--color-neutral-100)",
          fontSize: "0.75rem",
          color: "var(--color-neutral-500)",
        }}
      >
        <span>
          {fileType} · {fileSize}
        </span>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: "var(--color-primary-500)",
          }}
        >
          <Icon name="external-link" size={14} color="var(--color-primary-500)" />
        </a>
      </div>
    </div>
  );
}
