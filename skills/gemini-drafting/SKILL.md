---
name: gemini-drafting
description: Draft emails, posts, templates, translations, rewording, summaries and first drafts with Gemini, then check and fix the result. Use when the user asks for any of these drafts.
---

# Gemini drafting

Send the drafting to Gemini, then review it yourself.

1. Write the prompt. Use placeholders such as [Name] and [LINK]; put real values in after the draft comes back.
2. Run it:
   `echo "<prompt>" | node "${CLAUDE_PLUGIN_ROOT}/scripts/gemini-draft.mjs"`
   It needs `GEMINI_API_KEY` in the environment. In a cloud session also set `NODE_USE_ENV_PROXY=1`.
3. Check the draft for accuracy, tone and anything it invented; fix it.
4. Tell the user the draft came from Gemini, and which model. The script prints the model name on stderr.

## Public text only

Never send personal data, secrets, keys, or confidential business information to Gemini. Draft with placeholders and fill them in afterwards.

If Gemini is unavailable (the script exits with an error), say so and offer to write the draft directly.
