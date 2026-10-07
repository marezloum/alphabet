"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { LetterTraceBoard } from "@/components/alphabet/LetterTraceBoard";
import { getTraceLetter, traceLetters } from "@/data/traceLetters";

type AlphabetSpellingProps = {
  embedded?: boolean;
  letterId?: string;
  onComplete?: () => void;
};

export type AlphabetSpellingHandle = {
  reset: () => void;
};

export const AlphabetSpelling = forwardRef<
  AlphabetSpellingHandle,
  AlphabetSpellingProps
>(function AlphabetSpelling({ embedded = false, letterId, onComplete }, ref) {
  const letter =
    (letterId ? getTraceLetter(letterId) : undefined) ?? traceLetters[0];
  const [resetKey, setResetKey] = useState(0);
  const [upperDone, setUpperDone] = useState(false);
  const [lowerDone, setLowerDone] = useState(false);

  const allDone = upperDone && lowerDone;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (allDone) onCompleteRef.current?.();
  }, [allDone]);

  const onUpperDone = useCallback((done: boolean) => setUpperDone(done), []);
  const onLowerDone = useCallback((done: boolean) => setLowerDone(done), []);

  const handleReset = useCallback(() => {
    setUpperDone(false);
    setLowerDone(false);
    setResetKey((k) => k + 1);
  }, []);

  useImperativeHandle(ref, () => ({ reset: handleReset }), [handleReset]);

  const inner = (
    <div
      className={
        embedded
          ? "alphabet-spelling__inner alphabet-spelling__inner--embedded"
          : "hub-card-inner alphabet-spelling__inner"
      }
    >
      {embedded ? null : (
        <>
          <h2 className="alphabet-spelling__title">{letter.title}</h2>
          <p className="alphabet-spelling__intro">{letter.intro}</p>
        </>
      )}

      <div className="alphabet-spelling__boards">
        <LetterTraceBoard
          key={`${letter.id}-upper-${resetKey}`}
          pathD={letter.upper.path}
          viewBox={letter.upper.viewBox}
          strokeWidth={letter.upper.strokeWidth}
          label={letter.upper.label}
          hint={letter.upper.hint}
          hideCaption={embedded}
          resetKey={resetKey}
          onDoneChange={onUpperDone}
        />
        <LetterTraceBoard
          key={`${letter.id}-lower-${resetKey}`}
          pathD={letter.lower.path}
          viewBox={letter.lower.viewBox}
          label={letter.lower.label}
          hint={letter.lower.hint}
          hideCaption={embedded}
          resetKey={resetKey}
          onDoneChange={onLowerDone}
        />
      </div>

      {allDone ? (
        <p className="alphabet-spelling__success" role="status">
          Прекрасно! Буква написана верно.
        </p>
      ) : null}

      {embedded ? null : (
        <button
          type="button"
          className="hub-btn alphabet-spelling__reset"
          onClick={handleReset}
        >
          Начать заново
        </button>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div className="alphabet-spelling alphabet-spelling--embedded">{inner}</div>
    );
  }

  return <section className="hub-card alphabet-spelling">{inner}</section>;
});
