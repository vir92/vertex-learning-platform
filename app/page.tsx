"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar,
  Icon,
  CourseCard,
  BottomGraphic,
  NextJsIcon,
  DockerIcon,
  TypeScriptIcon,
} from "@/app/components/vertex";

export default function Home() {
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
      className="vertex-striped-gutters"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* 1440px Framed Canvas Container */}
      <div
        className="vertex-page-frame"
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* ---- 01 Top Navigation Header with Bottom Border ---- */}
        <header
          style={{
            borderBottom: "1px solid var(--color-canvas-line, #EFE9E1)",
            padding: "1.25rem 2.5rem",
          }}
        >
          <Navbar
            showUser={true}
            activeLink="courses"
            avatarSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
          />
        </header>

        {/* ---- 02 Hero Section ---- */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "4.25rem 2.5rem 3.5rem",
          }}
        >
          {/* Eyebrow Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.35rem 0.875rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(249, 115, 22, 0.06)",
              border: "1px solid rgba(249, 115, 22, 0.22)",
              color: "#EA580C",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1,
              marginBottom: "1.75rem",
            }}
          >
            INTELLIGENT LEARNING
          </div>

          {/* Display Heading */}
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5.5vw, 3.625rem)",
              fontWeight: 700,
              lineHeight: 1.14,
              color: "var(--color-neutral-900)",
              letterSpacing: "-0.02em",
              maxWidth: "700px",
            }}
          >
            Search your learning
            <br />
            in plain English.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              margin: "1.25rem 0 2rem",
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: "var(--color-neutral-500)",
              maxWidth: "480px",
            }}
          >
            Vertex understands what you want to learn and
            finds the exact lessons across all your courses.
          </p>

          {/* Explore Courses CTA */}
          <a
            href="#courses"
            className="vertex-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              height: "46px",
              padding: "0 1.5rem",
              borderRadius: "10px",
              backgroundColor: "#EA580C",
              color: "#FFFFFF",
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              fontWeight: 500,
              textDecoration: "none",
              boxShadow: "0 4px 14px 0 rgba(234, 88, 12, 0.35)",
              marginBottom: "3.25rem",
            }}
          >
            <span>Explore Courses</span>
            <Icon name="arrow-right" size={16} color="#FFFFFF" />
          </a>

          {/* Floating Search Bar */}
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
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
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
        </section>

        {/* ---- 03 All Courses Section ---- */}
        <section id="courses" style={{ padding: "0 2.5rem 3.5rem" }}>
          {/* Section Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--color-neutral-900)",
              }}
            >
              All Courses
            </h2>

            <a
              href="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#EA580C",
                textDecoration: "none",
                transition: "gap 150ms ease",
              }}
            >
              <span>View all courses</span>
              <Icon name="arrow-right" size={14} color="#EA580C" />
            </a>
          </div>

          {/* 3 Courses Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {/* Next.js for Production */}
            <CourseCard
              variant="vertical"
              icon={<NextJsIcon size={52} />}
              title="Next.js for Production"
              description="Build scalable, high-performance web applications with Next.js."
              difficulty="Intermediate"
              duration="18h 24m"
              modules={12}
            />

            {/* Docker Essentials */}
            <CourseCard
              variant="vertical"
              icon={<DockerIcon size={52} />}
              title="Docker Essentials"
              description="Containerize applications and streamline your development workflow."
              difficulty="Beginner"
              duration="10h 12m"
              modules={8}
            />

            {/* TypeScript Deep Dive */}
            <CourseCard
              variant="vertical"
              icon={<TypeScriptIcon size={52} />}
              title="TypeScript Deep Dive"
              description="Go beyond the basics and write safer, more expressive code."
              difficulty="Intermediate"
              duration="14h 36m"
              modules={10}
            />
          </div>
        </section>

        {/* ---- 04 Announcement Divider ---- */}
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            padding: "0 2.5rem",
            margin: "1rem 0 2.5rem",
            width: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "var(--color-canvas-line, #EFE9E1)",
              maxWidth: "340px",
            }}
          />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              color: "var(--color-neutral-700)",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 400,
            }}
          >
            <Icon name="star" size={18} color="#F97316" />
            <span>New courses and lessons added every week.</span>
          </div>
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "var(--color-canvas-line, #EFE9E1)",
              maxWidth: "340px",
            }}
          />
        </section>

        {/* ---- 05 Stepped Warm Pillars Ambient Bottom Graphic ---- */}
        <BottomGraphic />
      </div>
    </div>
  );
}
