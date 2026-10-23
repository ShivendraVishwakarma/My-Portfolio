import {
  codingProfiles,
  contactIntro,
  experience,
  hero,
  menuItems,
  profile,
  projects,
  skills,
  socials,
} from "../src/data/profile.js";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY = 10;
const GEMINI_TIMEOUT_MS = 10000;

const portfolioContext = {
  profile,
  hero,
  projects,
  skills,
  codingProfiles,
  experience,
  contact: contactIntro,
  menu: menuItems,
  socials: socials.map(({ label, href }) => ({ label, href })),
};

const systemInstruction = `You are Shivendra Vishwakarma's portfolio assistant.

Use only the supplied portfolio information. You may summarize it, but do not invent employers, dates, projects, skills, achievements, salary information, or personal details.

You can answer questions about Shivendra's background, React/frontend experience, projects, technical skills, education, internship, coding profiles, availability, contact and social links.

If the answer is not available in the portfolio context, clearly say that the information is not available in Shivendra's portfolio and suggest visiting the Contact section.

Be concise, friendly, professional, and useful. Do not claim to be Shivendra himself. Identify yourself as Shivendra's portfolio assistant when appropriate.

Portfolio information (JSON):\n${JSON.stringify(portfolioContext)}`;

function sendJson(res, status, body) {
  res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed. Use POST." });
  }

  const { message, history } = req.body ?? {};
  if (typeof message !== "string" || !message.trim()) {
    return sendJson(res, 400, { error: "Enter a message to continue." });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return sendJson(res, 400, { error: "Messages must be 1000 characters or fewer." });
  }
  if (history !== undefined && !Array.isArray(history)) {
    return sendJson(res, 400, { error: "Conversation history must be a list of messages." });
  }

  const contents = (history ?? []).slice(-MAX_HISTORY).flatMap((item) => {
    if (!item || !["user", "assistant", "model"].includes(item.role) || typeof item.content !== "string") return [];
    const text = item.content.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!text) return [];
    return [{ role: item.role === "user" ? "user" : "model", parts: [{ text }] }];
  });
  contents.push({ role: "user", parts: [{ text: message.trim() }] });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 500, { error: "Chat is not configured yet. Please use the Contact section instead." });
  }

  const startedAt = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
    let response;
    try {
      response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents,
            generationConfig: {
              maxOutputTokens: 300,
              thinkingConfig: { thinkingLevel: "low" },
            },
          }),
        },
      );
    } finally {
      clearTimeout(timeout);
    }

    console.info("[chat] Gemini upstream", { status: response.status, elapsedMs: Date.now() - startedAt });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const status = response.status >= 400 && response.status <= 599 ? response.status : 502;
      const detail = typeof payload?.error?.message === "string"
        ? payload.error.message.split(apiKey).join("[redacted]").slice(0, 300)
        : "No error details were provided.";
      return sendJson(res, status, {
        error: response.status === 429
          ? `Gemini rate limit (HTTP 429): ${detail}`
          : `Gemini request failed (HTTP ${response.status}): ${detail}`,
      });
    }

    const reply = payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter((part) => typeof part === "string")
      .join("")
      .trim();
    if (!reply) {
      return sendJson(res, 502, { error: "The chat service returned an unreadable response. Please try again." });
    }

    return sendJson(res, 200, { reply });
  } catch (error) {
    console.info("[chat] Gemini upstream", { status: null, elapsedMs: Date.now() - startedAt });
    if (error?.name === "AbortError") {
      return sendJson(res, 504, { error: "The chat service took too long to respond. Please try again." });
    }
    return sendJson(res, 502, { error: "Could not reach the chat service. Please try again." });
  }
}
