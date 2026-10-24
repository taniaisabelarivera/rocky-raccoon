/*
 * Safety Quest prototype enhancements
 * Add this script AFTER the existing inline application script in index.html:
 *   <script src="enhancements.js"></script>
 *
 * This is a lightweight prototype enhancement; it does not change Supabase schemas.
 */
(() => {
  "use strict";

  // Larger-text accessibility toggle
  const topActions = document.querySelector(".top-actions");
  if (topActions && !document.getElementById("textSizeToggle")) {
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
  }

  const style = document.createElement("style");
  style.textContent = `
    body.large-text { font-size: 18px; }
    body.large-text .sub,
    body.large-text .lesson-panel p,
    body.large-text .quiz-option,
    body.large-text .chat-msg { font-size: 16px; }
    body.large-text button { font-size: 14px; }
    .sq-hint { margin: 10px 0; padding: 12px 14px; border-radius: 11px;
      background: #eef4e9; color: #315b42; font-size: 12px; }
    .sq-hint-actions { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0; }
    .sq-recap { text-align: left; max-width: 520px; margin: 18px auto; }
    .sq-recap li { margin: 8px 0; }
  `;
  document.head.appendChild(style);

  // The existing app uses global function declarations and top-level `let` state.
  // Keep references to the original functions so we can enhance, not replace, the app.
  if (typeof window.renderLesson !== "function" ||
      typeof window.chooseAnswer !== "function" ||
      typeof window.nextSection !== "function") {
    console.warn("Safety Quest enhancements: app functions were not found. Load this file after index.html's main script.");
    return;
  }

  const originalRenderLesson = window.renderLesson;
  const originalChooseAnswer = window.chooseAnswer;
  const originalNextSection = window.nextSection;

  let wrongTry = false;
  let hintVisible = false;

  function escapeText(value) {
    const el = document.createElement("span");
    el.textContent = String(value ?? "");
    return el.innerHTML;
  }

  function hintFor(section) {
    const answer = section.answers[section.correct] || "";
    if (/drop, cover/i.test(answer)) return "Think of the three-part move you practiced for an earthquake.";
    if (/teacher|grown-up|grown up|adult|caregiver|trusted/i.test(answer)) return "Choose the option that keeps you with a trusted adult instead of acting alone.";
    if (/outside|stay outside|escape/i.test(answer)) return "Think about moving away from danger and not going back into it.";
    if (/flashlight/i.test(answer)) return "Pick an item that helps people see when it is dark.";
    if (/private|address|share it/i.test(answer)) return "Keep personal information private and check with a trusted grown-up.";
    return "Look for the choice that follows the safety plan and avoids extra danger.";
  }

  function activeSection() {
    try {
      return lessonData[activeLesson]?.sections?.[sectionIndex];
    } catch (_) {
      return null;
    }
  }

  function addHintControls() {
    const section = activeSection();
    const content = document.getElementById("lessonContent");
    if (!section || !content || typeof answered === "undefined" || answered !== false || !wrongTry) return;

    const feedback = content.querySelector(".feedback");
    if (!feedback || content.querySelector(".sq-hint")) return;

    const hint = document.createElement("div");
    hint.className = "sq-hint";
    hint.setAttribute("role", "status");
    hint.textContent = hintVisible
      ? "🦝 Hint: " + hintFor(section)
      : "Not quite, Explorer. Try again, or ask Rocky for a hint before revealing the answer.";

    const actions = document.createElement("div");
    actions.className = "sq-hint-actions";

    const hintButton = document.createElement("button");
    hintButton.className = "secondary";
    hintButton.type = "button";
    hintButton.textContent = hintVisible ? "Hint shown ✓" : "Get a hint";
    hintButton.addEventListener("click", () => {
      hintVisible = true;
      addHintControls();
      const current = document.getElementById("lessonContent")?.querySelector(".sq-hint");
      if (current) current.textContent = "🦝 Hint: " + hintFor(section);
      hintButton.textContent = "Hint shown ✓";
    });

    const revealButton = document.createElement("button");
    revealButton.className = "secondary";
    revealButton.type = "button";
    revealButton.textContent = "Show answer";
    revealButton.addEventListener("click", () => {
      // Use the original handler so the app keeps its existing feedback and scoring flow.
      wrongTry = false;
      hintVisible = false;
      originalChooseAnswer(-1);
    });

    actions.append(hintButton, revealButton);
    feedback.before(hint, actions);
  }

  window.renderLesson = function enhancedRenderLesson() {
    originalRenderLesson();
    // If the lesson has reached its completion screen, add a short recap.
    try {
      if (typeof sectionIndex !== "undefined" &&
          typeof activeLesson !== "undefined" &&
          sectionIndex >= lessonData[activeLesson].sections.length) {
        const content = document.getElementById("lessonContent");
        const finish = content?.querySelector(".finish");
        if (finish && !finish.querySelector(".sq-recap")) {
          const sections = lessonData[activeLesson].sections;
          const recap = document.createElement("div");
          recap.className = "sq-recap";
          recap.innerHTML = "<h3>🌱 Remember these key ideas</h3><ul>" +
            sections.map(s => "<li>" + escapeText(String(s.callout || s.body).replace(/^.{1,3}/, "").trim()) + "</li>").join("") +
            "</ul><p><strong>Think about it:</strong> Who is one trusted grown-up you could ask to practice this plan with?</p>" +
            "<p class='chat-tip'>You can think about your answer or discuss it with a trusted grown-up. You do not need to share personal details here.</p>" +
            "<div class='notice success'>🏅 Safety Explorer · Quest recap complete</div>";
          const firstButton = finish.querySelector("button");
          finish.insertBefore(recap, firstButton || null);
        }
      } else {
        addHintControls();
      }
    } catch (e) {
      console.warn("Could not render Safety Quest recap:", e);
    }
  };

  window.chooseAnswer = function enhancedChooseAnswer(index) {
    if (typeof answered !== "undefined" && answered) return;
    const section = activeSection();
    if (!section) return originalChooseAnswer(index);

    // Correct choice: defer to the existing app's correct-answer handling.
    if (index === section.correct) {
      wrongTry = false;
      hintVisible = false;
      return originalChooseAnswer(index);
    }

    // First incorrect attempt: show hint options, without revealing the answer or
    // counting it as a completed quiz attempt yet.
    if (!wrongTry) {
      wrongTry = true;
      hintVisible = false;
      try {
        selectedAnswer = index;
        originalRenderLesson();
        addHintControls();
      } catch (e) {
        console.warn(e);
      }
      return;
    }

    // Second incorrect attempt: use the existing handler to show the answer/explanation.
    wrongTry = false;
    hintVisible = false;
    originalChooseAnswer(index);
  };

  window.nextSection = function enhancedNextSection() {
    wrongTry = false;
    hintVisible = false;
    return originalNextSection();
  };

  // Re-run the enhancement after navigation back into an in-progress lesson.
  document.addEventListener("click", event => {
    const target = event.target.closest("button");
    if (target && target.textContent.includes("Back to lessons")) {
      wrongTry = false;
      hintVisible = false;
    }
  });
})();
