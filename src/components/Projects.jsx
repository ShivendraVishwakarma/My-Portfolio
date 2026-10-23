import { motion, useSpring } from "framer-motion";
import { projects, projectsIntro } from "../data/profile";
import SplitText from "./SplitText";

const ease = [0.16, 1, 0.3, 1];
const viewport = { once: false, amount: 0.15 };
const josefin = { fontFamily: "var(--font-josefin), 'Josefin Sans', sans-serif" };

function ExternalIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

const pad = (n) => String(n).padStart(2, "0");

// Glass card: the card rises in, then its text slides from the side and the screenshot scales up
function ProjectCard({ project, index, total }) {
  const reversed = index % 2 === 1;
  const tiltX = useSpring(0, { stiffness: 190, damping: 24, mass: 0.6 });
  const tiltY = useSpring(0, { stiffness: 190, damping: 24, mass: 0.6 });

  const trackPointer = (event) => {
    if (event.pointerType === "touch") return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    tiltX.set((0.5 - y) * 7);
    tiltY.set((x - 0.5) * 9);
    card.style.setProperty("--project-spot-x", `${x * 100}%`);
    card.style.setProperty("--project-spot-y", `${y * 100}%`);
  };

  const resetPointer = (event) => {
    tiltX.set(0);
    tiltY.set(0);
    event.currentTarget.style.setProperty("--project-spot-x", "50%");
    event.currentTarget.style.setProperty("--project-spot-y", "50%");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        scale: 1.008,
        transition: { duration: 0.28, ease },
      }}
      onPointerMove={trackPointer}
      onPointerLeave={resetPointer}
      viewport={viewport}
      transition={{ duration: 0.8, ease }}
      style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
      className="group/project relative rounded-2xl sm:rounded-[32px] bg-white/[0.04] border border-white/20 hover:border-ember/40 backdrop-blur-3xl overflow-hidden px-4 py-6 sm:px-10 sm:py-10 lg:px-14 lg:py-14 min-h-[380px] sm:min-h-[480px] lg:min-h-[530px] flex flex-col justify-center shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_0_24px_rgba(255,255,255,0.03)] hover:shadow-[0_28px_70px_rgba(0,0,0,0.72),0_0_32px_rgba(160,42,34,0.14),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-[border-color,box-shadow] duration-300 transform-gpu"
    >
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover/project:opacity-100 transition-opacity duration-300"
        style={{ background: "radial-gradient(380px circle at var(--project-spot-x, 50%) var(--project-spot-y, 50%), rgba(252,107,47,0.16), transparent 68%)" }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: reversed ? 45 : -45 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className={`lg:col-span-6 flex flex-col justify-between h-full space-y-4 sm:space-y-6 ${
            reversed ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-xl flex items-center justify-center hover:scale-110 transition-transform shadow-md touch-manipulation"
                title="GitHub Repo"
              >
                <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white text-black font-semibold text-[11px] sm:text-xs tracking-wider uppercase hover:scale-105 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.25)] group touch-manipulation"
                title="Live Website"
              >
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black group-hover:scale-110 transition-transform shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L24 22H0L12 2Z" />
                </svg>
                <span>Live Site</span>
                <ExternalIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>
            )}
            <span className="ml-auto text-[11px] sm:text-xs font-mono text-slate-400 font-bold tracking-widest uppercase">
              {pad(index + 1)} / {pad(total)}
            </span>
          </div>

          <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight" style={josefin}>
            {project.title}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2.5 pt-2 sm:pt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider text-white uppercase bg-white/[0.06] border border-white/15 backdrop-blur-lg shadow-sm"
                style={josefin}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className={`lg:col-span-6 flex items-center justify-center ${reversed ? "lg:order-1" : "lg:order-2"}`}
        >
          <div className="relative w-full max-w-xl rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 bg-white/[0.03] backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] p-1.5 sm:p-3 group">
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white/[0.05] border-b border-white/10 rounded-t-lg sm:rounded-t-xl">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover rounded-b-lg sm:rounded-b-xl group-hover:scale-[1.02] transition-transform duration-500 transform-gpu"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative w-full pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-36 bg-black z-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-12 sm:mb-20">
          <SplitText
            text={projectsIntro.title}
            tag="h2"
            className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[#EAE6E1] uppercase mb-3 sm:mb-4"
            delay={40}
            duration={0.65}
            animationFrom={{ opacity: 0, y: 50, scale: 0.95 }}
            animationTo={{ opacity: 1, y: 0, scale: 1 }}
          />
          <p
            className="text-[11px] sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#C4C4C8] uppercase max-w-2xl mx-auto leading-relaxed px-2"
            style={josefin}
          >
            {projectsIntro.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-10 sm:gap-14">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} total={projects.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
