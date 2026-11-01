---
name: gemini-drafting
description: Draft emails, posts, templates, translations, rewording, summaries and first drafts with Gemini, then check and fix the result. Use when the user asks for any of these drafts.
---

# Gemini drafting

Send the drafting to Gemini with the `draft` tool from this plugin's `gemini` server, then review it yourself.

1. Write the prompt. Use placeholders such as [Name] and [LINK]; put real values in after the draft comes back.
2. Call the `draft` tool with the prompt. It returns the draft and, on the last line, the model that wrote it.
3. Check the draft for accuracy, tone and anything it invented; fix it.
4. Tell the user the draft came from Gemini, and which model.

## Public text only

Never send personal data, secrets, keys, or confidential business information to Gemini. Draft with placeholders and fill them in afterwards.

If the tool returns an error, say so. If the key is missing, the user adds it in the plugin's settings (`gemini_api_key`). Otherwise offer to write the draft directly.
