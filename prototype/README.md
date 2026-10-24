# Safety Quest — Auth + Rocky AI Prototype

This prototype includes guest learning, Supabase account creation/login/logout, saved learner progress, and Rocky's chat interface.

## Included

- Guest mode: complete the **Earthquake Ready** lesson without signing up; guest progress stays in this browser.
- Supabase authentication: create an account, log in, and log out.
- Six safety lessons and interactive quizzes. All lessons unlock for signed-in users.
- Rocky chat: calls a server-side `/api/chat` endpoint when AI is configured; prepared safety answers are used if the service is disabled or unavailable.
- Local guest progress and Supabase-backed signed-in progress.

## Run locally

Requires Node.js 20+.

1. Copy this folder into your repository's `prototype/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set your OpenAI/Supabase values.
4. Copy `config.js.example` to `config.js` and set the Supabase project URL and anon/public key. Keep `aiEnabled: true` only when you intend to run the backend; set it to `false` to use prepared demo answers.
5. Start the app:
   ```bash
   npm start
   ```
6. Open `http://localhost:3000`. Do not open `index.html` directly with `file://`; the backend chat endpoint needs the local server.

## Configure Supabase

1. Create a project at https://supabase.com/.
2. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`, and the project URL and anon/public key in `config.js`.
3. In Supabase Authentication settings, configure the site URL and redirect URLs for your local URL and eventual demo host.
4. Run `supabase-schema.sql` in the Supabase SQL Editor.
5. Create a test account. Depending on email-confirmation settings, you may need to confirm the email before logging in.

The `learner_progress` table uses row-level security so authenticated users can read and update only their own progress.

## Configure Rocky AI

1. Add `OPENAI_API_KEY` to `.env`.
2. Set `aiEnabled: true` and `chatEndpoint: "/api/chat"` in `config.js`.
3. Run `npm start`.

The server keeps the OpenAI key out of the browser, applies a basic in-memory rate limit, and limits conversations to reviewed safety topics. These safeguards are prototype-level, not production-ready.

## Important security and privacy notes

- Never put the OpenAI key or a Supabase service-role key in `config.js` or browser code.
- `.env` and `config.js` are ignored by Git.
- Guest progress is stored in local browser storage and is not synced.
- This prototype targets children. Minimize personal data collection and review applicable privacy requirements before collecting real student data.
- Safety content should be reviewed by educators and reliable emergency-management sources before public use.
- Before deployment, test email confirmation, password recovery, auth redirects, rate limiting, and AI safety.
