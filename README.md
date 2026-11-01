# cordapoint-drafting

A Claude Code plugin that sends drafting work to Gemini and has Claude check the result.

## Setup

Enable the plugin and enter your Gemini API key when asked (option `gemini_api_key`). It is stored in your system's secure credential store, not in a settings file.

## What it adds

- MCP server `gemini` with one tool, `draft`, that sends public text to Gemini and returns the draft and the model used.
- Skill `gemini-drafting`: how to use the tool well, public text only.
