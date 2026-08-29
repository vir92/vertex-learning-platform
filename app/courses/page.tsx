import Link from "next/link";
import Image from "next/image";
import { stegaClean } from "@sanity/client/stega";
import { getCourses } from "@/sanity/lib/api";
import { Navbar, Icon } from "@/app/components/vertex";

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

function formatStudentCount(count: number | null) {
  if (!count) return "—";
  return count >= 1000
    ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`
    : count.toLocaleString();
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="vertex-striped-gutters">
      <div
        className="vertex-page-frame"
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Navigation */}
        <header
          style={{
            borderBottom: "1px solid var(--color-canvas-line, #EFE9E1)",
            padding: "1.25rem 2.5rem",
          }}
        >
          <Navbar activeLink="courses" />
        </header>

        {/* Page Header */}
        <section style={{ padding: "3rem 2.5rem 2rem" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "var(--color-neutral-900)",
              letterSpacing: "-0.02em",
            }}
          >
            All Courses
          </h1>
          <p
            style={{
              margin: "0.75rem 0 0",
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: "var(--color-neutral-500)",
              maxWidth: "540px",
            }}
          >
            {courses.length} courses to help you build, ship, and scale real
            products.
          </p>
        </section>

        {/* Course Grid */}
        <section style={{ padding: "0 2.5rem 4rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {courses.map((course) => {
              const slug = stegaClean(course.slug);
              const level = titleCase(stegaClean(course.level));
              const initial = course.title?.charAt(0).toUpperCase() ?? "C";

              return (
                <Link
                  key={course._id}
                  href={`/courses/${slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <article
                    className="courses-list-card"
                    style={{
                      borderRadius: "16px",
                      border: "1px solid var(--color-neutral-100)",
                      backgroundColor: "var(--color-white, #fff)",
                      overflow: "hidden",
                      transition: "box-shadow 200ms ease, transform 200ms ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Cover Image */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16 / 9",
                        backgroundColor: "var(--color-neutral-100)",
                        overflow: "hidden",
                      }}
                    >
                      {course.coverImageUrl ? (
                        <Image
                          src={course.coverImageUrl}
                          alt={course.coverImageAlt ?? course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "var(--color-neutral-900)",
                            color: "#fff",
                            fontFamily: "var(--font-display)",
                            fontSize: "3rem",
                            fontWeight: 700,
                          }}
                        >
                          {initial}
                        </div>
                      )}
                      {course.popular && (
                        <span
                          style={{
                            position: "absolute",
                            top: "0.75rem",
                            left: "0.75rem",
                            padding: "0.25rem 0.625rem",
                            borderRadius: "6px",
                            backgroundColor: "#EA580C",
                            color: "#fff",
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            fontFamily: "var(--font-body)",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div
                      style={{
                        padding: "1.25rem 1.5rem 1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      {/* Category */}
                      {course.category?.title && (
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            fontFamily: "var(--font-body)",
                            color: "#EA580C",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {course.category.title}
                        </span>
                      )}

                      {/* Title */}
                      <h2
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-display)",
                          fontSize: "1.1875rem",
                          fontWeight: 600,
                          color: "var(--color-neutral-900)",
                          lineHeight: 1.3,
                        }}
                      >
                        {course.title}
                      </h2>

                      {/* Summary */}
                      <p
                        style={{
                          margin: "0.5rem 0 0",
                          fontSize: "0.875rem",
                          color: "var(--color-neutral-500)",
                          lineHeight: 1.55,
                          flex: 1,
                        }}
                      >
                        {course.summary}
                      </p>

                      {/* Instructor */}
                      {course.instructor && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            margin: "1rem 0 0.875rem",
                          }}
                        >
                          {course.instructor.photoUrl ? (
                            <Image
                              src={course.instructor.photoUrl}
                              alt={course.instructor.name ?? ""}
                              width={28}
                              height={28}
                              style={{ borderRadius: "50%" }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                backgroundColor: "var(--color-neutral-200)",
                              }}
                            />
                          )}
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: 500,
                              color: "var(--color-neutral-700)",
                              fontFamily: "var(--font-body)",
                            }}
                          >
                            {course.instructor.name}
                          </span>
                        </div>
                      )}

                      {/* Metadata Footer */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          paddingTop: "0.875rem",
                          borderTop: "1px solid var(--color-neutral-100)",
                          fontSize: "0.75rem",
                          color: "var(--color-neutral-500)",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Icon
                            name="difficulty"
                            size={13}
                            color="var(--color-neutral-500)"
                          />
                          {level}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Icon
                            name="clock"
                            size={13}
                            color="var(--color-neutral-500)"
                          />
                          {formatDuration(course.totalDuration)}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Icon
                            name="file"
                            size={13}
                            color="var(--color-neutral-500)"
                          />
                          {course.moduleCount ?? 0} modules
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Icon
                            name="user"
                            size={13}
                            color="var(--color-neutral-500)"
                          />
                          {formatStudentCount(course.studentCount)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
