import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { contactIntro, profile, socials } from "../data/profile";

const poppins = { fontFamily: "var(--font-poppins), sans-serif" };
const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder:text-iron focus:outline-none focus:border-ember/50 transition-colors";
const inputStyle = { ...poppins, fontSize: "16px" };
const emptyForm = { name: "", email: "", message: "", honeypot: "" };

// Optional JSON endpoint (e.g. a serverless function). Without one the form hands off to the visitor's email app.
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;

const mailtoLink = (form) =>
  `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio Inquiry from ${form.name}`)}&body=${encodeURIComponent(
    `${form.message}\n\n— ${form.name} (${form.email})`,
  )}`;

function DetailIcon({ children }) {
  return (
    <span className="w-8 h-8 rounded-full bg-ember/10 border border-ember/20 flex items-center justify-center text-ember mt-0.5 shrink-0">
      {children}
    </span>
  );
}

const iconProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export default function Contact() {
  const sectionRef = useRef(null);
  const submittingRef = useRef(false);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".contact-animate"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (form.honeypot) return;
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError("Please enter your name, a valid email address, and a message.");
      return;
    }
    submittingRef.current = true;
    setStatus("loading");
    setError("");
    try {
      if (CONTACT_ENDPOINT) {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || data?.success === false || data?.ok === false) {
          throw new Error(data?.errors?.map((item) => item.message).join(" ") || data?.error || "The contact service could not accept your message. Please try again.");
        }
      } else {
        window.location.href = mailtoLink(form);
      }
      setStatus("success");
      setForm(emptyForm);
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("error");
      setError(err instanceof TypeError
        ? "Could not reach the contact service. Check your connection and try again, or email directly."
        : err.message || "An unexpected error occurred. Please try again or email directly.");
    } finally {
      submittingRef.current = false;
    }
  };

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const loading = status === "loading";

  return (
    <section ref={sectionRef} id="contact" className="relative py-16 sm:py-24 md:py-40 overflow-hidden" style={poppins}>
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-iron to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[800px] h-[350px] sm:h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(252,107,47,0.12) 0%, transparent 70%)", filter: "blur(80px)" }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10 px-4 sm:px-6 md:px-8">
        <div className="mb-10 sm:mb-16 md:mb-20 text-center">
          <span className="text-ember text-xs font-semibold tracking-[0.25em] uppercase block mb-3">
            {contactIntro.label}
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight max-w-3xl mx-auto">
            {contactIntro.title}
          </h2>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-ash max-w-xl mx-auto leading-relaxed font-normal">
            {contactIntro.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          <div className="contact-animate glass-card p-5 sm:p-8 md:p-10 flex flex-col justify-between lg:col-span-5">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Contact Details</h3>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3.5">
                  <DetailIcon>
                    <svg {...iconProps}>
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </DetailIcon>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-ash uppercase tracking-wider mb-0.5 font-semibold">Email</p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm text-white hover:text-ember transition-colors font-medium break-all"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <DetailIcon>
                    <svg {...iconProps}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </DetailIcon>
                  <div>
                    <p className="text-[11px] text-ash uppercase tracking-wider mb-0.5 font-semibold">Phone</p>
                    <a
                      href={`tel:${profile.phone.replace(/\s/g, "")}`}
                      className="text-sm text-white hover:text-ember transition-colors font-medium"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <DetailIcon>
                    <svg {...iconProps}>
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </DetailIcon>
                  <div>
                    <p className="text-[11px] text-ash uppercase tracking-wider mb-0.5 font-semibold">Location</p>
                    <p className="text-sm text-white font-medium">{profile.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5 shrink-0 relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="absolute inset-1 rounded-full border border-emerald-400/50 animate-ping" />
                  </span>
                  <div>
                    <p className="text-[11px] text-ash uppercase tracking-wider mb-0.5 font-semibold">Availability</p>
                    <p className="text-sm text-green-400 font-medium">{profile.availability}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-white/5 border border-white/10 hover:border-ember/40 hover:text-ember transition-all duration-300"
              >
                Download Résumé <span aria-hidden="true">↓</span>
              </a>
              <p className="text-[11px] text-ash uppercase tracking-wider mb-3.5 font-semibold">Connect</p>
              <div className="flex gap-2.5 sm:gap-3 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-ember/40 hover:bg-white/10 transition-all duration-300 group touch-manipulation"
                    title={s.label}
                  >
                    <img
                      src={s.icon}
                      alt={s.label}
                      className="w-4 h-4 object-contain opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-animate glass-card p-5 sm:p-8 md:p-10 lg:col-span-7">
            {status === "success" ? (
              <div className="py-10 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] animate-fade-in">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {CONTACT_ENDPOINT ? "Message Delivered!" : "Almost There!"}
                </h4>
                <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                  {CONTACT_ENDPOINT
                    ? "Thank you for reaching out. I have received your note and will get back to you shortly."
                    : "Your email app should now be open with the message ready — just hit send and I'll get back to you shortly."}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <input
                  type="text"
                  name="honeypot"
                  value={form.honeypot}
                  onChange={update("honeypot")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                {status === "error" && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center justify-between gap-3">
                    <span>{error || "Failed to deliver. Please try again or email directly."}</span>
                    <a href={mailtoLink(form)} className="underline text-white font-medium shrink-0">
                      Email Direct
                    </a>
                  </div>
                )}
                <div>
                  <label htmlFor="contact-name" className="text-xs text-ash uppercase tracking-wider block mb-1.5 font-semibold">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="Your name"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-xs text-ash uppercase tracking-wider block mb-1.5 font-semibold">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="text-xs text-ash uppercase tracking-wider block mb-1.5 font-semibold">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={form.message}
                    onChange={update("message")}
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    placeholder="Tell me about your project..."
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full font-semibold text-sm tracking-wide text-white bg-ember hover:bg-ember-bright transition-all duration-300 shadow-[0_0_25px_rgba(160,42,34,0.4)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          d="M14 2L7 9M14 2L10 14L7 9M14 2L2 6L7 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div
        className="section-container relative z-10 px-4 sm:px-6 md:px-8"
        style={{
          marginTop: "clamp(36px, 5vw, 80px)",
          paddingTop: "24px",
          paddingBottom: "32px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-ash">
            © {new Date().getFullYear()} {profile.name}. Crafted with passion.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs text-ash hover:text-white transition-colors flex items-center gap-1.5 font-medium group cursor-pointer py-1"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5 text-ember font-bold">↑</span>
          </button>
        </div>
      </div>
    </section>
  );
}
