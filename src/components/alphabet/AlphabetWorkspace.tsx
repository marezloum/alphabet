"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlphabetGrid } from "@/components/alphabet/AlphabetGrid";
import { LetterLesson } from "@/components/alphabet/LetterLesson";
import { useAlphabetProgress } from "@/components/alphabet/useAlphabetProgress";
import {
  ALPHABET_DATA,
  ALPHABET_ORDER,
  getLetterBySlug,
  isLetterReady,
  letterSlug,
  type AlphabetChar,
} from "@/data/alphabet";

type AlphabetWorkspaceProps = {
  initialSlug?: string;
};

function firstReadySlug() {
  const char =
    ALPHABET_ORDER.find((item) => isLetterReady(ALPHABET_DATA[item])) ??
    ALPHABET_ORDER[0];
  return letterSlug(char);
}

export function AlphabetWorkspace({ initialSlug }: AlphabetWorkspaceProps) {
  const router = useRouter();
  const fallback = useMemo(firstReadySlug, []);
  const [slug, setSlug] = useState(() => {
    const fromQuery = initialSlug ? getLetterBySlug(initialSlug) : undefined;
    return fromQuery?.slug ?? fallback;
  });
  const [videoOverrides, setVideoOverrides] = useState<Record<string, string>>({});
  const { progress, ready: progressReady, markDone } = useAlphabetProgress();

  useEffect(() => {
    if (!initialSlug) return;
    const letter = getLetterBySlug(initialSlug);
    if (letter) setSlug(letter.slug);
  }, [initialSlug]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/alphabet/videos")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: Record<string, string>) => {
        if (!cancelled && data && typeof data === "object") {
          setVideoOverrides(data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const letter = useMemo(() => {
    const base = getLetterBySlug(slug);
    if (!base) return undefined;
    const override = videoOverrides[slug];
    return override ? { ...base, video: override } : base;
  }, [slug, videoOverrides]);

  function select(char: AlphabetChar) {
    const next = letterSlug(char);
    setSlug(next);
    router.replace(`/alphabet?letter=${next}`, { scroll: false });
  }

  if (!letter) return null;

  return (
    <div className="azbuka-workspace">
      <figure className="azbuka-art azbuka-art--picker">
        <img src="/tests/forAlphavitTransparent.png" alt="" />
      </figure>
      <div className="azbuka-stage">
        <AlphabetGrid
          selectedSlug={slug}
          onSelect={select}
          progress={progress}
          progressReady={progressReady}
        />
        <LetterLesson
          key={slug}
          letter={letter}
          onWatched={() => markDone(letter.char, "watch")}
          onTraced={() => markDone(letter.char, "free")}
        />
      </div>
    </div>
  );
}
