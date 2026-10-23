import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { codingProfiles, skillDescriptions, skills, skillsIntro } from "../data/profile";
import LeetCodeHeatmap from "./LeetCodeHeatmap";

const josefin = { fontFamily: "var(--font-josefin), 'Josefin Sans', sans-serif" };

function isCount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function readSyncedData(data) {
  const candidate = data?.stats;
  const stats = candidate && [candidate.total, candidate.easy, candidate.medium, candidate.hard].every(isCount) &&
    candidate.easy + candidate.medium + candidate.hard === candidate.total
    ? candidate
    : null;

  let calendar = null;
  let calendarYears = null;
  let calendarFetchedAt = null;
  const years = data?.calendarYears;
  const validYears = Array.isArray(years) && years.length > 0 && years.every(
    (year, index) => Number.isInteger(year) && year >= 2000 &&
      (index === 0 || year === years[index - 1] + 1),
  );
  const entries = data?.calendar && typeof data.calendar === "object" && !Array.isArray(data.calendar)
    ? Object.entries(data.calendar)
    : [];
  const validCalendar = validYears && entries.length > 0 && entries.every(([timestamp, count]) => {
    const seconds = Number(timestamp);
    return /^\d+$/.test(timestamp) && Number.isSafeInteger(seconds) && seconds > 0 && isCount(count) &&
      years.includes(new Date(seconds * 1000).getUTCFullYear());
  }) && typeof data.calendarFetchedAt === "string" && !Number.isNaN(Date.parse(data.calendarFetchedAt));
  if (validCalendar) {
    calendar = data.calendar;
    calendarYears = years;
    calendarFetchedAt = data.calendarFetchedAt;
  }
  return { stats, calendar, calendarYears, calendarFetchedAt, statsFetchedAt: data?.statsFetchedAt };
}

function ProfileHeader({ icon, name, handle, href }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <img src={icon} alt="" className="w-4 h-4 object-contain" />
        </span>
        <div className="min-w-0">
          <p className="text-white font-bold text-lg leading-tight">{name}</p>
          <p className="text-xs text-ash font-mono truncate">@{handle}</p>
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-ash hover:text-ember transition-colors font-semibold uppercase tracking-wider shrink-0"
      >
        View ↗
      </a>
    </div>
  );
}

