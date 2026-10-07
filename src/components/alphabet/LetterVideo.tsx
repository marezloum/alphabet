"use client";

import { useState } from "react";

type LetterVideoProps = {
  src?: string;
  title: string;
  onWatched?: () => void;
};

export function LetterVideo({ src, title, onWatched }: LetterVideoProps) {
  const [failed, setFailed] = useState(false);
  const playable = Boolean(src) && !failed;

  return (
    <figure className="azbuka-video">
      <div className="azbuka-video__frame">
        <video
          key={src || "empty"}
          className="azbuka-video__el"
          src={src || undefined}
          controls={playable}
          playsInline
          preload="metadata"
          aria-label={title}
          onEnded={onWatched}
          onError={() => {
            if (src) setFailed(true);
          }}
        >
          Видео не поддерживается
        </video>
        {playable ? null : (
          <div className="azbuka-video__placeholder">
            <span className="azbuka-video__play" aria-hidden>
              ▶
            </span>
            <p className="azbuka-video__ph-title">Видео скоро появится</p>
            <p className="azbuka-video__ph-fa" lang="fa" dir="rtl">
              ویدیوی آموزش به‌زودی
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}
