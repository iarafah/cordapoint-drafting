// Drafts public text with Gemini: reads a prompt on stdin, prints the draft.
// Usage: echo "Draft a LinkedIn post about…" | node "${CLAUDE_PLUGIN_ROOT}/scripts/gemini-draft.mjs"
// Needs GEMINI_API_KEY. Never send personal data, secrets, confidential business information: public text only.

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error("GEMINI_API_KEY is not set.");
  process.exit(1);
}

// Tried in order: the first is often overloaded (503), so fall back quickly.
const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.7-flash", "gemini-flash-latest"];
const RETRYABLE = new Set([429, 500, 503]);

let prompt = "";
for await (const chunk of process.stdin) prompt += chunk;
if (!prompt.trim()) {
  console.error("Pipe the prompt in on stdin.");
  process.exit(1);
}

const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
let last = "";
for (const [i, model] of MODELS.entries()) {
  const tries = i === 0 ? 1 : 2;
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body,
          signal: AbortSignal.timeout(90_000),
        },
      );
      if (res.ok) {
        const data = await res.json();
        const text = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
        console.error(`[model: ${model}]`);
        console.log(text);
        process.exit(0);
      }
      last = `${model} HTTP ${res.status}`;
      if (!RETRYABLE.has(res.status)) break;
    } catch (err) {
      last = `${model} ${err.name}`;
    }
    await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
  }
}
console.error(`Gemini unavailable (${last})`);
process.exit(1);
