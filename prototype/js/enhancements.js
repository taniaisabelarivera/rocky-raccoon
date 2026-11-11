/*
 * Safety Quest — accessibility enhancements
 *
 * This file handles presentation-only enhancements.
 * Lesson rendering, quiz answers, scoring, and progress
 * are handled by lesson-experience.js.
 */
(() => {
  "use strict";

  const topActions = document.querySelector(".top-actions");

  if (!topActions || document.getElementById("textSizeToggle")) {
    return;
  }

  const toggle = document.createElement("button");

  toggle.id = "textSizeToggle";
  toggle.className = "secondary";
  toggle.type = "button";
  toggle.textContent = "A+ Text";
  toggle.setAttribute("aria-pressed", "false");
  toggle.setAttribute("aria-label", "Toggle larger text");

  toggle.addEventListener("click", () => {
    const enabled = document.body.classList.toggle("large-text");

    toggle.textContent = enabled ? "A− Text" : "A+ Text";
    toggle.setAttribute("aria-pressed", String(enabled));
  });

  topActions.prepend(toggle);

  const style = document.createElement("style");

  style.textContent = `
    body.large-text {
      font-size: 18px;
    }

    body.large-text .sub,
    body.large-text .lesson-panel p,
    body.large-text .quiz-option,
    body.large-text .chat-msg {
      font-size: 16px;
    }

    body.large-text .lesson-panel h2,
    body.large-text .lesson-panel h3 {
      font-size: 1.2em;
    }

    body.large-text button {
      font-size: 14px;
    }
  `;

  document.head.appendChild(style);

  console.log("Safety Quest accessibility enhancements loaded.");
})();
