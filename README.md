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
