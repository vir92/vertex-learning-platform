import React from "react";
import {
  Icon,
  Button,
  SearchInput,
  SelectInput,
  FieldInput,
  Badge,
  StatusIndicator,
  ProgressBar,
  CourseCard,
  LessonCardVideo,
  LessonCardLesson,
  ResourceCard,
  Navbar,
  Breadcrumbs,
  Pagination,
} from "@/app/components/vertex";
import type { IconName } from "@/app/components/vertex";

/* =====================================================================
   Vertex Design System — Showcase Page
   Renders every section from the design spec image.
   ===================================================================== */

/* ---- Shared styles ---- */

const page: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "3rem 2rem 5rem",
  fontFamily: "var(--font-body)",
  color: "var(--color-neutral-900)",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "3.5rem",
};

const sectionNumber: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "var(--color-primary-500)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginRight: "0.5rem",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "var(--color-neutral-900)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "1.5rem",
};

const label: React.CSSProperties = {
  fontSize: "0.6875rem",
  color: "var(--color-neutral-500)",
  marginTop: "0.375rem",
  fontFamily: "var(--font-body)",
};

const subHeading: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--color-neutral-700)",
  marginBottom: "0.75rem",
  marginTop: "1.25rem",
};

/* ---- Color swatch helper ---- */

function Swatch({
  color,
  name,
  hex,
}: {
  color: string;
  name: string;
  hex: string;
}) {
  return (
    <div style={{ textAlign: "left" }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "1.4",
          borderRadius: "8px",
          backgroundColor: color,
          border: hex === "#FFFFFF" ? "1px solid var(--color-neutral-200)" : "none",
        }}
      />
      <div style={{ ...label, fontWeight: 500, color: "var(--color-neutral-700)" }}>{name}</div>
      <div style={label}>{hex}</div>
    </div>
  );
}

/* ---- Section header helper ---- */

function SectionHeader({ num, title: t }: { num: string; title: string }) {
  return (
    <div style={sectionTitle}>
      <span style={sectionNumber}>{num}</span>
      {t}
    </div>
  );
}

/* ==========================  PAGE  ========================== */

