import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { hero, profile } from "../data/profile";
import GhostCursor from "./GhostCursor";
import MagneticButton from "./MagneticButton";
import TextPressure from "./TextPressure";

// Floating dust specks: size (px), ember or white, position (%), float timing (s)
const DUST = [
  { size: 2.1, ember: true, top: 12, left: 8, duration: 6.2, delay: 0 },
  { size: 1.5, ember: false, top: 25, left: 82, duration: 7.4, delay: 0.6 },
  { size: 2.8, ember: false, top: 40, left: 15, duration: 5.8, delay: 1.2 },
  { size: 1.2, ember: true, top: 58, left: 91, duration: 8.1, delay: 1.8 },
  { size: 2.4, ember: false, top: 72, left: 24, duration: 6.9, delay: 2.4 },
  { size: 1.8, ember: false, top: 18, left: 64, duration: 5.5, delay: 3 },
  { size: 2.6, ember: true, top: 84, left: 45, duration: 7.8, delay: 3.6 },
  { size: 1.4, ember: false, top: 33, left: 37, duration: 6.1, delay: 4.2 },
  { size: 2.2, ember: false, top: 67, left: 78, duration: 8.5, delay: 4.8 },
  { size: 1.6, ember: true, top: 50, left: 6, duration: 5.2, delay: 5.4 },
  { size: 2.5, ember: false, top: 28, left: 95, duration: 7.1, delay: 6 },
  { size: 1.3, ember: false, top: 88, left: 12, duration: 6.6, delay: 6.6 },
  { size: 2, ember: true, top: 15, left: 48, duration: 8, delay: 7.2 },
  { size: 1.7, ember: false, top: 44, left: 71, duration: 5.9, delay: 7.8 },
  { size: 2.3, ember: false, top: 79, left: 58, duration: 7.3, delay: 8.4 },
  { size: 1.1, ember: true, top: 62, left: 31, duration: 6.4, delay: 9 },
  { size: 2.7, ember: false, top: 92, left: 84, duration: 8.3, delay: 9.6 },
  { size: 1.9, ember: false, top: 38, left: 52, duration: 5.6, delay: 10.2 },
];

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Hero() {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const taglineRef = useRef(null);
  const eyebrowRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const dustRef = useRef(null);
  const scrollCueRef = useRef(null);

  // Intro (starts as the loader lifts) + scroll-driven glow / fade-out
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 3 });
      tl.fromTo(glowRef.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 2, ease: "expo.out" }, 0);
      tl.fromTo(
        taglineRef.current.querySelectorAll(".hero-line"),
        { y: 40, scale: 0.85, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1, stagger: 0.14, ease: "back.out(1.8)" },
        0.7,
      );
      tl.fromTo(eyebrowRef.current, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.8, ease: "expo.out" }, 0.8);
      tl.fromTo(descriptionRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, 1.1);
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.85, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "back.out(1.7)" },
        1.3,
      );
      tl.fromTo(
        dustRef.current.querySelectorAll(".dust"),
        { opacity: 0 },
        { opacity: 1, duration: 2, stagger: 0.06, ease: "power2.out" },
        1,
      );
      tl.fromTo(scrollCueRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" }, 1.8);

      gsap.to(glowRef.current, {
        opacity: 0.3,
        y: -60,
        scale: 1.3,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.5 },
      });
      gsap.to(sectionRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "75% top", end: "100% top", scrub: 1 },
      });
    });
    return () => ctx.revert();
  }, []);

  // Glow and dust drift with the pointer
  useEffect(() => {
    const parallax = (x, y) => {
      const nx = (x / window.innerWidth - 0.5) * 2;
      const ny = (y / window.innerHeight - 0.5) * 2;
      gsap.to(glowRef.current, { x: nx * 40, y: ny * 25, duration: 1.2, ease: "power2.out" });
      dustRef.current.querySelectorAll(".dust").forEach((el, i) => {
        gsap.to(el, {
          x: nx * (2 + i * 0.8),
          y: ny * (1.5 + i * 0.6),
          duration: 1.8 + i * 0.08,
          ease: "power2.out",
        });
      });
    };
    const reset = () => {
      gsap.to(glowRef.current, { x: 0, y: 0, duration: 1.8, ease: "power2.out" });
      dustRef.current.querySelectorAll(".dust").forEach((el) => {
        gsap.to(el, { x: 0, y: 0, duration: 2, ease: "power2.out" });
      });
    };
    const onMouse = (e) => parallax(e.clientX, e.clientY);
    const onTouch = (e) => e.touches?.length && parallax(e.touches[0].clientX, e.touches[0].clientY);

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchend", reset, { passive: true });
    window.addEventListener("touchcancel", reset, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchend", reset);
      window.removeEventListener("touchcancel", reset);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen h-[100svh] min-h-[100svh] overflow-hidden select-none touch-pan-y"
      style={{ background: "#111111" }}
    >
      <GhostCursor
        color="#FC6B2F"
        brightness={0.75}
        edgeIntensity={0}
        trailLength={35}
        inertia={0.4}
        grainIntensity={0.025}
        bloomStrength={0.08}
        bloomRadius={0.8}
        bloomThreshold={0.04}
        fadeDelayMs={800}
        fadeDurationMs={1200}
        zIndex={10}
      />

      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{ opacity: 0.035, backgroundImage: NOISE, backgroundRepeat: "repeat", backgroundSize: "256px" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 30%, #111111 100%)" }}
        aria-hidden="true"
      />
      <div
        ref={glowRef}
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] pointer-events-none opacity-0 z-[6]"
        style={{
          background:
            "radial-gradient(circle, rgba(252,107,47,0.18) 0%, rgba(252,107,47,0.05) 40%, transparent 70%)",
          filter: "blur(35px)",
        }}
        aria-hidden="true"
      />

      <div ref={dustRef} className="absolute inset-0 pointer-events-none z-[8]" aria-hidden="true">
        {DUST.map((d, i) => (
          <div
            key={i}
            className="dust absolute rounded-full"
            style={{
              width: `${d.size}px`,
              height: `${d.size}px`,
              background: d.ember ? "rgba(252,107,47,0.5)" : "rgba(255,255,255,0.2)",
              top: `${d.top}%`,
              left: `${d.left}%`,
              animation: `float ${d.duration}s ease-in-out infinite`,
              animationDelay: `${d.delay}s`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      <div
        ref={eyebrowRef}
        className="absolute top-12 sm:top-20 md:top-24 left-4 sm:left-6 md:left-14 lg:left-20 z-[40] opacity-0 flex items-center gap-2 sm:gap-2.5 max-w-[calc(100vw-5rem)]"
      >
        <span className="w-[7px] h-[7px] shrink-0 rounded-full bg-ember animate-pulse" />
        <span
          className="text-[10px] sm:text-[11px] text-[#B5B5B5] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium truncate"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {hero.eyebrow}
        </span>
      </div>

      <div
        ref={descriptionRef}
        className="absolute bottom-[20%] sm:bottom-[18%] md:top-[72%] md:bottom-auto left-4 sm:left-6 md:left-14 lg:left-20 z-[40] max-w-[calc(100vw-2rem)] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] opacity-0"
      >
        <p
          className="text-[11.5px] sm:text-[13px] md:text-[14px] text-[#B5B5B5] leading-[1.6] sm:leading-[1.8] font-normal tracking-wide"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          {hero.description}
        </p>
      </div>

      <div
        ref={ctaRef}
        className="absolute bottom-6 sm:bottom-[8%] md:bottom-[12%] left-4 right-4 sm:left-auto sm:right-6 md:right-14 lg:right-20 z-[40] opacity-0 flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end gap-2.5 sm:gap-3.5"
      >
        <MagneticButton
          href="#projects"
          variant="primary"
          className="!rounded-full !px-4 sm:!px-7 !py-2.5 sm:!py-3.5 !text-[11px] sm:!text-[13px] !tracking-wide group shadow-[0_0_25px_rgba(160,42,34,0.4)] touch-manipulation"
        >
          <span className="flex items-center gap-2 sm:gap-3">
            <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full border border-void/30 flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="sm:w-[12px] sm:h-[12px]">
                <path
                  d="M1 11L11 1M11 1H3M11 1V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Explore Work →
          </span>
        </MagneticButton>
        <MagneticButton
          href="#contact"
          variant="outline"
          className="!rounded-full !px-4 sm:!px-6 !py-2.5 sm:!py-3 !text-[11px] sm:!text-[12px] !border-white/15 touch-manipulation"
        >
          Let's Talk →
        </MagneticButton>
      </div>

      <div
        className="absolute top-[25%] sm:top-[28%] md:top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] pointer-events-none select-none w-full flex flex-col items-center justify-center px-4"
        aria-hidden="true"
      >
        <div className="w-full max-w-[700px] md:max-w-[850px] h-[52px] sm:h-[80px] md:h-[135px] relative flex items-center justify-center drop-shadow-[0_0_24px_rgba(252,107,47,0.18)]">
          <TextPressure
            text={profile.heroWord}
            flex
            alpha={false}
            stroke
            strokeWidth={1.1}
            strokeColor="rgba(252, 107, 47, 0.72)"
            width
            weight
            italic
            textColor="#fff4ec"
            minFontSize={16}
          />
        </div>
        <div ref={taglineRef} className="mt-10 sm:mt-8 md:mt-8 w-full max-w-[850px] text-center z-[20] px-2">
          <p
            className="hero-line text-[clamp(0.55rem,2.2vw,0.88rem)] md:text-[clamp(0.72rem,1.08vw,0.88rem)] font-extrabold tracking-[0.12em] sm:tracking-[0.25em] uppercase text-ember drop-shadow-[0_0_20px_rgba(252,107,47,0.7)]"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {hero.tagline}
          </p>
        </div>
      </div>

      <div
        ref={scrollCueRef}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[45] hidden md:flex flex-col items-center gap-2 opacity-0"
      >
        <span
          className="text-[9px] text-[#B5B5B5]/60 tracking-[0.35em] uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Scroll
        </span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-white/20 to-transparent relative overflow-hidden">
          <div className="absolute w-full h-3 bg-ember/60" style={{ animation: "reveal-up 2s ease-in-out infinite" }} />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-[50]"
        style={{ background: "linear-gradient(to top, var(--void) 0%, transparent 100%)" }}
      />
    </section>
  );
}
