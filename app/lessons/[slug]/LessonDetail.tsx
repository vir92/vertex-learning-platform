"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { stegaClean } from "@sanity/client/stega";
import { Icon, Navbar } from "@/app/components/vertex";
import { formatDuration, titleCase } from "@/app/lib/format";
import { LessonVideoPlayer } from "./LessonVideoPlayer";
import "./lesson-detail.css";

export interface LessonResource {
  _key: string;
  type?: string;
  title: string;
  description?: string | null;
  url: string;
}

export interface LessonSidebarItem {
  _id: string;
  title: string;
  slug: string;
  duration?: number | null;
  freePreview?: boolean | null;
}

export interface LessonSidebarModule {
  _key: string;
  title: string;
  summary?: string | null;
  lessons?: (LessonSidebarItem | null)[] | null;
}

export interface LessonCourse {
  _id: string;
  title: string;
  slug: string;
  level?: string | null;
  studentCount?: number | null;
  coverImageUrl?: string | null;
  modules?: (LessonSidebarModule | null)[] | null;
}

export interface LessonDetailData {
  _id: string;
  title: string;
  slug: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  duration?: number | null;
  freePreview?: boolean | null;
  studentCount?: number | null;
  notes?: any[] | null;
  keyPoints?: string[] | null;
  proTip?: string | null;
  resources?: (LessonResource | null)[] | null;
  course?: LessonCourse | null;
}

interface LessonDetailProps {
  lesson: LessonDetailData;
  /** Deep-link start time in seconds (from intelligent-search segment hits). */
  startAt?: number | null;
}

