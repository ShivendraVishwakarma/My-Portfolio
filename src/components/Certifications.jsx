import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { certifications, certificationsIntro, featuredAchievement } from "../data/profile";

const confettiPieces = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  originX: index % 2 === 0 ? 7 : 93,
  originY: 30 + (index % 4) * 12,
  x: (index % 2 === 0 ? 1 : -1) * (28 + (index * 17) % 105),
  y: -24 - (index * 19) % 95,
  rotation: (index % 2 === 0 ? 1 : -1) * (130 + index * 23),
  color: ["#a3f76b", "#f6d365", "#ff805e", "#f6f1e9"][index % 4],
}));

function CertificateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="M7 3.75h10a2 2 0 0 1 2 2v12.5l-3.25-1.9L12 18.25l-3.75-1.9L5 18.25V5.75a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.5 8h7M8.5 11h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Certifications() {
  const [celebrationRun, setCelebrationRun] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  return (
    <section id="certifications" className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[80vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/10 blur-[140px]"
      />
      <div className="section-container relative z-10 px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-14"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-block h-[2px] w-8 rounded-full bg-ember" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-ember">{certificationsIntro.label}</span>
          </div>
          <h2 className="text-2xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {certificationsIntro.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm font-normal leading-relaxed text-ash sm:mt-4 sm:text-base md:text-lg">
            {certificationsIntro.subtitle}
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -5, transition: { duration: 0.28 } }}
          onHoverStart={() => {
            setCelebrationRun((run) => run + 1);
            setCelebrating(true);
          }}
          onHoverEnd={() => setCelebrating(false)}
          className="group/achievement relative mb-6 overflow-hidden rounded-[24px] border border-lime-400/25 bg-[#050806] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:mb-8 sm:rounded-[30px] sm:p-8 md:p-10"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_0%,rgba(132,239,83,0.13),transparent_45%)]" />
          <motion.div
            aria-hidden="true"
            initial={{ x: "-150%" }}
            whileInView={{ x: "260%" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.15, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-lime-200/[0.08] to-transparent"
          />
          <div className="pointer-events-none absolute inset-[7px] rounded-[18px] border border-dashed border-white/10 sm:inset-3 sm:rounded-[22px]" />
          <AnimatePresence>
            {celebrating && (
              <>
                {confettiPieces.map((piece) => (
                  <motion.span
                    key={`${celebrationRun}-${piece.id}`}
                    aria-hidden="true"
                    initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 1, 1, 0], x: piece.x, y: piece.y, rotate: piece.rotation, scale: [0.4, 1, 0.75] }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 1.1, delay: piece.id * 0.035, repeat: Infinity, repeatDelay: 0.12, ease: "easeOut" }}
                    style={{ left: `${piece.originX}%`, top: `${piece.originY}%`, backgroundColor: piece.color }}
                    className="pointer-events-none absolute z-30 h-2 w-1.5 rounded-[1px] shadow-[0_0_8px_currentColor]"
                  />
                ))}
                {["left-3", "right-3"].map((position, index) => (
                  <motion.span
                    key={`${celebrationRun}-popper-${position}`}
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.25, rotate: index === 0 ? -35 : 35 }}
                    animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.12, 1], rotate: index === 0 ? [-5, 5, -5] : [5, -5, 5] }}
                    exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                    className={`pointer-events-none absolute ${position} top-1/2 z-30 text-2xl sm:text-3xl`}
                  >
                    🎉
                  </motion.span>
                ))}
              </>
            )}
          </AnimatePresence>
          <div className="relative z-20 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-6 flex items-center justify-between gap-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-[10px] sm:tracking-[0.24em]">
                <span>{featuredAchievement.event} · {featuredAchievement.edition}</span>
                <span className="flex shrink-0 items-center gap-1.5 text-lime-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" /> Verified
                </span>
              </div>
              <p className="mb-1 text-center text-sm font-semibold text-white sm:text-base">HackerRank</p>
              <h3 className="text-center font-serif text-4xl italic tracking-tight text-lime-300 drop-shadow-[0_0_22px_rgba(132,239,83,0.28)] sm:text-6xl md:text-7xl">
                Orchestrate
              </h3>
              <p className="mt-4 text-center text-[10px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-white/50 sm:mt-5 sm:text-xs sm:tracking-[0.24em]">
                Participation certificate awarded to
              </p>
              <p className="mt-2 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">Shivendra</p>
              <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/75 sm:mt-5 sm:text-base">
                For participating in the August 2026 edition by {featuredAchievement.achievement.toLowerCase()}.
              </p>
            </div>

            <div className="mx-auto w-full max-w-sm rounded-2xl border border-lime-400/25 bg-gradient-to-br from-lime-500/[0.12] to-emerald-950/40 p-5 text-center shadow-[inset_0_0_30px_rgba(132,239,83,0.05),0_0_30px_rgba(132,239,83,0.08)] sm:p-7 lg:min-w-[270px]">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">Final rank</span>
              <div className="mt-1 flex items-baseline justify-center gap-2 font-mono">
                <motion.span
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.65, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl font-extrabold tracking-tight text-lime-300 drop-shadow-[0_0_16px_rgba(132,239,83,0.25)] sm:text-6xl"
                >
                  #{featuredAchievement.rank}
                </motion.span>
                <span className="text-lg text-white/40">/ {featuredAchievement.participants.toLocaleString()}</span>
              </div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full origin-left rounded-full bg-lime-300 shadow-[0_0_12px_rgba(132,239,83,0.7)]"
                />
              </div>
              <span className="mt-3 block font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">Verified by HackerRank</span>
            </div>
          </div>
        </motion.article>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {certifications.map((item, index) => (
            <motion.article
              key={item.credential}
              initial={{ opacity: 0, y: 36, rotateX: 10, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.72, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -7,
                rotateY: index % 2 === 0 ? 3 : -3,
                rotateX: -2,
                scale: 1.015,
                transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
              }}
              whileTap={{ scale: 0.99 }}
              style={{ transformPerspective: 900 }}
              className="group relative flex min-h-52 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:border-ember/45 hover:bg-white/[0.055] hover:shadow-[0_24px_52px_rgba(0,0,0,0.42),0_0_28px_rgba(160,42,34,0.14)] transform-gpu sm:p-6"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-ember/0 blur-3xl transition-colors duration-500 group-hover:bg-ember/20" />
              <motion.div
                aria-hidden="true"
                initial={{ x: "-160%" }}
                whileInView={{ x: "260%" }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.85, delay: 0.3 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent"
              />
              <div className="relative z-10 mb-8 flex items-center justify-between">
                <motion.span
                  initial={{ scale: 0.55, rotate: -24, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.2 + index * 0.12 }}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-ember/25 bg-ember/10 text-[#f59a75] transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:border-ember/50 group-hover:bg-ember/15 group-hover:shadow-[0_0_22px_rgba(160,42,34,0.25)]"
                >
                  <CertificateIcon />
                </motion.span>
                <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-ash/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <span className="relative z-10 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ember">
                Certificate
              </span>
              <h3 className="relative z-10 text-sm font-semibold leading-relaxed text-white sm:text-base">
                {item.credential}
              </h3>
              <motion.span
                initial={{ scaleX: 0.2, opacity: 0.4 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.42 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 mt-auto block h-px w-10 origin-left bg-ember/70 transition-all duration-300 group-hover:w-16"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
