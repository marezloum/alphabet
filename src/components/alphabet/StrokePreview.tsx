"use client";

import { useEffect, useRef, useState } from "react";
import { pathData, pathRole, type StrokePath } from "@/data/alphabet";

const ROLE_STROKE: Record<string, string> = {
  letter: "#34287e",
  link: "#5d8c2e",
  next: "#ff5c00",
  default: "var(--accent)",
};

type StrokePreviewProps = {
  paths: StrokePath[];
  label?: string;
};

export function StrokePreview({ paths, label }: StrokePreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    renderGuides(svgRef.current, paths);
  }, [paths]);

  function play() {
    const svg = svgRef.current;
    if (!svg || playing || paths.length === 0) return;
    setPlaying(true);
    svg.replaceChildren();

    let idx = 0;
    function next() {
      if (!svg) return;
      if (idx >= paths.length) {
        setPlaying(false);
        return;
      }
      const item = paths[idx];
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData(item));
      path.setAttribute("fill", "none");
      path.setAttribute("class", "azbuka-stroke__anim");
      path.style.stroke = ROLE_STROKE[pathRole(item)] ?? ROLE_STROKE.default;
      svg.appendChild(path);
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      path.getBoundingClientRect();
      path.style.transition = "stroke-dashoffset 0.75s ease";
      path.style.strokeDashoffset = "0";
      idx += 1;
      window.setTimeout(next, 900);
    }
    next();
  }

  return (
    <div className="azbuka-stroke">
      <div className="azbuka-stroke__sheet">
        <svg
          ref={svgRef}
          className="azbuka-stroke__svg"
          viewBox="0 0 100 100"
          aria-label={label ?? "Пропись буквы"}
        />
      </div>
      <button
        type="button"
        className="hub-btn azbuka-btn"
        onClick={play}
        disabled={playing || paths.length === 0}
      >
        {playing ? "Пишем…" : "Показать, как писать"}
      </button>
    </div>
  );
}

function renderGuides(svg: SVGSVGElement | null, paths: StrokePath[]) {
  if (!svg) return;
  svg.replaceChildren();
  paths.forEach((item) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData(item));
    path.setAttribute("class", "azbuka-stroke__guide");
    path.setAttribute("fill", "none");
    svg.appendChild(path);
  });
}
