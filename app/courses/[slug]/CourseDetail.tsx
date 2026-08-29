"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { stegaClean } from "@sanity/client/stega";
import { Icon, Navbar } from "@/app/components/vertex";
import { formatDuration, formatStudentCount, titleCase } from "@/app/lib/format";
import type { getCourseBySlug } from "@/sanity/lib/api";
import "./course-detail.css";

export type CourseDetailData = NonNullable<Awaited<ReturnType<typeof getCourseBySlug>>>;

const outcomeIcons: Record<string, ReactNode> = {
  layers: <LayersIcon />,
  workflow: <WorkflowIcon />,
  gauge: <GaugeIcon />,
  rocket: <RocketIcon />,
};

export function CourseDetail({ course }: { course: CourseDetailData }) {
  const [showAll, setShowAll] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const modules = useMemo(() => course.modules?.filter(Boolean) ?? [], [course.modules]);
  const outcomes = course.learningOutcomes?.filter(Boolean) ?? [];
  const visibleModules = showAll ? modules : modules.slice(0, 6);
  const moduleTotal = course.moduleCount ?? modules.length;
  const duration = formatDuration(course.totalDuration);
  const courseInitial = course.title.charAt(0).toUpperCase();

  return (
    <div className="vertex-striped-gutters course-page">
      <div className="vertex-page-frame course-frame">
        <header className="course-header"><Navbar activeLink="courses" /></header>

        <main className="course-main">
          <nav className="course-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/courses">All Courses</Link>
            <Icon name="chevron-right" size={15} color="var(--color-neutral-500)" />
            <span>{course.title}</span>
          </nav>

          <section className="course-hero" aria-labelledby="course-title">
            <div className="course-cover" aria-label={course.coverImageAlt ?? `${course.title} course cover`}>
              {course.coverImageUrl ? (
                <Image src={course.coverImageUrl} alt={course.coverImageAlt ?? ""} fill sizes="(max-width: 800px) calc(100vw - 48px), 360px" />
              ) : (
                <span>{courseInitial}</span>
              )}
            </div>

            <div className="course-summary">
              {course.popular && <span className="course-popular">Popular</span>}
              <h1 id="course-title">{course.title}</h1>
              <p>{course.summary}</p>
              <div className="course-meta" aria-label="Course details">
                <span><Icon name="difficulty" size={19} />{titleCase(stegaClean(course.level))}</span>
                <span><Icon name="clock" size={18} />{duration}</span>
                <span><Icon name="file" size={18} />{moduleTotal} modules</span>
                <span><Icon name="user" size={19} />{formatStudentCount(course.studentCount)} students</span>
              </div>
              <div className="course-actions">
                <a className="course-continue" href="#course-content">Continue Learning <Icon name="arrow-right" size={20} color="#fff" /></a>
                <button className={`course-bookmark ${bookmarked ? "is-bookmarked" : ""}`} onClick={() => setBookmarked(!bookmarked)} aria-pressed={bookmarked}>
                  <Icon name="bookmark" variant={bookmarked ? "filled" : "outline"} size={19} />
                  {bookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
            </div>
          </section>

          {outcomes.length > 0 && (
            <section className="learning-outcomes" aria-labelledby="outcomes-title">
              <h2 id="outcomes-title">What you&apos;ll learn</h2>
              <div className="outcomes-grid">
                {outcomes.map((outcome) => outcome && (
                  <article className="outcome-card" key={outcome._key}>
                    <div className="outcome-icon">{outcomeIcons[outcome.icon ?? ""] ?? <Icon name="check" size={29} color="var(--color-primary-500)" />}</div>
                    <div><h3>{outcome.title}</h3><p>{outcome.description}</p></div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section id="course-content" className="course-content" aria-labelledby="content-title">
            <div className="course-section-heading">
              <h2 id="content-title">Course Content</h2>
              <p>{moduleTotal} modules <span>•</span> {duration}</p>
            </div>
            <div className="module-list">
              {visibleModules.map((module, index) => module && (
                <details className="course-module" key={module._key}>
                  <summary>
                    <span className="module-number">{index + 1}</span>
                    <span className="module-copy"><strong>{module.title}</strong><small>{module.summary}</small></span>
                    <span className="module-duration">{formatDuration((module.lessons ?? []).reduce((sum, lesson) => sum + (lesson?.duration ?? 0), 0))}</span>
                    <Icon name="chevron-right" size={18} color="var(--color-neutral-500)" className="module-chevron" />
                  </summary>
                  {(module.lessons?.length ?? 0) > 0 && (
                    <ol className="lesson-list">
                      {module.lessons?.map((lesson) => lesson && <li key={lesson._id}><Link href={`/lessons/${lesson.slug}`}>{lesson.freePreview && <Icon name="play-circle" size={16} color="var(--color-primary-500)" />}{lesson.title}<span>{formatDuration(lesson.duration)}</span></Link></li>)}
                    </ol>
                  )}
                </details>
              ))}
            </div>
            {modules.length > 6 && <button className="show-modules" onClick={() => setShowAll(!showAll)}> {showAll ? "Show fewer modules" : `Show all ${moduleTotal} modules`} <Icon name="chevron-right" size={17} className={showAll ? "show-less-chevron" : ""} /></button>}
          </section>
        </main>
      </div>
    </div>
  );
}

function LayersIcon() { return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 5 18 10-18 10L6 15 24 5Zm-18 20 18 10 18-10M6 35l18 10 18-10" /></svg>; }
function WorkflowIcon() { return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 11h11v10H9zM28 27h11v10H28zM20 16h8a7 7 0 0 1 7 7v4M20 32h8" /><path d="m25 29 3 3-3 3" /></svg>; }
function GaugeIcon() { return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 34a17 17 0 1 1 34 0" /><path d="m24 30 9-10M13 27l3 1m15-1 3-1M24 14v4" /><circle cx="24" cy="30" r="2.5" /></svg>; }
function RocketIcon() { return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M27 7c7 2 11 8 11 16L25 36c-8 0-14-4-16-11l10-10c2-5 4-7 8-8Z" /><path d="m17 31-5 8 8-5m6-18h.1" /><circle cx="29" cy="17" r="3" /></svg>; }
