"use client";

import { useRef } from "react";
import {
  AlphabetSpelling,
  type AlphabetSpellingHandle,
} from "@/components/alphabet/AlphabetSpelling";
import { LetterVideo } from "@/components/alphabet/LetterVideo";
import { StrokePreview } from "@/components/alphabet/StrokePreview";
import { isLetterReady, type AlphabetLetter } from "@/data/alphabet";
import { getTraceLetter } from "@/data/traceLetters";

type LetterLessonProps = {
  letter: AlphabetLetter;
  onWatched?: () => void;
  onTraced?: () => void;
};

export function LetterLesson({ letter, onWatched, onTraced }: LetterLessonProps) {
  const ready = isLetterReady(letter);
  const trace = getTraceLetter(letter.slug);
  const spellingRef = useRef<AlphabetSpellingHandle>(null);

  if (!ready) {
    return (
      <section className="hub-card azbuka-card">
        <div className="hub-card-inner azbuka-soon">
          <p className="azbuka-soon__char">{letter.char}</p>
          <h2 className="azbuka-card__title">Буква скоро появится</h2>
          <p className="azbuka-card__dek">
            Урок для этой буквы ещё готовим. Выбери другую букву сверху.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="azbuka-lesson">
      <div className="azbuka-split">
        <section className="hub-card azbuka-panel azbuka-panel--video">
          <div className="hub-card-inner">
            <LetterVideo
              src={letter.video}
              title={`Видео буквы ${letter.char}`}
              onWatched={onWatched}
            />
          </div>
        </section>

        <section className="hub-card azbuka-panel azbuka-panel--write">
          <div className="hub-card-inner">
            <h2 className="azbuka-panel__title">Напиши букву</h2>
            <div className="azbuka-write-body">
              {trace ? (
                <div className="azbuka-write-row">
                  <AlphabetSpelling
                    ref={spellingRef}
                    embedded
                    letterId={letter.slug}
                    onComplete={onTraced}
                  />
                  <div className="azbuka-actions">
                    <button
                      type="button"
                      className="hub-btn azbuka-btn azbuka-btn--ghost"
                      onClick={() => spellingRef.current?.reset()}
                    >
                      Начать заново
                    </button>
                  </div>
                </div>
              ) : letter.upper?.length ? (
                <div className="azbuka-write-row">
                  <div className="azbuka-dual">
                    <div>
                      <p className="azbuka-dual__label">{letter.char}</p>
                      <StrokePreview paths={letter.upper} label={letter.char} />
                    </div>
                    {letter.lower?.length ? (
                      <div>
                        <p className="azbuka-dual__label">
                          {letter.char.toLowerCase()}
                        </p>
                        <StrokePreview
                          paths={letter.lower}
                          label={letter.char.toLowerCase()}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
              <figure className="azbuka-art">
                <img src="/tests/forAlphavitTransparent.png" alt="" />
              </figure>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
