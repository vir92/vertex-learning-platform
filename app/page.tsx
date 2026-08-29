import Link from "next/link";
import Image from "next/image";
import { stegaClean } from "@sanity/client/stega";
import { getCourses } from "@/sanity/lib/api";
import {
  Navbar,
  Icon,
  CourseCard,
  BottomGraphic,
} from "@/app/components/vertex";
import { HeroSearchBar } from "@/app/components/HeroSearchBar";

function formatDuration(seconds: number | null) {
  if (!seconds) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (!hours) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function Home() {
  const courses = await getCourses();

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
            activeLink="courses"
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
          <HeroSearchBar />
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

            <Link
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
            </Link>
          </div>

          {/* Courses Grid — dynamically rendered from Sanity */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {courses.slice(0, 3).map((course) => {
              const initial = course.title?.charAt(0).toUpperCase() ?? "C";
              return (
                <CourseCard
                  key={course._id}
                  variant="vertical"
                  href={`/courses/${stegaClean(course.slug)}`}
                  icon={
                    course.coverImageUrl ? (
                      <div
                        style={{
                          position: "relative",
                          width: 52,
                          height: 52,
                          borderRadius: "14px",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={course.coverImageUrl}
                          alt={course.coverImageAlt ?? course.title}
                          fill
                          sizes="52px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
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
                        {initial}
                      </div>
                    )
                  }
                  title={course.title}
                  description={course.summary ?? ""}
                  difficulty={titleCase(stegaClean(course.level))}
                  duration={formatDuration(course.totalDuration)}
                  modules={course.moduleCount ?? 0}
                />
              );
            })}
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
