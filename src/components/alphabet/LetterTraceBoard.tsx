"use client";

import { useEffect, useId, useRef, useState } from "react";
import { traceStrokes, type TracePath } from "@/data/traceLetters";

const SEARCH_AHEAD = 40;
const SAMPLE_STEP = 2;
const MAX_ACCEPT_RADIUS = 55;
const MAX_ACCEPT_RADIUS_END = 70;
const MAX_ADVANCE = 18;
const STEP_PRECISION = 4;
const HANDLE_MOVE_MS = 650;

type LetterTraceBoardProps = {
  pathD: TracePath;
  viewBox: string;
  label: string;
  hint?: string;
  strokeWidth?: number;
  hideCaption?: boolean;
  /** Change to force a full reset */
  resetKey: number;
  onDoneChange: (done: boolean) => void;
};

type GuideLinesProps = {
  x1: number;
  x2: number;
  slantStart: number;
};

function GuideLines({ x1, x2, slantStart }: GuideLinesProps) {
  const slantOffsets = [0, 100, 200, 300, 400];
  return (
    <>
      <line
        x1={x1}
        y1={7.5}
        x2={x2}
        y2={7.5}
        stroke="#93c5fd"
        strokeWidth={2.5}
      />
      <line
        x1={x1}
        y1={205}
        x2={x2}
        y2={205}
        stroke="#60a5fa"
        strokeWidth={2.5}
        strokeDasharray="6 5"
      />
      <line
        x1={x1}
        y1={403}
        x2={x2}
        y2={403}
        stroke="#93c5fd"
        strokeWidth={2.5}
      />
      <line
        x1={x1}
        y1={601}
        x2={x2}
        y2={601}
        stroke="#93c5fd"
        strokeWidth={2.5}
      />
      {slantOffsets.map((offset) => (
        <line
          key={offset}
          x1={slantStart + offset}
          y1={-40}
          x2={slantStart + offset - 140}
          y2={660}
          stroke="#dbeafe"
          strokeWidth={1.5}
        />
      ))}
    </>
  );
}

