require("dotenv").config();
const express = require("express");
const path = require("path");
const OpenAI = require("openai");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = Number(process.env.PORT || 3000);
app.use(express.json({ limit: "12kb" }));
app.use(express.static(path.join(__dirname)));

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  : null;

// Small in-memory rate limit for the prototype. Use a durable limiter before public deployment.
const hits = new Map();
function rateLimit(req, res, next) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const recent = (hits.get(key) || []).filter(t => now - t < 60_000);
  if (recent.length >= 15) return res.status(429).json({ error: "Please wait a little before asking Rocky more questions." });
  recent.push(now);
  hits.set(key, recent);
  next();
}

const SYSTEM_PROMPT = `You are Rocky Raccoon, a friendly, calm educational helper for children in kindergarten through grade 5.
Use short, clear, age-appropriate language. Be kind, reassuring, and never shame a learner.
You teach general emergency-preparedness concepts: earthquake safety, fire safety, school drills, shelter-in-place, emergency kits, and asking trusted adults for help.
Prioritize these rules:
- In a real emergency, tell the child to follow their teacher, caregiver, local emergency officials, and established school/family plans.
- Never encourage a child to approach danger, investigate smoke/fire, re-enter a dangerous building, or ignore adult directions.
- For a possible immediate emergency, say to get to safety if possible and alert a trusted adult or emergency responder; in the US, 911 is for urgent emergencies.
- Do not request or encourage sharing names, home addresses, school names, phone numbers, passwords, photos, or other private information. If a child shares private information, do not repeat it.
- Do not diagnose injuries or provide detailed medical instructions. Encourage help from a trusted adult/emergency professional.
- If asked something outside reviewed safety topics, say you are not sure and encourage asking a trusted adult.
- Never claim you have contacted emergency services or a caregiver.
Keep answers concise (usually 2–5 sentences).`;
const ALLOWED_TOPICS = [
  "earthquake", "fire", "smoke", "drill", "alarm", "shelter", "emergency", "safety",
  "kit", "flashlight", "water", "help", "adult", "grown-up", "grown up", "teacher",
  "caregiver", "911", "afraid", "scared", "worried", "evacuat", "drop", "cover",
  "hold on", "stop drop roll", "prepared", "preparedness", "family plan"
];

app.post("/api/chat", rateLimit, async (req, res) => {
  try {
    if (!openai) return res.status(503).json({ error: "Rocky's AI service is not configured yet." });
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message || message.length > 800) return res.status(400).json({ error: "Please enter a question up to 800 characters." });

    // Optional topic guardrail: off-topic questions receive a safe response without calling the model.
    const lower = message.toLowerCase();
    const recentHistory = Array.isArray(req.body?.history) ? req.body.history.slice(-6) : [];
    const recentUserContext = recentHistory
      .filter(m => m && m.role === "user" && typeof m.content === "string")
      .map(m => m.content.toLowerCase().slice(0, 800))
      .join(" ");
    const hasSafetyContext = ALLOWED_TOPICS.some(topic => recentUserContext.includes(topic));
    if (!ALLOWED_TOPICS.some(topic => lower.includes(topic)) && !hasSafetyContext) {
      return res.json({ reply: "That's a good question to bring to a trusted grown-up, Explorer. I can help with earthquake safety, fire safety, school drills, sheltering in place, emergency kits, and getting help. What would you like to learn about?" });
    }

    // If a token is supplied and Supabase is configured, verify it. Guests are allowed to ask questions.
    const auth = req.headers.authorization || "";
    if (auth.startsWith("Bearer ") && supabase) {
      const token = auth.slice(7);
      const { error } = await supabase.auth.getUser(token);
      if (error) return res.status(401).json({ error: "Your session has expired. Please log in again." });
    }

    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-10) : [];
    const messages = history
      .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .map(m => ({ role: m.role, content: m.content.slice(0, 800) }));
    messages.push({ role: "user", content: message });

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: SYSTEM_PROMPT,
      input: messages,
      max_output_tokens: 350
    });
    const reply = (response.output_text || "").trim();
    if (!reply) return res.status(502).json({ error: "Rocky couldn't make a reply just now. Please try again." });
    res.json({ reply });
  } catch (err) {
    console.error("Rocky chat error:", err.message);
    res.status(500).json({ error: "Rocky is having trouble connecting. Please try again." });
  }
});

app.get("/api/health", (_req, res) => res.json({
  ok: true,
  aiConfigured: Boolean(openai),
  authConfigured: Boolean(supabase)
}));

app.listen(PORT, () => {
  console.log(`Safety Quest running at http://localhost:${PORT}`);
  if (!openai) console.log("OPENAI_API_KEY is not set; frontend will use prepared demo answers.");
});
