# Safety Quest — First Prototype

A lightweight, responsive HTML/CSS/JavaScript demo for Team Rocky Raccoon's HackGlobal project. This prototype explores a child-friendly K–5 emergency-preparedness learning experience guided by Rocky Raccoon.

## Run it

No build step or package installation is required. Open `index.html` in a modern browser, or serve this folder with a static server (for example, `python -m http.server 8000`) and open `http://localhost:8000`.

## What is included

- Home dashboard with lesson cards, progress, and quest points.
- Browse/search across six short safety lessons.
- Interactive two-step lessons with a knowledge check and encouraging feedback.
- Local browser storage for completed lessons and points.
- Rocky helper chat with topic-based prepared answers (not a live AI integration).
- Responsive layout for desktop and mobile screens.

## Prototype limitations

- Accounts and sign-in are not implemented; the learner is a demo profile.
- Rocky's chat uses prepared topic-matched answers and does not call an AI model/API.
- Progress is stored only in the current browser via `localStorage`.
- This is an educational prototype, not authoritative emergency instruction. Before a public release, review all content against trusted emergency-management guidance and local school/family plans, with adult/educator review.

## Suggested next steps

1. Ask a few students/educators to try the home page, one lesson, and Rocky's chat.
2. Review the safety wording with an educator and reliable emergency-management sources.
3. Add an optional backend and a constrained AI assistant grounded in reviewed content.
4. Add real accounts and synced learner progress only after deciding how to protect children's data.


# Safety Quest — Auth + Rocky AI Prototype

This update adds an account flow, guest mode, an account/progress page, and a server-side Rocky AI chat endpoint while keeping the prototype as plain HTML/CSS/JavaScript.

## Included

- Guest mode: the **Earthquake Ready** lesson can be completed without signing up. Guest progress is stored in this browser only.
- Supabase account creation/login/logout: when configured, accounts unlock all six modules and learner progress is saved to Supabase.
- Rocky chat: uses the secure `/api/chat` endpoint when enabled and configured. The browser never receives the OpenAI API key.
- Prepared-answer fallback: when AI is not configured, Rocky answers common safety questions using prepared demo content.
- Six lessons, quizzes, search, points, and responsive layout.

## Run locally

Requires Node.js 20+.

1. Copy this folder to your project branch.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`. Add your OpenAI API key and Supabase values as described below.
4. Copy `config.js.example` to `config.js` and fill in your **Supabase project URL and anon/public key**. Leave `aiEnabled: true` only if you will run the server and configure `OPENAI_API_KEY`.
5. Run:
   ```bash
   npm start
   ```
6. Open `http://localhost:3000`.

Do not open `index.html` directly as a `file://` URL; use the local server so `/api/chat` can work.

## Configure Supabase authentication + saved progress

1. Create a project at https://supabase.com/.
2. In the Supabase project dashboard, find the project URL and anon/public key. Put them in `config.js` (browser config) and `.env` (`SUPABASE_URL` and `SUPABASE_ANON_KEY`).
3. In Supabase Authentication settings, configure the site URL and redirect URLs for your local URL and eventual demo host.
4. Open **SQL Editor** in Supabase and run `supabase-schema.sql`. The table's row-level security policies ensure a learner can only read or update their own progress.
5. Create a test account through the app. Depending on the project's email-confirmation settings, you may need to confirm the email before logging in.

`config.js` and `.env` are git-ignored. The Supabase anon/public key is intended for browser use, but access must be protected by RLS. **Never put a Supabase service-role key or OpenAI API key in `config.js` or client-side HTML.**

## Configure Rocky AI

1. Add `OPENAI_API_KEY` to `.env`. You can use `OPENAI_MODEL` to select a model available to your account.
2. In `config.js`, set `aiEnabled: true` and `chatEndpoint: "/api/chat"`.
3. Run `npm start`. The frontend sends questions and recent conversation turns to the backend; the backend calls OpenAI and returns Rocky's answer.
4. The server includes a basic in-memory rate limit and a narrow topic guard. These are prototype safeguards, not production-grade abuse prevention. Before public deployment, add durable rate limiting, logging controls, content evaluation, and cost limits.

If you don't have an API key yet, set `aiEnabled: false` in `config.js`; the chat UI will use prepared demo answers.

## Notes / limitations

- Guest progress is local to the current browser. It is not synced and is not private from someone with access to that browser.
- Real account functionality requires Supabase configuration; without it, the app intentionally does not store passwords or pretend account creation succeeded.
- The guest is limited to Earthquake Ready; signed-in users can open all six modules.
- Safety content is a prototype, not a substitute for school/family plans or official emergency guidance. Have an educator and trusted emergency-management sources review it before public use.
- Because the intended audience is children, keep personal-data collection minimal and review applicable privacy requirements before collecting real student data.
- This is a prototype implementation. Test account confirmation, reset flows, deployment environment variables, and AI safety before presenting it as production-ready.