export default function Home() {
  return (
    <div style={page}>
      {/* ──── Header ──── */}
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "3rem",
          marginBottom: "3.5rem",
          alignItems: "start",
        }}
      >
        {/* Left: Title block */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="var(--color-primary-500)" />
              <path d="M12 2L3 7l9 5 9-5-9-5z" fill="var(--color-primary-400)" />
              <path d="M12 12l-9-5v10l9 5V12z" fill="var(--color-primary-500)" />
              <path d="M12 12l9-5v10l-9 5V12z" fill="var(--color-primary-400)" opacity="0.8" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "1.25rem",
              }}
            >
              Vertex
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.75rem",
              fontWeight: 700,
              lineHeight: 1.1,
              margin: "0 0 1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Design System
          </h1>

          <p
            style={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: "var(--color-neutral-500)",
              margin: "0 0 1.5rem",
            }}
          >
            A unified design language for Vertex learning platform. Clean,
            modern and focused on clarity, consistency and intuitive learning
            experiences.
          </p>

          <p
            style={{
              fontSize: "0.6875rem",
              color: "var(--color-neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Version 1.0 · May 2025
          </p>
        </div>

        {/* Right: 01 Colors */}
        <section>
          <SectionHeader num="01" title="COLORS" />

          <p style={subHeading}>Primary</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "0.75rem",
            }}
          >
            <Swatch color="#F97316" name="Primary 500" hex="#F97316" />
            <Swatch color="#FB923C" name="Primary 400" hex="#FB923C" />
            <Swatch color="#FDBA74" name="Primary 300" hex="#FDBA74" />
            <Swatch color="#FED7AA" name="Primary 200" hex="#FED7AA" />
            <Swatch color="#FFEED5" name="Primary 100" hex="#FFEED5" />
          </div>

          <p style={subHeading}>Neutral</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "0.75rem",
            }}
          >
            <Swatch color="#0F172A" name="Neutral 900" hex="#0F172A" />
            <Swatch color="#334155" name="Neutral 700" hex="#334155" />
            <Swatch color="#64748B" name="Neutral 500" hex="#64748B" />
            <Swatch color="#CBD5E1" name="Neutral 300" hex="#CBD5E1" />
            <Swatch color="#E2E8F0" name="Neutral 200" hex="#E2E8F0" />
            <Swatch color="#F1F5F9" name="Neutral 100" hex="#F1F5F9" />
            <Swatch color="#FAFAFC" name="Neutral 50" hex="#FAFAFC" />
            <Swatch color="#FFFFFF" name="White" hex="#FFFFFF" />
          </div>
        </section>
      </header>

      {/* ──── 02 Typography ──── */}
      <section
        style={{
          ...sectionStyle,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
        }}
      >
        <div>
          <SectionHeader num="02" title="TYPOGRAPHY" />
          <div style={{ marginBottom: "2rem" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "4rem",
                fontWeight: 700,
                color: "var(--color-neutral-900)",
                display: "block",
                lineHeight: 1,
                marginBottom: "0.25rem",
              }}
            >
              Ag
            </span>
            <span style={{ fontSize: "1.125rem", fontWeight: 600, fontFamily: "var(--font-display)" }}>
              Playfair Display
            </span>
            <p style={{ ...label, marginTop: "0.25rem" }}>Elegant · Readable · Timeless</p>
          </div>

          <div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "4rem",
                fontWeight: 700,
                color: "var(--color-neutral-900)",
                display: "block",
                lineHeight: 1,
                marginBottom: "0.25rem",
              }}
            >
              Ag
            </span>
            <span style={{ fontSize: "1.125rem", fontWeight: 600, fontFamily: "var(--font-body)" }}>
              Inter
            </span>
            <p style={{ ...label, marginTop: "0.25rem" }}>Clean · Modern · Highly legible</p>
          </div>
        </div>

        {/* ──── 03 Type Scale ──── */}
        <div>
          <SectionHeader num="03" title="TYPE SCALE" />
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  color: "var(--color-neutral-500)",
                  borderBottom: "1px solid var(--color-neutral-200)",
                }}
              >
                <th style={{ padding: "0.5rem 0.5rem 0.5rem 0", fontWeight: 500 }}>Style</th>
                <th style={{ padding: "0.5rem", fontWeight: 500 }}>Font</th>
                <th style={{ padding: "0.5rem", fontWeight: 500 }}>Size / LH</th>
                <th style={{ padding: "0.5rem", fontWeight: 500 }}>Weight</th>
                <th style={{ padding: "0.5rem", fontWeight: 500 }}>Use</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Display 1", "Playfair Display", "48 / 56", "Bold", "Page titles"],
                ["Display 2", "Playfair Display", "36 / 44", "Bold", "Section titles"],
                ["Heading 1", "Inter", "28 / 36", "Semi Bold", "Card titles"],
                ["Heading 2", "Inter", "22 / 30", "Semi Bold", "Sub section"],
                ["Heading 3", "Inter", "18 / 26", "Medium", "Small titles"],
                ["Body Large", "Inter", "16 / 24", "Regular", "Body copy"],
                ["Body", "Inter", "14 / 20", "Regular", "Supporting text"],
                ["Small", "Inter", "12 / 16", "Regular", "Captions, meta"],
              ].map(([style, font, size, weight, use]) => (
                <tr
                  key={style}
                  style={{
                    borderBottom: "1px solid var(--color-neutral-100)",
                    color: "var(--color-neutral-700)",
                  }}
                >
                  <td style={{ padding: "0.5rem 0.5rem 0.5rem 0", fontWeight: 600 }}>{style}</td>
                  <td style={{ padding: "0.5rem", color: "var(--color-neutral-500)" }}>{font}</td>
                  <td style={{ padding: "0.5rem" }}>{size}</td>
                  <td style={{ padding: "0.5rem" }}>{weight}</td>
                  <td style={{ padding: "0.5rem", color: "var(--color-neutral-500)" }}>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ──── 04 Spacing & 05 Radius/Shadows ──── */}
      <section
        style={{
          ...sectionStyle,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
        }}
      >
        {/* 04 Spacing */}
        <div>
          <SectionHeader num="04" title="SPACING SYSTEM" />
          <p style={{ ...label, marginBottom: "1rem" }}>Base unit: 4px</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { px: 4, rem: "0.25rem" },
              { px: 8, rem: "0.5rem" },
              { px: 12, rem: "0.75rem" },
              { px: 16, rem: "1rem" },
              { px: 24, rem: "1.5rem" },
              { px: 32, rem: "2rem" },
              { px: 40, rem: "2.5rem" },
              { px: 48, rem: "3rem" },
              { px: 64, rem: "4rem" },
            ].map(({ px, rem }) => (
              <div key={px} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: `${px}px`,
                    height: `${px}px`,
                    borderRadius: "4px",
                    backgroundColor: "var(--color-primary-400)",
                    opacity: 0.7 + (px / 200),
                    marginBottom: "0.375rem",
                  }}
                />
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--color-neutral-700)" }}>
                  {px}
                </div>
                <div style={{ fontSize: "0.625rem", color: "var(--color-neutral-500)" }}>
                  ({rem})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 05 Radius & Shadows */}
        <div>
          <SectionHeader num="05" title="RADIUS & SHADOWS" />
          <p style={subHeading}>Radius</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {[
              { val: "4px", label: "xs" },
              { val: "8px", label: "sm" },
              { val: "12px", label: "md" },
              { val: "16px", label: "lg" },
              { val: "24px", label: "xl" },
              { val: "9999px", label: "circle" },
            ].map(({ val, label: l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: val,
                    border: "1.5px solid var(--color-neutral-300)",
                    backgroundColor: "var(--color-neutral-50, #fafafc)",
                  }}
                />
                <div style={{ fontSize: "0.6875rem", fontWeight: 500, color: "var(--color-neutral-700)", marginTop: "0.25rem" }}>
                  {val === "9999px" ? "Full" : val}
                </div>
                <div style={{ fontSize: "0.625rem", color: "var(--color-neutral-500)" }}>
                  ({l})
                </div>
              </div>
            ))}
          </div>

          <p style={subHeading}>Shadows</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
            {[
              { name: "Sm", shadow: "var(--shadow-sm)", desc: "0 1px 2px 0" },
              { name: "Md", shadow: "var(--shadow-md)", desc: "0 4px 12px -2px" },
              { name: "Lg", shadow: "var(--shadow-lg)", desc: "0 12px 24px -4px" },
              { name: "Xl", shadow: "var(--shadow-xl)", desc: "0 20px 40px -8px" },
            ].map(({ name, shadow, desc }) => (
              <div key={name}>
                <div
                  style={{
                    width: "100%",
                    height: "56px",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    boxShadow: shadow,
                    marginBottom: "0.375rem",
                  }}
                />
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-neutral-700)" }}>
                  {name}
                </div>
                <div style={{ fontSize: "0.625rem", color: "var(--color-neutral-500)" }}>
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── 06 Icons, 07 Buttons, 08 Inputs ──── */}
      <section
        style={{
          ...sectionStyle,
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr 1fr",
          gap: "3rem",
        }}
      >
        {/* 06 Icons */}
        <div>
          <SectionHeader num="06" title="ICONS" />
          <p style={subHeading}>Outline Style</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
            {(
              [
                "bell",
                "search",
                "play",
                "file",
                "monitor",
                "bookmark",
                "chart",
                "clock",
                "smile",
                "user",
                "chevron-right",
              ] as IconName[]
            ).map((n) => (
              <Icon key={n} name={n} variant="outline" size={22} color="var(--color-neutral-700)" />
            ))}
          </div>

          <p style={subHeading}>Filled Style</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
            {(
              [
                "bell",
                "search",
                "play",
                "file",
                "monitor",
                "bookmark",
                "chart",
                "clock",
                "smile",
                "user",
                "chevron-right",
              ] as IconName[]
            ).map((n) => (
              <Icon key={n} name={n} variant="filled" size={22} color="var(--color-neutral-700)" />
            ))}
          </div>

          <p style={subHeading}>Icon Specs</p>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.125rem",
              fontSize: "0.75rem",
              color: "var(--color-neutral-500)",
              lineHeight: 1.8,
            }}
          >
            <li>24×24px grid</li>
            <li>2px stroke width (outline)</li>
            <li>Rounded line caps</li>
            <li>Consistent optical balance</li>
          </ul>
        </div>

        {/* 07 Buttons */}
        <div>
          <SectionHeader num="07" title="BUTTONS" />
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", color: "var(--color-neutral-500)" }}>
                <th style={{ padding: "0.5rem 0.5rem 0.75rem 0", fontWeight: 500 }}></th>
                <th style={{ padding: "0.5rem 0.5rem 0.75rem", fontWeight: 500 }}>Primary</th>
                <th style={{ padding: "0.5rem 0.5rem 0.75rem", fontWeight: 500 }}>Secondary</th>
                <th style={{ padding: "0.5rem 0.5rem 0.75rem", fontWeight: 500 }}>Tertiary</th>
                <th style={{ padding: "0.5rem 0.5rem 0.75rem", fontWeight: 500 }}>Text</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "0.5rem 0.5rem 0.5rem 0", fontWeight: 500, color: "var(--color-neutral-700)" }}>
                  Default
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <Button variant="primary">Get Started</Button>
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <Button variant="secondary">Explore Courses</Button>
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <Button variant="tertiary">View Lesson</Button>
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <Button variant="text">Watch Video</Button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem 0.5rem 0.5rem 0", fontWeight: 500, color: "var(--color-neutral-700)" }}>
                  Disabled
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <Button variant="primary" disabled>Get Started</Button>
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <Button variant="secondary" disabled>Explore Courses</Button>
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <Button variant="tertiary" disabled>View Lesson</Button>
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <Button variant="text" disabled>Watch Video</Button>
                </td>
              </tr>
            </tbody>
          </table>

          <p style={subHeading}>Button Specs</p>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.125rem",
              fontSize: "0.75rem",
              color: "var(--color-neutral-500)",
              lineHeight: 1.8,
            }}
          >
            <li>Height: 44px (default)</li>
            <li>Padding: 0 16px (lg), 0 12px (md)</li>
            <li>Radius: 12px</li>
            <li>Font: Inter Medium (14–16px)</li>
          </ul>
        </div>

        {/* 08 Inputs */}
        <div>
          <SectionHeader num="08" title="INPUTS" />

          <p style={subHeading}>Search / Text Input</p>
          <div
            style={{
              borderRadius: "12px",
              border: "1px solid var(--color-neutral-200)",
              padding: "0 0.75rem",
              display: "flex",
              alignItems: "center",
              height: "44px",
              marginBottom: "1rem",
            }}
          >
            <SearchInput />
          </div>

          <p style={subHeading}>Select</p>
          <SelectInput options={["Most Relevant", "Newest", "Popular"]} />

          <div style={{ marginTop: "1rem" }}>
            <p style={subHeading}>Field Specs</p>
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.125rem",
                fontSize: "0.75rem",
                color: "var(--color-neutral-500)",
                lineHeight: 1.8,
              }}
            >
              <li>Height: 44px</li>
              <li>Radius: 12px</li>
              <li>Border: 1px solid #E2E8F0</li>
              <li>Padding: 0 16px</li>
              <li>Focus: Border color #FB923C</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ──── 09 Badges, 10 Status, 11 Progress ──── */}
      <section
        style={{
          ...sectionStyle,
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr 1.5fr",
          gap: "3rem",
        }}
      >
        {/* 09 Badges */}
        <div>
          <SectionHeader num="09" title="BADGES / TAGS" />
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={{ ...label, marginBottom: "0.375rem" }}>Video</p>
              <Badge variant="video" />
            </div>
            <div>
              <p style={{ ...label, marginBottom: "0.375rem" }}>Lesson</p>
              <Badge variant="lesson" />
            </div>
            <div>
              <p style={{ ...label, marginBottom: "0.375rem" }}>Popular</p>
              <Badge variant="popular" />
            </div>
          </div>
        </div>

        {/* 10 Status */}
        <div>
          <SectionHeader num="10" title="STATUS / INDICATORS" />
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <StatusIndicator status="in-progress" />
            <StatusIndicator status="completed" />
            <StatusIndicator status="now-playing" />
            <StatusIndicator status="locked" />
          </div>
        </div>

        {/* 11 Progress */}
        <div>
          <SectionHeader num="11" title="PROGRESS BAR" />
          <ProgressBar value={35} />
        </div>
      </section>

      {/* ──── 12 Cards ──── */}
      <section style={sectionStyle}>
        <SectionHeader num="12" title="CARDS" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.25rem",
          }}
        >
          <div>
            <p style={{ ...label, marginBottom: "0.5rem", fontWeight: 500 }}>Course Card</p>
            <CourseCard
              title="Next.js for Production"
              description="Build scalable, high-performance web applications with Next.js."
              difficulty="Intermediate"
              duration="18h 24m"
              modules={12}
            />
          </div>
          <div>
            <p style={{ ...label, marginBottom: "0.5rem", fontWeight: 500 }}>Lesson Card (Video)</p>
            <LessonCardVideo
              title="Data Fetching in Server Components"
              description="Learn how to fetch data on the server using async/await and Next.js best practices."
              lesson="Lesson 5.1"
              duration="12:45"
              watchFrom="Watch from 12:45"
            />
          </div>
          <div>
            <p style={{ ...label, marginBottom: "0.5rem", fontWeight: 500 }}>Lesson Card (Lesson)</p>
            <LessonCardLesson
              title="Data Fetching & Caching"
              description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
              module="Module 5"
            />
          </div>
          <div>
            <p style={{ ...label, marginBottom: "0.5rem", fontWeight: 500 }}>Resource Card</p>
            <ResourceCard
              title="Caching and Revalidation Guide"
              description="Deep dive into Next.js caching strategies."
              fileType="PDF"
              fileSize="1.2 MB"
            />
          </div>
        </div>
      </section>

      {/* ──── 13 Navigation ──── */}
      <section style={sectionStyle}>
        <SectionHeader num="13" title="NAVIGATION" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr 1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          <div>
            <p style={{ ...label, marginBottom: "0.5rem", fontWeight: 500 }}>Navbar</p>
            <Navbar />
          </div>
          <div>
            <p style={{ ...label, marginBottom: "0.5rem", fontWeight: 500 }}>Breadcrumbs</p>
            <Breadcrumbs
              items={[
                "All Courses",
                "Next.js for Production",
                "Data Fetching & Caching",
              ]}
            />
          </div>
          <div>
            <p style={{ ...label, marginBottom: "0.5rem", fontWeight: 500 }}>Pagination</p>
            <Pagination current={1} total={8} />
          </div>
        </div>
      </section>

      {/* ──── 14 Principles ──── */}
      <section style={{ ...sectionStyle, marginBottom: 0 }}>
        <SectionHeader num="14" title="PRINCIPLES" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
          }}
        >
          {[
            {
              icon: "monitor" as IconName,
              title: "Clarity First",
              desc: "Every element should communicate clearly.",
            },
            {
              icon: "modules" as IconName,
              title: "Consistency",
              desc: "Use components and patterns consistently across the platform.",
            },
            {
              icon: "search" as IconName,
              title: "Focus & Calm",
              desc: "Remove noise and help learners focus on what matters.",
            },
            {
              icon: "user" as IconName,
              title: "Accessible",
              desc: "Design with accessibility and inclusivity in mind.",
            },
          ].map(({ icon: iconName, title: t, desc }) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
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
                <Icon name={iconName} size={20} color="var(--color-neutral-500)" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--color-neutral-900)",
                    marginBottom: "0.125rem",
                  }}
                >
                  {t}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-neutral-500)",
                    lineHeight: 1.5,
                  }}
                >
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──── Divider ──── */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--color-neutral-200)",
          margin: "3rem 0 0",
        }}
      />
    </div>
  );
}