export function LetterTraceBoard({
  pathD,
  viewBox,
  label,
  hint,
  strokeWidth,
  hideCaption = false,
  resetKey,
  onDoneChange,
}: LetterTraceBoardProps) {
  const reactId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const templateRefs = useRef<(SVGPathElement | null)[]>([]);
  const progressRefs = useRef<(SVGPathElement | null)[]>([]);
  const handleRef = useRef<SVGCircleElement>(null);
  const [done, setDone] = useState(false);
  const strokes = traceStrokes(pathD);
  const pathKey = strokes.join("|");

  const [minX, , width] = viewBox.split(" ").map(Number);
  const guideX1 = minX;
  const guideX2 = minX + width;
  const slantStart = minX + (minX < 0 ? 130 : 120);

  useEffect(() => {
    const canvas = svgRef.current;
    const handle = handleRef.current;
    const templates = templateRefs.current.slice(0, strokes.length);
    const progresses = progressRefs.current.slice(0, strokes.length);
    if (
      !canvas ||
      !handle ||
      templates.length !== strokes.length ||
      progresses.length !== strokes.length ||
      templates.some((p) => !p) ||
      progresses.some((p) => !p)
    ) {
      return;
    }

    const lengths = templates.map((path) => path!.getTotalLength());
    const state = {
      strokeIndex: 0,
      currentLength: 0,
      isDrawing: false,
      transitioning: false,
      lastX: null as number | null,
      lastY: null as number | null,
      done: false,
    };
    let moveRaf = 0;

    function template() {
      return templates[state.strokeIndex]!;
    }

    function progress() {
      return progresses[state.strokeIndex]!;
    }

    function total() {
      return lengths[state.strokeIndex];
    }

    function clientToSvg(e: PointerEvent) {
      const pt = canvas!.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = canvas!.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const p = pt.matrixTransform(ctm.inverse());
      return { x: p.x, y: p.y };
    }

    function setHandle(x: number, y: number) {
      handle!.setAttribute("cx", String(x));
      handle!.setAttribute("cy", String(y));
    }

    function hideProgress(index: number) {
      const path = progresses[index]!;
      const len = lengths[index];
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
    }

    function cancelHandleMove() {
      if (moveRaf) {
        cancelAnimationFrame(moveRaf);
        moveRaf = 0;
      }
      state.transitioning = false;
    }

    function animateHandle(
      from: { x: number; y: number },
      to: { x: number; y: number },
      onDone: () => void,
    ) {
      cancelHandleMove();
      state.transitioning = true;
      const t0 = performance.now();

      function tick(now: number) {
        const t = Math.min(1, (now - t0) / HANDLE_MOVE_MS);
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        setHandle(
          from.x + (to.x - from.x) * eased,
          from.y + (to.y - from.y) * eased,
        );
        if (t < 1) {
          moveRaf = requestAnimationFrame(tick);
          return;
        }
        moveRaf = 0;
        state.transitioning = false;
        setHandle(to.x, to.y);
        onDone();
      }

      moveRaf = requestAnimationFrame(tick);
    }

    function reset() {
      cancelHandleMove();
      state.strokeIndex = 0;
      state.currentLength = 0;
      state.isDrawing = false;
      state.lastX = null;
      state.lastY = null;
      state.done = false;
      setDone(false);
      onDoneChange(false);
      progresses.forEach((_, index) => hideProgress(index));
      const start = template().getPointAtLength(0);
      setHandle(start.x, start.y);
    }

    function completeStroke() {
      const len = total();
      state.currentLength = len;
      state.isDrawing = false;
      progress().style.strokeDashoffset = "0";
      const end = template().getPointAtLength(len);
      setHandle(end.x, end.y);

      if (state.strokeIndex < strokes.length - 1) {
        const from = end;
        state.strokeIndex += 1;
        state.currentLength = 0;
        const start = template().getPointAtLength(0);
        animateHandle(from, start, () => {
          setHandle(start.x, start.y);
        });
        return;
      }

      state.done = true;
      setDone(true);
      onDoneChange(true);
    }

    function process(x: number, y: number) {
      const totalLength = total();
      if (
        state.done ||
        state.transitioning ||
        state.currentLength >= totalLength * 0.99
      ) {
        return;
      }

      const remaining = totalLength - state.currentLength;
      const nearEnd = remaining < SEARCH_AHEAD * 2;
      const acceptR = nearEnd ? MAX_ACCEPT_RADIUS_END : MAX_ACCEPT_RADIUS;
      const searchStart = state.currentLength;
      const searchEnd = Math.min(totalLength, state.currentLength + SEARCH_AHEAD);
      const active = template();

      let minDistance = Infinity;
      let bestLength = state.currentLength;

      for (let l = searchStart; l <= searchEnd; l += SAMPLE_STEP) {
        const pt = active.getPointAtLength(l);
        const dist = Math.hypot(pt.x - x, pt.y - y);
        if (dist < minDistance) {
          minDistance = dist;
          bestLength = l;
        }
      }

      if (!(minDistance < acceptR && bestLength > state.currentLength)) return;

      let nextLen = Math.min(bestLength, state.currentLength + MAX_ADVANCE);

      if (remaining <= MAX_ADVANCE) {
        const endPt = active.getPointAtLength(totalLength);
        const distToEnd = Math.hypot(endPt.x - x, endPt.y - y);
        if (distToEnd < acceptR) {
          nextLen = totalLength;
        }
      }

      if (nextLen > state.currentLength) {
        state.currentLength = nextLen;
        const bestPoint = active.getPointAtLength(state.currentLength);
        setHandle(bestPoint.x, bestPoint.y);
        progress().style.strokeDashoffset = String(
          totalLength - state.currentLength,
        );

        if (state.currentLength >= totalLength * 0.98) {
          completeStroke();
        }
      }
    }

    function onMove(e: PointerEvent) {
      if (!state.isDrawing || state.done || state.transitioning) return;
      e.preventDefault();
      const p = clientToSvg(e);
      if (state.lastX == null || state.lastY == null) return;

      const moved = Math.hypot(p.x - state.lastX, p.y - state.lastY);

      if (moved > STEP_PRECISION) {
        const steps = Math.ceil(moved / STEP_PRECISION);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          process(
            state.lastX + (p.x - state.lastX) * t,
            state.lastY + (p.y - state.lastY) * t,
          );
        }
      } else {
        process(p.x, p.y);
      }

      state.lastX = p.x;
      state.lastY = p.y;
    }

    function endStroke(e: PointerEvent) {
      if (!state.isDrawing) return;
      state.isDrawing = false;
      state.lastX = null;
      state.lastY = null;
      if (e.pointerId != null) {
        try {
          canvas!.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", endStroke);
      window.removeEventListener("pointercancel", endStroke);
    }

    function onPointerDown(e: PointerEvent) {
      if (state.done || state.transitioning) return;
      e.preventDefault();
      state.isDrawing = true;
      try {
        canvas!.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", endStroke);
      window.addEventListener("pointercancel", endStroke);
      const p = clientToSvg(e);
      state.lastX = p.x;
      state.lastY = p.y;
      process(p.x, p.y);
    }

    reset();
    canvas.addEventListener("pointerdown", onPointerDown);

    return () => {
      cancelHandleMove();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", endStroke);
      window.removeEventListener("pointercancel", endStroke);
    };
  }, [pathKey, resetKey, onDoneChange, strokes.length]);

  return (
    <div className="trace-board-wrap">
      <div className="trace-board">
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className="trace-board__svg"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Обведи букву ${label}`}
        >
          <GuideLines x1={guideX1} x2={guideX2} slantStart={slantStart} />
          {strokes.map((d, index) => (
            <path
              key={`template-${index}`}
              ref={(node) => {
                templateRefs.current[index] = node;
              }}
              className="trace-board__template"
              d={d}
              fill="none"
              style={strokeWidth ? { strokeWidth } : undefined}
            />
          ))}
          {strokes.map((d, index) => (
            <path
              key={`progress-${index}`}
              ref={(node) => {
                progressRefs.current[index] = node;
              }}
              className="trace-board__progress"
              d={d}
              fill="none"
              style={{
                strokeDasharray: 99999,
                strokeDashoffset: 99999,
                ...(strokeWidth ? { strokeWidth } : {}),
              }}
            />
          ))}
          <circle
            ref={handleRef}
            className="trace-board__handle"
            cx={0}
            cy={0}
            r={12}
          />
        </svg>
      </div>
      {hideCaption ? null : (
        <>
          <span
            className={`trace-board__label${done ? " is-done" : ""}`}
            id={`${reactId}-label`}
          >
            {label}
          </span>
          {hint ? <p className="trace-board__hint">{hint}</p> : null}
        </>
      )}
    </div>
  );
}
