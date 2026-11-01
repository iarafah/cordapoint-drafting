// MCP server (stdio) with one tool, `draft`, that sends public text to Gemini and returns the draft.
// The API key arrives in the GEMINI_API_KEY environment variable, set from the plugin's
// sensitive `gemini_api_key` option. No dependencies.

import { createInterface } from "node:readline";

const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.7-flash", "gemini-flash-latest"];
const RETRYABLE = new Set([429, 500, 503]);
const SERVER = { name: "cordapoint-drafting", version: "0.2.0" };

const TOOL = {
  name: "draft",
  description:
    "Draft public text with Gemini (emails, posts, translations, rewrites, summaries). Send placeholders such as [Name] instead of personal data, secrets or confidential business details. Returns the draft and the model that wrote it. Review and fix the draft before using it.",
  inputSchema: {
    type: "object",
    properties: { prompt: { type: "string", description: "What to draft. Public text only." } },
    required: ["prompt"],
  },
  annotations: { title: "Draft with Gemini", readOnlyHint: true, openWorldHint: true },
};

async function draft(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("No Gemini API key. Add it in the plugin's settings (gemini_api_key).");
  const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
  let last = "";
  for (const [i, model] of MODELS.entries()) {
    const tries = i === 0 ? 1 : 2;
    for (let attempt = 0; attempt < tries; attempt++) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body,
          signal: AbortSignal.timeout(90_000),
        });
        if (res.ok) {
          const data = await res.json();
          const text = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
          return `${text}\n\n[model: ${model}]`;
        }
        last = `${model} HTTP ${res.status}`;
        if (!RETRYABLE.has(res.status)) break;
      } catch (err) {
        last = `${model} ${err.name}`;
      }
      await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
    }
  }
  throw new Error(`Gemini unavailable (${last})`);
}

const send = (message) => process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`);

async function handle(msg) {
  const { id, method, params } = msg;
  if (id === undefined) return; // notifications need no reply
  switch (method) {
    case "initialize":
      return send({
        id,
        result: {
          protocolVersion: params?.protocolVersion ?? "2025-06-18",
          capabilities: { tools: {} },
          serverInfo: SERVER,
        },
      });
    case "ping":
      return send({ id, result: {} });
    case "tools/list":
      return send({ id, result: { tools: [TOOL] } });
    case "tools/call": {
      if (params?.name !== TOOL.name) return send({ id, error: { code: -32602, message: `Unknown tool: ${params?.name}` } });
      const prompt = params.arguments?.prompt;
      if (typeof prompt !== "string" || !prompt.trim()) {
        return send({ id, result: { isError: true, content: [{ type: "text", text: "prompt must be a non-empty string." }] } });
      }
      try {
        return send({ id, result: { content: [{ type: "text", text: await draft(prompt) }] } });
      } catch (err) {
        return send({ id, result: { isError: true, content: [{ type: "text", text: err.message }] } });
      }
    }
    default:
      return send({ id, error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return send({ id: null, error: { code: -32700, message: "Parse error" } });
  }
  handle(msg).catch((err) => msg.id !== undefined && send({ id: msg.id, error: { code: -32603, message: err.message } }));
});
