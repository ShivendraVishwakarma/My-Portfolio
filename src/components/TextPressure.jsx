import { useCallback, useEffect, useRef, useState } from "react";

// Falls off linearly with distance, clamped at minVal
const attribute = (distance, maxDistance, minVal, maxVal) =>
  Math.max(minVal, maxVal - Math.abs((maxVal * distance) / maxDistance) + minVal);

/**
 * Each letter of a variable font (Roboto Flex) swells in width and weight
 * the closer an eased "pointer" gets to it, and thins out further away.
 */
export default function TextPressure({
  text = "Compressa",
  fontFamily = "Roboto Flex",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  strokeWidth = 1.1,
  textColor = "#FFFFFF",
  strokeColor = "#FF0000",
  className = "",
  minFontSize = 24,
}) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const cursor = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);
  const chars = text.split("");

  useEffect(() => {
    const onMouse = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    const onTouch = (e) => {
      if (e.touches?.length) {
        target.current.x = e.touches[0].clientX;
        target.current.y = e.touches[0].clientY;
      }
    };
    // When a touch ends, relax back to the centre
    const recenter = () => {
      if (!containerRef.current) return;
      const { left, top, width: w, height: h } = containerRef.current.getBoundingClientRect();
      target.current.x = left + w / 2;
      target.current.y = top + h / 2;
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", recenter, { passive: true });
    window.addEventListener("touchcancel", recenter, { passive: true });

    if (containerRef.current) {
      const { left, top, width: w, height: h } = containerRef.current.getBoundingClientRect();
      cursor.current = { x: left + w / 2, y: top + h / 2 };
      target.current = { ...cursor.current };
    }

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", recenter);
      window.removeEventListener("touchcancel", recenter);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;
    const { width: w, height: h } = containerRef.current.getBoundingClientRect();
    const size = Math.max(w < 640 ? w / (chars.length * 0.72) : w / (chars.length / 2), minFontSize);
    setFontSize(size);
    setScaleY(1);
    setLineHeight(1);
    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();
      if (scale && textRect.height > 0) {
        const ratio = h / textRect.height;
        setScaleY(ratio);
        setLineHeight(ratio);
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    let timeout;
    let active = true;
    const debounced = () => {
      clearTimeout(timeout);
      timeout = setTimeout(setSize, 100);
    };
    debounced();
    window.addEventListener("resize", debounced);
    const resizeObserver = containerRef.current && typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(debounced)
      : null;
    if (containerRef.current) resizeObserver?.observe(containerRef.current);
    document.fonts?.ready.then(() => {
      if (active) debounced();
    });
    document.fonts?.addEventListener("loadingdone", debounced);
    return () => {
      active = false;
      clearTimeout(timeout);
      window.removeEventListener("resize", debounced);
      resizeObserver?.disconnect();
      document.fonts?.removeEventListener("loadingdone", debounced);
    };
  }, [setSize]);

  useEffect(() => {
    let frame;
    const animate = () => {
      cursor.current.x += (target.current.x - cursor.current.x) / 15;
      cursor.current.y += (target.current.y - cursor.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        const maxDist = isMobile
          ? Math.max(titleRect.width * 0.85, window.innerHeight * 0.45)
          : Math.max(titleRect.width / 2, 350);

        spansRef.current.forEach((span) => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const d = Math.hypot(cx - cursor.current.x, cy - cursor.current.y);

          const wdth = width
            ? Math.round(attribute(d, maxDist, isMobile ? 86 : 76, isMobile ? 130 : 142))
            : 100;
          const wght = weight ? Math.round(attribute(d, maxDist, isMobile ? 360 : 320, 760)) : 400;
          const ital = italic ? attribute(d, maxDist, 0.08, 0.62).toFixed(2) : "0";
          const opacity = alpha ? attribute(d, maxDist, 0, 1).toFixed(2) : "1";

          const settings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`;
          if (span.style.fontVariationSettings !== settings) span.style.fontVariationSettings = settings;
          if (alpha && span.style.opacity !== opacity) span.style.opacity = opacity;
        });
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [width, weight, italic, alpha]);

  const classes = [className, flex ? "tp-flex" : "", stroke ? "tp-stroke" : ""].filter(Boolean).join(" ");

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%", background: "transparent" }}>
      <style>{`
        .tp-flex {
          display: flex;
          justify-content: space-between;
        }
        .tp-stroke span {
          position: relative;
          color: ${textColor};
        }
        .tp-stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
        .text-pressure-title {
          color: ${textColor};
        }
      `}</style>
      <h1
        ref={titleRef}
        className={`text-pressure-title ${classes}`}
        style={{
          fontFamily,
          textTransform: "uppercase",
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          margin: 0,
          textAlign: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 100,
          width: "100%",
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            style={{ display: "inline-block", color: stroke ? undefined : textColor }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}
