"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ALPHABET_DATA,
  ALPHABET_ORDER,
  isLetterReady,
  type AlphabetChar,
} from "@/data/alphabet";

const STORAGE_KEY = "alphabet-progress-v1";

type LetterProgress = {
  watch?: boolean;
  free?: boolean;
  connect?: boolean;
  words?: boolean;
  updated?: number;
};

export type AlphabetProgress = Partial<Record<string, LetterProgress>>;

function readProgress(): AlphabetProgress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as AlphabetProgress;
  } catch {
    return {};
  }
}

function writeProgress(data: AlphabetProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function stepCompleted(
  progress: AlphabetProgress,
  char: string,
  step: "watch" | "connect" | "words",
) {
  const entry = progress[char];
  if (!entry) return false;
  if (step === "watch") return Boolean(entry.watch || entry.free);
  return Boolean(entry[step]);
}

export function letterFullyDone(progress: AlphabetProgress, char: string) {
  const data = ALPHABET_DATA[char as AlphabetChar];
  if (!isLetterReady(data)) return false;
  return stepCompleted(progress, char, "watch");
}

export function useAlphabetProgress() {
  const [progress, setProgress] = useState<AlphabetProgress>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(readProgress());
    setReady(true);
  }, []);

  const markDone = useCallback((char: string, step: keyof LetterProgress) => {
    setProgress((prev) => {
      if (prev[char]?.[step]) return prev;
      const next: AlphabetProgress = {
        ...prev,
        [char]: {
          ...prev[char],
          [step]: true,
          updated: Date.now(),
        },
      };
      writeProgress(next);
      return next;
    });
  }, []);

  const doneCount = ALPHABET_ORDER.filter((char) =>
    letterFullyDone(progress, char),
  ).length;
  const readyCount = ALPHABET_ORDER.filter((char) =>
    isLetterReady(ALPHABET_DATA[char]),
  ).length;

  return { progress, ready, markDone, doneCount, readyCount };
}
