"use client";

import React, { useState } from "react";
import Image from "next/image";

interface LessonVideoPlayerProps {
  videoUrl?: string | null;
  title: string;
  thumbnailUrl?: string | null;
  duration?: number | null;
  /** Deep-link start time in seconds (from /search segment results, ?t=). */
  startAt?: number | null;
}

function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export function LessonVideoPlayer({
  videoUrl,
  title,
  thumbnailUrl,
  startAt,
}: LessonVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(Boolean(startAt && startAt > 0));

  const youtubeId = extractYouTubeId(videoUrl);
  const posterUrl =
    thumbnailUrl ||
    (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null);
  const startParam =
    startAt && startAt > 0 ? `&start=${Math.floor(startAt)}` : "";

  if (youtubeId) {
    return (
      <div className="lesson-player-container">
        {!isPlaying ? (
          <div className="lesson-player-poster" onClick={() => setIsPlaying(true)}>
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 880px"
                className="lesson-player-poster-img"
              />
            ) : (
              <div className="lesson-player-fallback">
                <span className="lesson-player-fallback-initial">
                  {title.charAt(0)}
                </span>
              </div>
            )}
            <div className="lesson-player-overlay">
              <button
                type="button"
                className="lesson-player-play-btn"
                aria-label={`Play ${title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(true);
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="white"
                  aria-hidden="true"
                >
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <iframe
            className="lesson-player-iframe"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1${startParam}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    );
  }

  if (videoUrl) {
    return (
      <div className="lesson-player-container">
        <video
          className="lesson-player-video"
          src={videoUrl}
          controls
          poster={posterUrl ?? undefined}
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="lesson-player-container">
      <div className="lesson-player-fallback">
        <div className="lesson-player-fallback-content">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--color-primary-500)" }}
          >
            <polygon points="5 3 19 12 6 21 6 3" />
          </svg>
          <p>No video stream available for this lesson.</p>
        </div>
      </div>
    </div>
  );
}
