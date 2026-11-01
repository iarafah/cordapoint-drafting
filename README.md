# cordapoint-drafting

A Claude Code plugin that sends drafting work to Gemini and has Claude check the result.

## Setup

Set `GEMINI_API_KEY` in your environment. In a cloud session also set `NODE_USE_ENV_PROXY=1`.

## What it adds

- Skill `gemini-drafting`: drafts emails, posts, translations and summaries through Gemini, public text only.
