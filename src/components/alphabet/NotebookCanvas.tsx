"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

const STROKE_MIN_DIST = 4;

type Point = { x: number; y: number };
type LineDef = { y: number; dash: boolean };

export type NotebookCanvasHandle = {
  clear: () => void;
  evaluateWords: () => boolean;
};

type NotebookCanvasProps = {
  rows?: number;
  className?: string;
};

export const NotebookCanvas = forwardRef<
  NotebookCanvasHandle,
  NotebookCanvasProps
>(function NotebookCanvas({ rows = 1, className }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Point[][]>([]);
  const currentRef = useRef<Point[] | null>(null);
  const drawingRef = useRef(false);
  const pointerRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  function resize() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeRef.current = { w: rect.width, h: rect.height };
    redraw();
  }

  function drawNotebook(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const rowH = h / rows;
    const lineRatios: LineDef[] = [
      { y: 0.18, dash: false },
      { y: 0.45, dash: true },
      { y: 0.72, dash: false },
    ];

    ctx.fillStyle = "#fbfaf8";
    ctx.fillRect(0, 0, w, h);

    for (let r = 0; r < rows; r++) {
      const y0 = r * rowH;
      if (r > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "color-mix(in srgb, var(--border-card) 80%, #d4c9b8)";
        ctx.strokeStyle = "#ebe6dc";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.moveTo(0, y0);
        ctx.lineTo(w, y0);
        ctx.stroke();
      }
      lineRatios.forEach((ln) => {
        ctx.beginPath();
        ctx.strokeStyle = ln.dash ? "#e4ddd2" : "#d8cfc2";
        ctx.lineWidth = ln.dash ? 1 : 1.5;
        ctx.setLineDash(ln.dash ? [4, 6] : []);
        ctx.moveTo(0, y0 + ln.y * rowH);
        ctx.lineTo(w, y0 + ln.y * rowH);
        ctx.stroke();
      });
    }
    ctx.setLineDash([]);
  }

  function redraw() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h } = sizeRef.current;
    drawNotebook(ctx, w, h);
    ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue("--accent").trim() || "#e8a06a";
    ctx.lineWidth = rows > 1 ? 4 : 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    strokesRef.current.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
  }

  function posFromEvent(e: PointerEvent): Point {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function addPoint(stroke: Point[], raw: Point) {
    const last = stroke[stroke.length - 1];
    if (last) {
      const dx = raw.x - last.x;
      const dy = raw.y - last.y;
      if (dx * dx + dy * dy < STROKE_MIN_DIST * STROKE_MIN_DIST) return;
      raw = {
        x: last.x * 0.3 + raw.x * 0.7,
        y: last.y * 0.3 + raw.y * 0.7,
      };
    }
    stroke.push(raw);
  }

  function endStroke() {
    drawingRef.current = false;
    currentRef.current = null;
    pointerRef.current = null;
  }

  useImperativeHandle(ref, () => ({
    clear() {
      strokesRef.current = [];
      endStroke();
      redraw();
    },
    evaluateWords() {
      const { h } = sizeRef.current;
      const rowH = h / rows;
      let rowsOk = 0;
      for (let r = 0; r < rows; r++) {
        const y0 = r * rowH + 8;
        const y1 = (r + 1) * rowH - 8;
        const rowDone = strokesRef.current.some((stroke) => {
          if (stroke.length < 12) return false;
          let inRow = 0;
          let outRow = 0;
          for (const point of stroke) {
            if (point.y >= y0 && point.y <= y1) inRow += 1;
            else outRow += 1;
          }
          return inRow >= 12 && inRow > outRow;
        });
        if (rowDone) rowsOk += 1;
      }
      return rowsOk >= rows;
    },
  }));

  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;

    function start(e: PointerEvent) {
      if (drawingRef.current) endStroke();
      e.preventDefault();
      try {
        node!.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      pointerRef.current = e.pointerId;
      drawingRef.current = true;
      currentRef.current = [posFromEvent(e)];
      strokesRef.current.push(currentRef.current);
    }

    function move(e: PointerEvent) {
      if (typeof e.buttons === "number" && e.buttons === 0) {
        endStroke();
        return;
      }
      if (!drawingRef.current || !currentRef.current) return;
      if (pointerRef.current != null && e.pointerId !== pointerRef.current) return;
      e.preventDefault();
      addPoint(currentRef.current, posFromEvent(e));
      redraw();
    }

    function end(e: PointerEvent) {
      if (pointerRef.current != null && e.pointerId !== pointerRef.current) return;
      try {
        node!.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      endStroke();
    }

    resize();
    node.addEventListener("pointerdown", start);
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerup", end);
    node.addEventListener("pointercancel", end);
    window.addEventListener("pointerup", end);
    window.addEventListener("resize", resize);

    return () => {
      node.removeEventListener("pointerdown", start);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", end);
      node.removeEventListener("pointercancel", end);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("resize", resize);
    };
  }, [rows]);

  return (
    <canvas
      ref={canvasRef}
      className={["azbuka-canvas", className].filter(Boolean).join(" ")}
    />
  );
});
