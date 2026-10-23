import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getMondayOffset(date) {
  const d = new Date(date);
  return (d.getDay() + 6) % 7; // Mon=0 … Sun=6
}

function buildGrid(submissionMap, calendarYears = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rawStart = new Date(today);
  rawStart.setDate(today.getDate() - 363);
  let start = rawStart;
  let end = today;
  let gridStart;
  if (calendarYears) {
    const coverageStart = new Date(calendarYears[0], 0, 1);
    const coverageEnd = new Date(calendarYears[calendarYears.length - 1], 11, 31);
    if (coverageEnd < end) end = coverageEnd;
    if (coverageStart > start) start = coverageStart;
    if (start > end) return [];
    gridStart = new Date(start);
    gridStart.setDate(start.getDate() - getMondayOffset(start));
  } else {
    const startOffset = getMondayOffset(rawStart);
    gridStart = new Date(rawStart);
    gridStart.setDate(rawStart.getDate() - startOffset);
  }

  const days = [];
  for (let i = 0; i < 371; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    if (d > end) break;
    if (d < start) {
      days.push({ date: d, count: 0, covered: false });
      continue;
    }
    const ts = Math.floor(d.getTime() / 1000);
    const utcMidnight = Math.floor(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000
    );
    const count = submissionMap[ts] ?? submissionMap[utcMidnight] ?? 0;
    days.push({ date: d, count, covered: true });
  }
  return days;
}

function generateFallbackData(solvedCount) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const map = {};

  let seed = 42;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 4294967296;
  };

  const totalDays = 365;
  const activeDays = Math.min(Math.floor(solvedCount * 1.6), totalDays);
  const chosenDays = new Set();
  while (chosenDays.size < activeDays) {
    chosenDays.add(Math.floor(rng() * totalDays));
  }

  let placed = 0;
  [...chosenDays].forEach((offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    d.setHours(0, 0, 0, 0);
    const utcTs = Math.floor(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000
    );
    const count = Math.floor(rng() * 4) + 1;
    if (placed < solvedCount * 1.5) {
      map[utcTs] = count;
      placed += count;
    }
  });

  return map;
}

function getMonthLabels(days) {
  const labels = [];
  let lastMonth = -1;
  days.forEach((day, i) => {
    const col = Math.floor(i / 7);
    const month = day.date.getMonth();
    if (month !== lastMonth) {
      labels.push({
        col,
        label: day.date.toLocaleDateString("en-US", { month: "short" }),
      });
      lastMonth = month;
    }
  });
  return labels;
}

// ─── Color levels (ember palette) ───────────────────────────────────────────
const LEVELS = [
  "rgba(255,255,255,0.05)",
  "rgba(160,42,34,0.32)",
  "rgba(160,42,34,0.55)",
  "rgba(184,52,43,0.75)",
  "#b8342b",
  "#d94030",
];

function levelColor(count) {
  if (count === 0) return LEVELS[0];
  if (count === 1) return LEVELS[1];
  if (count === 2) return LEVELS[2];
  if (count === 3) return LEVELS[3];
  if (count === 4) return LEVELS[4];
  return LEVELS[5];
}

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const CELL = 13;
const GAP = 3;