export function LessonDetail({ lesson, startAt }: LessonDetailProps) {
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");
  const [bookmarked, setBookmarked] = useState(false);

  const course = lesson.course;
  const modules = useMemo(() => course?.modules?.filter(Boolean) as LessonSidebarModule[] ?? [], [course?.modules]);

  // Flatten all lessons across all modules to calculate sequence, numbering, and navigation
  const allLessons = useMemo(() => {
    const list: {
      lesson: LessonSidebarItem;
      moduleIndex: number;
      lessonIndex: number;
      moduleTitle: string;
      moduleKey: string;
    }[] = [];

    modules.forEach((mod: LessonSidebarModule, mIdx: number) => {
      mod.lessons?.forEach((les: LessonSidebarItem | null, lIdx: number) => {
        if (les) {
          list.push({
            lesson: les,
            moduleIndex: mIdx,
            lessonIndex: lIdx,
            moduleTitle: mod.title,
            moduleKey: mod._key,
          });
        }
      });
    });

    return list;
  }, [modules]);

  const currentIdx = allLessons.findIndex(
    (item) => stegaClean(item.lesson.slug) === stegaClean(lesson.slug)
  );

  const currentModuleIdx = currentIdx >= 0 ? allLessons[currentIdx].moduleIndex : 0;
  const currentLessonInModuleIdx = currentIdx >= 0 ? allLessons[currentIdx].lessonIndex : 0;
  const currentModuleKey =
    currentIdx >= 0
      ? allLessons[currentIdx].moduleKey
      : modules[0]?._key ?? "module-0";

  // Accordion open states for modules
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    [currentModuleKey]: true,
  });

  const toggleModule = (moduleKey: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  const prevItem = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextItem = currentIdx >= 0 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  // Calculate completion percentage based on current lesson position
  const progressPercent =
    allLessons.length > 0
      ? Math.max(15, Math.round(((currentIdx + 1) / allLessons.length) * 100))
      : 35;

  const courseTitle = course?.title ?? "Course";
  const courseSlug = course?.slug ?? "";
  const currentModule = modules[currentModuleIdx];

  // Extract overview text from the first paragraph in notes or generate a fallback
  const overviewText = useMemo(() => {
    if (lesson.notes && Array.isArray(lesson.notes)) {
      for (const block of lesson.notes) {
        if (block && typeof block === "object" && "children" in block && Array.isArray(block.children)) {
          const text = block.children.map((c: { text?: string }) => c.text ?? "").join("").trim();
          if (text.length > 20) return text;
        }
      }
    }
    return `In this lesson, you'll explore core concepts and best practices for ${lesson.title}. Master key patterns and techniques to build reliable, high-performance applications.`;
  }, [lesson.notes, lesson.title]);

  const keyPoints = (lesson.keyPoints?.filter(Boolean) as string[]) ?? [
    "Understand key architecture patterns and implementation strategies",
    "Master best practices for performance, scalability, and code structure",
    "Apply real-world workflows directly to your production projects",
  ];

  const resources = (lesson.resources?.filter(Boolean) as LessonResource[]) ?? [];

  return (
    <div className="vertex-striped-gutters lesson-page">
      <div className="vertex-page-frame lesson-frame">
        {/* Top Header Navbar */}
        <header className="lesson-header">
          <Navbar activeLink="courses" />
        </header>

        {/* Body (Sidebar + Main Content) */}
        <div className="lesson-body">
          {/* Left Curriculum Sidebar */}
          <aside className="lesson-sidebar" aria-label="Course Curriculum">
            {/* Back to course link */}
            {courseSlug && (
              <Link href={`/courses/${courseSlug}`} className="lesson-sidebar-back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to course</span>
              </Link>
            )}

            {/* Course mini card */}
            <div className="lesson-sidebar-course">
              <div className="lesson-sidebar-course-thumb">
                {course?.coverImageUrl ? (
                  <Image
                    src={course.coverImageUrl}
                    alt={courseTitle}
                    fill
                    sizes="48px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span>{courseTitle.charAt(0)}</span>
                )}
              </div>
              <div className="lesson-sidebar-course-info">
                <h3 className="lesson-sidebar-course-title">{courseTitle}</h3>
                <p className="lesson-sidebar-course-progress-text">
                  {progressPercent}% complete
                </p>
                <div className="lesson-sidebar-progress-bar">
                  <div
                    className="lesson-sidebar-progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Module Accordion */}
            <div className="lesson-sidebar-modules">
              <div className="lesson-sidebar-modules-header">
                <span>
                  Module {currentModuleIdx + 1} of {modules.length || 1}
                </span>
                <span style={{ display: "inline-flex", transform: "rotate(90deg)" }}>
                  <Icon name="chevron-right" size={16} color="var(--color-neutral-500)" />
                </span>
              </div>

              <ul className="lesson-sidebar-module-list">
                {modules.map((mod: LessonSidebarModule, modIdx: number) => {
                  if (!mod) return null;
                  const isCurrentModule = modIdx === currentModuleIdx;
                  const isCompletedModule = modIdx < currentModuleIdx;
                  const isOpen = !!openModules[mod._key];
                  const moduleLessons = mod.lessons?.filter(Boolean) as LessonSidebarItem[] ?? [];
                  const moduleDurationSec = moduleLessons.reduce(
                    (sum: number, l: LessonSidebarItem) => sum + (l?.duration ?? 0),
                    0
                  );

                  return (
                    <li
                      key={mod._key}
                      className={`lesson-sidebar-module-item ${
                        isCurrentModule ? "is-active" : ""
                      } ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="lesson-sidebar-module-summary"
                        onClick={() => toggleModule(mod._key)}
                        aria-expanded={isOpen}
                      >
                        <span className="lesson-sidebar-module-badge">
                          {modIdx + 1}
                        </span>

                        <div className="lesson-sidebar-module-meta">
                          <div className="lesson-sidebar-module-title">
                            {mod.title}
                          </div>
                          <div className="lesson-sidebar-module-duration">
                            {formatDuration(moduleDurationSec)}
                          </div>
                        </div>

                        <div
                          className={`lesson-sidebar-module-status ${
                            isCompletedModule ? "is-completed" : ""
                          }`}
                        >
                          {isCompletedModule ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <circle cx="12" cy="12" r="10" stroke="#EA580C" strokeWidth="1.5" />
                              <polyline points="8 12 11 15 16 9" stroke="#EA580C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                                transition: "transform 180ms ease",
                              }}
                            >
                              <Icon
                                name="chevron-right"
                                size={15}
                              />
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Sub-lesson items */}
                      {isOpen && moduleLessons.length > 0 && (
                        <ul className="lesson-sidebar-sublessons">
                          {moduleLessons.map((subLesson: LessonSidebarItem) => {
                            if (!subLesson) return null;
                            const isCurrent =
                              stegaClean(subLesson.slug) === stegaClean(lesson.slug);

                            return (
                              <li key={subLesson._id}>
                                <Link
                                  href={`/lessons/${subLesson.slug}`}
                                  className={`lesson-sidebar-sublesson-link ${
                                    isCurrent ? "is-current" : ""
                                  }`}
                                >
                                  <span className="lesson-sidebar-sublesson-dot" />
                                  <div className="lesson-sidebar-sublesson-info">
                                    <div className="lesson-sidebar-sublesson-title">
                                      {subLesson.title}
                                    </div>
                                    {isCurrent && (
                                      <span className="lesson-sidebar-now-playing">
                                        Now playing
                                      </span>
                                    )}
                                  </div>

                                  {isCurrent ? (
                                    <div className="lesson-sidebar-play-icon">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="6 4 20 12 6 20 6 4" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <span className="lesson-sidebar-sublesson-duration">
                                      {formatDuration(subLesson.duration)}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lesson-main-wrapper">
            <main className="lesson-main">
              {/* Breadcrumbs */}
              <nav className="lesson-breadcrumbs" aria-label="Breadcrumb">
                <Link href="/courses">All Courses</Link>
                <Icon name="chevron-right" size={14} color="var(--color-neutral-300)" />
                {courseSlug ? (
                  <Link href={`/courses/${courseSlug}`}>{courseTitle}</Link>
                ) : (
                  <span>{courseTitle}</span>
                )}
                {currentModule && (
                  <>
                    <Icon name="chevron-right" size={14} color="var(--color-neutral-300)" />
                    <span>{currentModule.title}</span>
                  </>
                )}
                <Icon name="chevron-right" size={14} color="var(--color-neutral-300)" />
                <span className="is-current">{lesson.title}</span>
              </nav>

              {/* Top Row: Lesson Badge, Title, Bookmark */}
              <div className="lesson-header-row">
                <div className="lesson-header-left">
                  <span className="lesson-badge">
                    LESSON {currentModuleIdx + 1}.{currentLessonInModuleIdx + 1}
                  </span>
                  <h1 className="lesson-title">{lesson.title}</h1>
                  <p className="lesson-subtitle">{overviewText}</p>
                </div>

                <button
                  type="button"
                  className={`lesson-bookmark-btn ${bookmarked ? "is-bookmarked" : ""}`}
                  onClick={() => setBookmarked(!bookmarked)}
                  aria-label={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
                  title={bookmarked ? "Bookmarked" : "Bookmark"}
                >
                  <Icon
                    name="bookmark"
                    variant={bookmarked ? "filled" : "outline"}
                    size={20}
                  />
                </button>
              </div>

              {/* Metadata Info Row */}
              <div className="lesson-meta-row" aria-label="Lesson information">
                <span className="lesson-meta-item">
                  <Icon name="clock" size={18} color="var(--color-neutral-500)" />
                  {formatDuration(lesson.duration)}
                </span>
                {course?.level && (
                  <span className="lesson-meta-item">
                    <Icon name="difficulty" size={18} color="var(--color-neutral-500)" />
                    {titleCase(stegaClean(course.level))}
                  </span>
                )}
                <span className="lesson-meta-item">
                  <Icon name="user" size={18} color="var(--color-neutral-500)" />
                  {(lesson.studentCount ?? course?.studentCount ?? 3426).toLocaleString()} students
                </span>
              </div>

              {/* Video Player */}
              <LessonVideoPlayer
                videoUrl={lesson.videoUrl}
                title={lesson.title}
                thumbnailUrl={lesson.thumbnailUrl}
                duration={lesson.duration}
                startAt={startAt}
              />

              {/* Tabs: Lesson Content | Notes */}
              <div className="lesson-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "content"}
                  className={`lesson-tab-btn ${activeTab === "content" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("content")}
                >
                  Lesson Content
                  {activeTab === "content" && <span className="lesson-tab-indicator" />}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "notes"}
                  className={`lesson-tab-btn ${activeTab === "notes" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("notes")}
                >
                  Notes
                  {activeTab === "notes" && <span className="lesson-tab-indicator" />}
                </button>
              </div>

              {/* Tab 1: Lesson Content */}
              {activeTab === "content" && (
                <div className="lesson-tab-content">
                  {/* Overview Section */}
                  <section aria-labelledby="overview-heading">
                    <h2 id="overview-heading" className="lesson-section-title">
                      Overview
                    </h2>
                    <p className="lesson-overview-text">{overviewText}</p>
                  </section>

                  {/* Key Points / In this lesson you will */}
                  <section aria-labelledby="learning-goals-heading">
                    <h2 id="learning-goals-heading" className="lesson-section-title">
                      In this lesson you will:
                    </h2>
                    <ul className="lesson-keypoints-list">
                      {keyPoints.map((point: string, i: number) => (
                        <li key={i} className="lesson-keypoint-item">
                          <div className="lesson-keypoint-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Pro Tip Card */}
                  {lesson.proTip && (
                    <div className="lesson-protip-card" role="note">
                      <div className="lesson-protip-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18h6" />
                          <path d="M10 22h4" />
                          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                        </svg>
                      </div>
                      <div className="lesson-protip-body">
                        <h4 className="lesson-protip-title">Pro Tip</h4>
                        <p className="lesson-protip-text">{lesson.proTip}</p>
                      </div>
                    </div>
                  )}

                  {/* Resources Section */}
                  {resources.length > 0 && (
                    <section aria-labelledby="resources-heading">
                      <h2 id="resources-heading" className="lesson-section-title">
                        Resources
                      </h2>
                      <div className="lesson-resources-grid">
                        {resources.map((resource: LessonResource) => (
                          <a
                            key={resource._key}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lesson-resource-card"
                          >
                            <div>
                              <div className="lesson-resource-header">
                                <span className="lesson-resource-icon">
                                  {resource.url.includes("github.com") ? (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                  ) : (
                                    <Icon name="file" size={22} color="#EA580C" />
                                  )}
                                </span>
                                <span className="lesson-resource-ext">
                                  <Icon name="external-link" size={16} />
                                </span>
                              </div>
                              <h4 className="lesson-resource-title">{resource.title}</h4>
                            </div>
                            {resource.description && (
                              <p className="lesson-resource-desc">
                                {resource.description}
                              </p>
                            )}
                          </a>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {/* Tab 2: Notes */}
              {activeTab === "notes" && (
                <div className="lesson-tab-content">
                  <section className="lesson-notes-content" aria-labelledby="notes-heading">
                    <h2 id="notes-heading" className="lesson-section-title">
                      Lesson Notes
                    </h2>
                    {lesson.notes && lesson.notes.length > 0 ? (
                      <div>
                        {lesson.notes.map((block: any, idx: number) => {
                          if (!block || typeof block !== "object") return null;

                          if (block._type === "image" && "url" in block && block.url) {
                            return (
                              <figure key={block._key ?? idx} style={{ margin: "24px 0" }}>
                                <div style={{ position: "relative", width: "100%", height: "360px", borderRadius: "10px", overflow: "hidden" }}>
                                  <Image
                                    src={block.url as string}
                                    alt={(block.alt as string) || "Lesson note illustration"}
                                    fill
                                    style={{ objectFit: "cover" }}
                                  />
                                </div>
                                {Boolean(block.caption) && (
                                  <figcaption style={{ fontSize: "13px", color: "var(--color-neutral-500)", marginTop: "6px", textAlign: "center" }}>
                                    {block.caption as string}
                                  </figcaption>
                                )}
                              </figure>
                            );
                          }

                          if ("children" in block && Array.isArray(block.children)) {
                            const text = block.children
                              .map((c: { text?: string }) => c.text ?? "")
                              .join("");

                            if ("style" in block) {
                              if (block.style === "h2") return <h2 key={block._key ?? idx}>{text}</h2>;
                              if (block.style === "h3") return <h3 key={block._key ?? idx}>{text}</h3>;
                              if (block.style === "blockquote") {
                                return (
                                  <blockquote key={block._key ?? idx} style={{ borderLeft: "3px solid #EA580C", paddingLeft: "16px", margin: "16px 0", fontStyle: "italic", color: "var(--color-neutral-700)" }}>
                                    {text}
                                  </blockquote>
                                );
                              }
                            }

                            if ("listItem" in block && block.listItem === "bullet") {
                              return (
                                <ul key={block._key ?? idx}>
                                  <li>{text}</li>
                                </ul>
                              );
                            }

                            return <p key={block._key ?? idx}>{text}</p>;
                          }

                          return null;
                        })}
                      </div>
                    ) : (
                      <p className="lesson-notes-empty">
                        No additional notes have been added for this lesson yet.
                      </p>
                    )}
                  </section>
                </div>
              )}
            </main>

            {/* Bottom Navigation Footer Bar */}
            <footer className="lesson-footer-nav" aria-label="Lesson navigation">
              <div className="lesson-nav-prev-group">
                {prevItem ? (
                  <>
                    <Link
                      href={`/lessons/${prevItem.lesson.slug}`}
                      className="lesson-nav-prev-btn"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                      <span>Previous Lesson</span>
                    </Link>
                    <div className="lesson-nav-prev-info">
                      <span className="lesson-nav-info-title">{prevItem.lesson.title}</span>
                      <span className="lesson-nav-info-duration">
                        {formatDuration(prevItem.lesson.duration)}
                      </span>
                    </div>
                  </>
                ) : (
                  <button type="button" className="lesson-nav-prev-btn is-disabled" disabled>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    <span>Previous Lesson</span>
                  </button>
                )}
              </div>

              <div className="lesson-nav-next-group">
                {nextItem ? (
                  <>
                    <div className="lesson-nav-next-info">
                      <span className="lesson-nav-info-title">{nextItem.lesson.title}</span>
                      <span className="lesson-nav-info-duration">
                        {formatDuration(nextItem.lesson.duration)}
                      </span>
                    </div>
                    <Link
                      href={`/lessons/${nextItem.lesson.slug}`}
                      className="lesson-nav-next-btn"
                    >
                      <span>Next Lesson</span>
                      <Icon name="arrow-right" size={18} color="#FFFFFF" />
                    </Link>
                  </>
                ) : (
                  <button type="button" className="lesson-nav-next-btn is-disabled" disabled>
                    <span>Next Lesson</span>
                    <Icon name="arrow-right" size={18} color="#FFFFFF" />
                  </button>
                )}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