// Big number that counts up from 0 when the section scrolls in
function Counter({ value, label }) {
  return (
    <div>
      <span
        data-count={value}
        className="block text-5xl sm:text-6xl font-bold text-white tracking-tight leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        0
      </span>
      <span className="block mt-2 text-[11px] text-ash uppercase tracking-wider font-semibold">{label}</span>
    </div>
  );
}

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState(null);
  const sectionRef = useRef(null);
  const [syncData, setSyncData] = useState(null);
  const [githubSyncData, setGithubSyncData] = useState(null);
  const [activeProfile, setActiveProfile] = useState("leetcode");
  const { codechef, github } = codingProfiles;
  const leetcode = {
    ...codingProfiles.leetcode,
    solved: syncData?.stats?.total ?? codingProfiles.leetcode.solved,
    breakdown: codingProfiles.leetcode.breakdown.map((difficulty) => ({
      ...difficulty,
      solved: syncData?.stats?.[difficulty.label.toLowerCase()] ?? difficulty.solved,
    })),
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    fetch("/data/leetcode.json", { signal: controller.signal, cache: "no-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`LeetCode JSON returned HTTP ${response.status}.`);
        return response.json();
      })
      .then((data) => setSyncData(readSyncedData(data)))
      .catch((error) => {
        if (error.name !== "AbortError") console.warn(`Could not load LeetCode sync data; using profile fallback counts. ${error.message}`);
        setSyncData(readSyncedData(null));
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    fetch(`https://github-contributions-api.jogruber.de/v4/${github.handle}?y=last`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub contributions returned HTTP ${response.status}.`);
        return response.json();
      })
      .then((data) => {
        const contributions = Array.isArray(data?.contributions)
          ? data.contributions.filter(
              (entry) =>
                typeof entry?.date === "string" &&
                Number.isSafeInteger(entry?.count) &&
                entry.count >= 0 &&
                !Number.isNaN(Date.parse(entry.date)),
            )
          : [];
        const calendar = Object.fromEntries(
          contributions.map((entry) => [
            Math.floor(Date.parse(`${entry.date}T00:00:00Z`) / 1000),
            entry.count,
          ]),
        );
        setGithubSyncData({
          calendar,
          total: Number.isSafeInteger(data?.total?.lastYear) ? data.total.lastYear : null,
          fetchedAt: new Date().toISOString(),
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.warn(`Could not load GitHub contributions; showing an empty activity grid. ${error.message}`);
        }
        setGithubSyncData({ calendar: {}, total: null, fetchedAt: null });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [github.handle]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" };

      gsap.fromTo(
        ".skills-animate",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: trigger },
      );

      gsap.utils.toArray("[data-count]").forEach((el) => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: Number(el.dataset.count),
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: trigger,
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value));
          },
        });
      });

      gsap.fromTo(
        "[data-bar]",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, stagger: 0.12, ease: "expo.out", delay: 0.3, scrollTrigger: trigger },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [activeProfile, leetcode.solved, codechef.solved, github.repos]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-16 sm:py-24 md:py-40 overflow-hidden"
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-iron to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-0 w-[70vw] max-w-[600px] h-[300px] rounded-full opacity-10 pointer-events-none blur-[150px]"
        style={{ backgroundColor: "var(--ember)" }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10 px-4 sm:px-6 md:px-8">
        <div className="mb-12 sm:mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-ember inline-block rounded-full" />
            <span className="text-ember text-xs font-bold tracking-[0.25em] uppercase">{skillsIntro.label}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
            {skillsIntro.title}
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-ash max-w-xl leading-relaxed font-normal">
            {skillsIntro.subtitle}
          </p>
        </div>

        {/* Coding profiles */}
        <div className="space-y-6 md:space-y-8 mb-6 md:mb-8">
          {/* Coding profile – full width with heatmap */}
          <div className="skills-animate glass-card p-5 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
              {/* Left: header + counter + difficulty bars */}
              <div className="lg:w-64 shrink-0">
                <div className="flex items-center gap-1 p-1 mb-6 rounded-lg bg-white/5 border border-white/10" role="tablist" aria-label="Activity profile">
                  {["leetcode", "github"].map((profile) => (
                    <button
                      key={profile}
                      type="button"
                      role="tab"
                      aria-selected={activeProfile === profile}
                      onClick={() => setActiveProfile(profile)}
                      className={`flex-1 px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        activeProfile === profile ? "bg-ember text-white" : "text-ash hover:text-white"
                      }`}
                    >
                      {profile}
                    </button>
                  ))}
                </div>
                {activeProfile === "leetcode" ? (
                  <>
                    <ProfileHeader
                      icon="https://cdn.simpleicons.org/leetcode/ffffff"
                      name="LeetCode"
                      handle={leetcode.handle}
                      href={leetcode.href}
                    />
                    <Counter key={activeProfile} value={leetcode.solved} label="Questions solved" />
                    <div className="mt-6 space-y-4">
                      {leetcode.breakdown.map((d) => (
                        <div key={d.label}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-semibold" style={{ color: d.color }}>{d.label}</span>
                            <span className="text-ash font-mono"><span className="text-white font-semibold">{d.solved}</span> / {d.total}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div data-bar="" className="h-full rounded-full origin-left" style={{ width: `${Math.max(2, (d.solved / leetcode.solved) * 100)}%`, background: d.color, boxShadow: `0 0 12px ${d.color}66` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <ProfileHeader
                      icon="https://cdn.simpleicons.org/github/ffffff"
                      name="GitHub"
                      handle={github.handle}
                      href={github.href}
                    />
                    <Counter key={activeProfile} value={githubSyncData?.total ?? 0} label="Contributions last year" />
                  </>
                )}
              </div>

              {/* Right: heatmap */}
              <div className="flex-1 min-w-0 mt-8 lg:mt-0">
                <p
                  className="text-[11px] text-ash uppercase tracking-wider font-semibold mb-1"
                  style={{ letterSpacing: "0.2em" }}
                >
                  {activeProfile === "leetcode" ? "Submission Activity" : "Contribution Activity"}
                </p>
                <LeetCodeHeatmap
                  key={activeProfile}
                  solvedCount={activeProfile === "leetcode" ? leetcode.solved : githubSyncData?.total ?? 0}
                  calendar={activeProfile === "leetcode" ? syncData?.calendar : githubSyncData?.calendar}
                  calendarYears={activeProfile === "leetcode" ? syncData?.calendarYears : null}
                  calendarFetchedAt={activeProfile === "leetcode" ? syncData?.calendarFetchedAt : githubSyncData?.fetchedAt}
                  activityLabel={activeProfile === "leetcode" ? "submission" : "contribution"}
                  fallbackData={activeProfile === "leetcode"}
                />
              </div>
            </div>
          </div>

          {/* CodeChef + GitHub – two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="skills-animate glass-card p-5 sm:p-8 flex flex-col justify-between">
              <ProfileHeader
                icon="https://cdn.simpleicons.org/codechef/ffffff"
                name="CodeChef"
                handle={codechef.handle}
                href={codechef.href}
              />
              <Counter value={codechef.solved} label="Problems solved" />
            </div>

            <div className="skills-animate glass-card p-5 sm:p-8 flex flex-col justify-between">
              <ProfileHeader
                icon="https://cdn.simpleicons.org/github/ffffff"
                name="GitHub"
                handle={github.handle}
                href={github.href}
              />
              <Counter value={github.repos} label="Public repositories" />
            </div>
          </div>
        </div>

        <div className="skills-animate glass-card p-5 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {skills.map((s) => (
              <div key={s.group}>
                <p className="text-[11px] text-ember uppercase tracking-wider mb-3 font-semibold">{s.group}</p>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-expanded={activeSkill === item}
                      aria-controls={`skill-description-${s.group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      onMouseEnter={() => setActiveSkill(item)}
                      onMouseLeave={(event) => {
                        if (document.activeElement !== event.currentTarget) setActiveSkill(null);
                      }}
                      onFocus={() => setActiveSkill(item)}
                      onBlur={() => setActiveSkill(null)}
                      onClick={() => setActiveSkill(item)}
                      className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase bg-white/[0.06] border border-white/15 cursor-pointer transition-colors duration-200 hover:border-ember/60 hover:bg-ember/10 hover:text-white hover:shadow-[0_4px_18px_rgba(160,42,34,0.2)] focus-visible:border-ember/60 focus-visible:bg-ember/10 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/70 focus-visible:shadow-[0_4px_18px_rgba(160,42,34,0.2)]"
                      style={josefin}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <p
                  id={`skill-description-${s.group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className={`h-14 overflow-hidden pt-2 text-xs leading-relaxed text-ash transition-opacity duration-200 ${s.items.includes(activeSkill) ? "opacity-100" : "opacity-0"}`}
                  aria-live="polite"
                >
                  {s.items.includes(activeSkill) ? skillDescriptions[activeSkill] : " "}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[11px] text-ash/70 text-right font-mono">
          Stats as of {syncData?.stats && syncData.statsFetchedAt
            ? new Date(syncData.statsFetchedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : codingProfiles.updated}
        </p>
      </div>
    </section>
  );
}
