import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { experience, experienceIntro } from "../data/profile";

export default function Experience() {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.72", "end 0.48"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <section
      id="experience"
      className="relative py-16 sm:py-24 md:py-40 overflow-hidden"
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-iron to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[90vw] max-w-[600px] h-[300px] rounded-full opacity-15 pointer-events-none blur-[150px]"
        style={{ backgroundColor: "var(--ember)" }}
      />

      <div className="section-container relative z-10 px-4 sm:px-6 md:px-8">
        <div className="mb-12 sm:mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-ember inline-block rounded-full" />
            <span className="text-ember text-xs font-bold tracking-[0.25em] uppercase">{experienceIntro.label}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
            {experienceIntro.title}
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-ash max-w-xl leading-relaxed font-normal">
            {experienceIntro.subtitle}
          </p>
        </div>

        <div ref={timelineRef} className="relative space-y-8 sm:space-y-12 max-w-4xl mx-auto pl-8 sm:pl-10">
          <div aria-hidden="true" className="absolute left-[13px] sm:left-[21px] top-1 bottom-1 w-px rounded-full bg-white/10">
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-gradient-to-b from-ember via-[#fc6b2f] to-[#ffc29f] shadow-[0_0_12px_rgba(252,107,47,0.55)]"
              style={{ scaleY: progress }}
            />
          </div>
          {experience.map((item, index) => {
            const isAcademic = /Master|Bachelor|Class 1[02]/.test(item.role);
            return (
              <motion.div
                key={item.role + item.period}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={isAcademic ? { y: -5, transition: { duration: 0.25 } } : undefined}
                className={`exp-item group relative pb-8 sm:pb-12 border-b border-white/10 last:border-b-0 flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6 md:gap-12 transition-colors duration-300 ${isAcademic ? "rounded-xl hover:bg-white/[0.025]" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-[25px] sm:-left-[25px] top-1.5 z-10 h-3 w-3 rounded-full border bg-[#111114] transition-all duration-300 ${isAcademic ? "border-ember shadow-[0_0_12px_rgba(160,42,34,0.45)] group-hover:scale-125 group-hover:shadow-[0_0_18px_rgba(252,107,47,0.65)]" : "border-white/30"}`}
                />
                <div className="md:w-1/3 flex-shrink-0">
                  <span className="text-xs font-mono font-medium text-ash tracking-wider block mb-1">{item.period}</span>
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase block font-mono text-ember">
                    {item.company}
                  </span>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 tracking-tight group-hover:text-cloud transition-colors">
                    {item.role}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-ash leading-relaxed mb-4 sm:mb-6 font-normal">
                    {item.summary}
                  </p>
                  <ul className="space-y-2.5">
                    {item.points.map((point, pointIndex) => (
                      <motion.li
                        key={point}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.45, delay: 0.2 + pointIndex * 0.08 }}
                        className="flex items-start gap-3 text-sm text-silver font-normal"
                      >
                        <span className="text-ember font-bold mt-0.5 text-xs">▸</span>
                        <span className="leading-relaxed">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
