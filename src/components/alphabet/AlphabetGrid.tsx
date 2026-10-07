"use client";

import { useEffect, useRef } from "react";
import {
  ALPHABET_DATA,
  ALPHABET_ORDER,
  isLetterReady,
  letterSlug,
  type AlphabetChar,
} from "@/data/alphabet";
import {
  letterFullyDone,
  type AlphabetProgress,
} from "@/components/alphabet/useAlphabetProgress";

type AlphabetGridProps = {
  selectedSlug: string;
  onSelect: (char: AlphabetChar) => void;
  progress: AlphabetProgress;
  progressReady: boolean;
};

export function AlphabetGrid({
  selectedSlug,
  onSelect,
  progress,
  progressReady,
}: AlphabetGridProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = listRef.current;
    const current = root?.querySelector<HTMLElement>(".is-active");
    const scroller = root?.parentElement;
    if (!root || !current || !scroller) return;
    if (scroller.scrollHeight <= scroller.clientHeight + 1) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const cellRect = current.getBoundingClientRect();
    if (cellRect.top < scrollerRect.top || cellRect.bottom > scrollerRect.bottom) {
      scroller.scrollTop +=
        cellRect.top - scrollerRect.top - (scrollerRect.height - cellRect.height) / 2;
    }
  }, [selectedSlug]);

  return (
    <section className="hub-card azbuka-card azbuka-picker">
      <div className="hub-card-inner azbuka-card__inner azbuka-picker__inner">
        <div
          ref={listRef}
          className="azbuka-grid azbuka-grid--picker"
          role="listbox"
          aria-label="Русский алфавит"
        >
          {ALPHABET_ORDER.map((char) => {
            const data = ALPHABET_DATA[char];
            const lessonReady = isLetterReady(data);
            const done = progressReady && letterFullyDone(progress, char);
            const selected = letterSlug(char) === selectedSlug;

            return (
              <button
                key={char}
                type="button"
                role="option"
                aria-selected={selected}
                aria-disabled={!lessonReady}
                className={[
                  "azbuka-cell",
                  lessonReady ? "" : "azbuka-cell--soon",
                  done ? "azbuka-cell--done" : "",
                  selected ? "is-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onSelect(char)}
              >
                <span className="azbuka-cell__char">{char}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
