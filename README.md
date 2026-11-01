# cordapoint-drafting

A Claude Code plugin that sends drafting work to Gemini and has Claude check the result.

## Setup

Enable the plugin and enter your Gemini API key when asked (option `gemini_api_key`). It is stored in your system's secure credential store, not in a settings file.

## What it adds

- MCP server `gemini` with one tool, `draft`, that sends public text to Gemini and returns the draft and the model used.
- Skill `gemini-drafting`: how to use the tool well, public text only.

## Data and privacy

- **What is sent:** only the prompt Claude writes for the `draft` tool. It goes to Google's Gemini API (`generativelanguage.googleapis.com`) and nowhere else. This is the only service the plugin contacts besides Claude.
- **What the plugin keeps:** nothing. It has no server, writes no files and keeps no logs, prompts or drafts. It collects nothing about you.
- **Your API key:** entered in the plugin's settings, stored in your system's secure credential store, and sent only to Google as the key for each request.
- **Public text only:** the skill tells Claude to use placeholders instead of personal data, secrets or confidential business details. The plugin cannot check what a prompt contains, so do not ask Claude to draft with data you would not send to Google.
- **What Google does with it:** governed by Google's terms, not by this plugin. See the [Gemini API terms](https://ai.google.dev/gemini-api/terms) and [Google's privacy policy](https://policies.google.com/privacy).
- **Age:** not intended for users under 18.

Privacy: see [Data and privacy](#data-and-privacy) above.