// ─── Component ───────────────────────────────────────────────────────────────
export default function LeetCodeHeatmap({
  solvedCount = 130,
  calendar = null,
  calendarYears = null,
  calendarFetchedAt = null,
}) {
  const [days, setDays] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);
  const [streak, setStreak] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [maxDay, setMaxDay] = useState(0);
  const [tooltip, setTooltip] = useState(null);
  const [isRealCalendar, setIsRealCalendar] = useState(false);
  const wrapRef = useRef(null);
  const cellsRef = useRef([]);

  useEffect(() => {
    const hasRealCalendar = calendar && typeof calendar === "object" && Object.keys(calendar).length > 0;
    const map = hasRealCalendar ? calendar : generateFallbackData(solvedCount);
    const grid = buildGrid(map, hasRealCalendar ? calendarYears : null);

    let s = 0;
    for (let i = grid.length - 1; i >= 0; i--) {
      if (grid[i].count > 0) s++;
      else break;
    }
    const active = grid.filter((d) => d.count > 0).length;
    const mx = Math.max(...grid.map((d) => d.count));

    setDays(grid);
    setMonthLabels(getMonthLabels(grid));
    setStreak(s);
    setTotalActive(active);
    setMaxDay(mx);
    setIsRealCalendar(Boolean(hasRealCalendar));
  }, [solvedCount, calendar, calendarYears, calendarFetchedAt]);

  // GSAP entrance animation
  useEffect(() => {
    if (!days.length || !wrapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cellsRef.current.filter(Boolean),
        { opacity: 0, scale: 0.3 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: { amount: 1.4, from: "start" },
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [days]);

  const numCols = days.length > 0 ? Math.ceil(days.length / 7) : 53;
  const gridW = numCols * (CELL + GAP) - GAP;

  if (!days.length) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-ash text-sm animate-pulse font-mono">
          Loading heatmap…
        </span>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="w-full mt-6">
      {/* Mini stats row */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-4 text-xs font-mono text-ash">
        <span>
          <span className="text-white font-semibold">{streak}</span> day streak
        </span>
        <span>
          <span className="text-white font-semibold">{totalActive}</span> active days
        </span>
        <span>
          <span className="text-white font-semibold">{maxDay}</span> best day
        </span>
        <span className="ml-auto text-[10px] text-ash/70">
          {isRealCalendar && calendarFetchedAt
            ? `Last synced ${new Date(calendarFetchedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
            : "Activity preview"}
        </span>
      </div>

      {/* Scrollable heatmap */}
      <div
        className="overflow-x-auto pb-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div style={{ minWidth: gridW + 36, position: "relative" }}>
          {/* Day-of-week labels */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 18,
              display: "flex",
              flexDirection: "column",
              gap: GAP,
              width: 28,
            }}
          >
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                style={{
                  height: CELL,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 9,
                  color: "var(--ash)",
                  fontFamily: "monospace",
                  opacity: label ? 1 : 0,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Month labels + columns */}
          <div style={{ marginLeft: 32 }}>
            <div style={{ position: "relative", height: 16, marginBottom: 2 }}>
              {monthLabels.map(({ col, label }) => (
                <span
                  key={label + col}
                  style={{
                    position: "absolute",
                    left: col * (CELL + GAP),
                    fontSize: 9,
                    color: "var(--ash)",
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                    lineHeight: "16px",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: GAP }}>
              {Array.from({ length: numCols }, (_, col) => (
                <div
                  key={col}
                  style={{ display: "flex", flexDirection: "column", gap: GAP }}
                >
                  {Array.from({ length: 7 }, (_, row) => {
                    const idx = col * 7 + row;
                    const day = days[idx];
                    if (!day || day.covered === false) {
                      return (
                        <div key={row} style={{ width: CELL, height: CELL }} />
                      );
                    }
                    const color = levelColor(day.count);
                    const dateStr = day.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    return (
                      <div
                        key={row}
                        ref={(el) => {
                          cellsRef.current[idx] = el;
                        }}
                        style={{
                          width: CELL,
                          height: CELL,
                          borderRadius: 3,
                          backgroundColor: color,
                          cursor: day.count > 0 ? "pointer" : "default",
                          transition: "transform 0.12s ease, box-shadow 0.12s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (day.count > 0) {
                            e.currentTarget.style.transform = "scale(1.4)";
                            e.currentTarget.style.boxShadow = `0 0 10px ${color}`;
                            e.currentTarget.style.zIndex = "10";
                          }
                          setTooltip({
                            x: e.clientX,
                            y: e.clientY,
                            label:
                              day.count === 0
                                ? `No submissions — ${dateStr}`
                                : `${day.count} submission${day.count > 1 ? "s" : ""} — ${dateStr}`,
                          });
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.zIndex = "auto";
                          setTooltip(null);
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[10px] text-ash font-mono mr-1">Less</span>
        {LEVELS.map((color, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: color,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          />
        ))}
        <span className="text-[10px] text-ash font-mono ml-1">More</span>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 12,
            top: tooltip.y - 36,
            zIndex: 9999,
            pointerEvents: "none",
            background: "rgba(14,14,16,0.96)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 11,
            color: "#e8e8ea",
            fontFamily: "monospace",
            whiteSpace: "nowrap",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}
        >
          {tooltip.label}
        </div>
      )}
    </div>
  );
}
