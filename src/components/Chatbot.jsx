import { useEffect, useRef, useState } from "react";

const greeting = {
  role: "assistant",
  content: "Hi! I’m Shivendra’s portfolio assistant. Ask me about his projects, skills, experience, or how to get in touch.",
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([greeting]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function sendMessage(event) {
    event?.preventDefault();
    const message = draft.trim();
    if (!message || loading) return;
    if (message.length > 1000) {
      setError("Messages must be 1000 characters or fewer.");
      return;
    }

    const history = messages
      .filter((item) => item !== greeting)
      .slice(-10)
      .map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, { role: "user", content: message }].slice(-10));
    setDraft("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || (response.status === 429
        ? "The chat is busy. Please try again shortly."
        : "The chat service is unavailable. Please try again."));
      if (typeof payload?.reply !== "string" || !payload.reply.trim()) {
        throw new Error("The chat service returned an unreadable response. Please try again.");
      }
      setMessages((current) => [...current, { role: "assistant", content: payload.reply.trim() }].slice(-10));
    } catch (requestError) {
      setError(requestError instanceof TypeError
        ? "Could not connect to the chat. Check your connection and try again."
        : requestError.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="chatbot">
      {open && (
        <section
          id="chatbot-panel"
          className="chatbot-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chatbot-title"
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          <header className="chatbot-header">
            <div>
              <span className="chatbot-kicker">PORTFOLIO ASSISTANT</span>
              <h2 id="chatbot-title">Ask Shivendra</h2>
            </div>
            <button className="chatbot-close" type="button" aria-label="Close chat" onClick={() => { setOpen(false); triggerRef.current?.focus(); }}>×</button>
          </header>
          <div className="chatbot-transcript" ref={transcriptRef} aria-live="polite" aria-label="Chat messages">
            {messages.map((item, index) => (
              <div className={`chatbot-message chatbot-message--${item.role}`} key={`${index}-${item.role}`}>
                <span className="chatbot-message-label">{item.role === "user" ? "You" : "Assistant"}</span>
                <p>{item.content}</p>
              </div>
            ))}
            {loading && <div className="chatbot-status" role="status"><span className="chatbot-spinner" /> Thinking…</div>}
          </div>
          {error && <p className="chatbot-error" role="alert">{error}</p>}
          <form className="chatbot-form" onSubmit={sendMessage}>
            <label className="chatbot-sr-only" htmlFor="chatbot-input">Your message</label>
            <textarea
              id="chatbot-input"
              ref={inputRef}
              value={draft}
              maxLength={1000}
              rows={2}
              placeholder="Ask about projects, skills…"
              onChange={(event) => { setDraft(event.target.value); if (error) setError(""); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); }
              }}
              disabled={loading}
            />
            <button type="submit" aria-label="Send message" disabled={loading || !draft.trim()}>Send</button>
          </form>
          <div className="chatbot-footer">Answers are based on the information in this portfolio.</div>
        </section>
      )}
      <button
        ref={triggerRef}
        className="chatbot-launcher"
        type="button"
        aria-label={open ? "Close Ask Shivendra chat" : "Open Ask Shivendra chat"}
        aria-controls="chatbot-panel"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">{open ? "×" : "✦"}</span>
        <span className="chatbot-launcher-text">{open ? "Close chat" : "Ask Shivendra"}</span>
      </button>
    </div>
  );
}
