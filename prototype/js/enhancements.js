
/*
 * Safety Quest Prototype Enhancements
 *
 * Features:
 * - Larger-text accessibility toggle
 * - First incorrect answer: hint and retry options
 * - Second incorrect answer: reveal correct answer and explanation
 * - Manual answer reveal
 * - Lesson completion recap
 *
 * Load this script AFTER app.js and scripted-lessons.js.
 * If rocky-why.js also wraps renderLesson, load this script
 * AFTER rocky-why.js so the wrappers can work together.
 *
 * No Supabase schema changes are required.
 */

(() => {
  "use strict";

  // --------------------------------------------------
  // 1. Accessibility: Larger Text Toggle
  // --------------------------------------------------

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

  // --------------------------------------------------
  // 2. Enhancement Styles
  // --------------------------------------------------

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

    .sq-hint {
      margin: 10px 0;
      padding: 12px 14px;
      border-radius: 11px;
      background: #eef4e9;
      color: #315b42;
      font-size: 14px;
      line-height: 1.5;
    }

    .sq-hint-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin: 8px 0 14px;
    }

    .sq-hint-actions button:disabled {
      opacity: 0.7;
      cursor: default;
    }

    .sq-recap {
      text-align: left;
      max-width: 520px;
      margin: 18px auto;
      line-height: 1.5;
    }

    .sq-recap li {
      margin: 8px 0;
    }

    .sq-recap h3 {
      margin-bottom: 10px;
    }
  `;

  document.head.appendChild(style);

  // --------------------------------------------------
  // 3. Verify Main Application Functions
  // --------------------------------------------------

  if (
    typeof window.renderLesson !== "function" ||
    typeof window.chooseAnswer !== "function" ||
    typeof window.nextSection !== "function"
  ) {
    console.warn(
      "Safety Quest enhancements: Application functions were not found. " +
      "Make sure enhancements.js loads after the main application scripts."
    );

    return;
  }

  // Preserve the original application functions.
  const originalRenderLesson = window.renderLesson;
  const originalChooseAnswer = window.chooseAnswer;
  const originalNextSection = window.nextSection;

  // Track incorrect attempts for the current question.
  let wrongTry = false;
  let hintVisible = false;

  // --------------------------------------------------
  // 4. Utility Functions
  // --------------------------------------------------

  function escapeText(value) {
    const element = document.createElement("span");
    element.textContent = String(value ?? "");
    return element.innerHTML;
  }

  function activeSection() {
    try {
      return lessonData[activeLesson]?.sections?.[sectionIndex] || null;
    } catch (error) {
      return null;
    }
  }

  function resetQuestionState() {
    wrongTry = false;
    hintVisible = false;
  }

  // --------------------------------------------------
  // 5. Generate Contextual Hints
  // --------------------------------------------------

  function hintFor(section) {
    const answer = section.answers[section.correct] || "";

    if (/drop, cover/i.test(answer)) {
      return "Think of the three-part move you practiced for an earthquake.";
    }

    if (/teacher|grown-up|grown up|adult|caregiver|trusted/i.test(answer)) {
      return "Choose the option that keeps you with a trusted adult instead of acting alone.";
    }

    if (/outside|stay outside|escape/i.test(answer)) {
      return "Think about moving away from danger and never going back inside.";
    }

    if (/flashlight/i.test(answer)) {
      return "Pick an item that helps people see when it is dark.";
    }

    if (/private|address|share it/i.test(answer)) {
      return "Keep personal information private and check with a trusted grown-up.";
    }

    return "Look for the choice that follows the safety plan and avoids extra danger.";
  }

  // --------------------------------------------------
  // 6. Add Hint and Retry Controls
  // --------------------------------------------------

  function addHintControls() {
    const section = activeSection();
    const content = document.getElementById("lessonContent");

    if (
      !section ||
      !content ||
      typeof answered === "undefined" ||
      answered !== false ||
      !wrongTry
    ) {
      return;
    }

    const feedback = content.querySelector(".feedback");

    if (!feedback || content.querySelector(".sq-hint")) {
      return;
    }

    // Hint message.
    const hint = document.createElement("div");

    hint.className = "sq-hint";
    hint.setAttribute("role", "status");
    hint.setAttribute("aria-live", "polite");

    hint.textContent = hintVisible
      ? "🦝 Hint: " + hintFor(section)
      : "Not quite, Explorer! You can try again, get a hint, or reveal the answer.";

    // Hint and reveal buttons.
    const actions = document.createElement("div");

    actions.className = "sq-hint-actions";

    const hintButton = document.createElement("button");

    hintButton.className = "secondary";
    hintButton.type = "button";
    hintButton.textContent = hintVisible ? "Hint shown ✓" : "Get a hint";

    hintButton.disabled = hintVisible;

    hintButton.addEventListener("click", () => {
      hintVisible = true;

      hint.textContent = "🦝 Hint: " + hintFor(section);

      hintButton.textContent = "Hint shown ✓";
      hintButton.disabled = true;
    });

    const revealButton = document.createElement("button");

    revealButton.className = "secondary";
    revealButton.type = "button";
    revealButton.textContent = "Show answer";

    revealButton.addEventListener("click", () => {
      const previousAnswer = selectedAnswer;

      resetQuestionState();

      // Use the original handler to preserve existing scoring and feedback.
      originalChooseAnswer(previousAnswer);
    });

    actions.append(hintButton, revealButton);

    feedback.before(hint, actions);
  }

  // --------------------------------------------------
  // 7. Enhanced Lesson Rendering and Completion Recap
  // --------------------------------------------------

  window.renderLesson = function enhancedRenderLesson() {
    originalRenderLesson();

    try {
      if (
        typeof sectionIndex === "undefined" ||
        typeof activeLesson === "undefined" ||
        !lessonData[activeLesson]
      ) {
        return;
      }

      const lesson = lessonData[activeLesson];

      // Check whether the lesson has reached its completion screen.
      if (sectionIndex >= lesson.sections.length) {
        const content = document.getElementById("lessonContent");
        const finish = content?.querySelector(".finish");

        if (!finish || finish.querySelector(".sq-recap")) {
          return;
        }

        const recap = document.createElement("div");

        recap.className = "sq-recap";

        const recapItems = lesson.sections.map(section => {
          const text = String(
            section.callout || section.body || ""
          )
            .replace(/^.{1,3}/, "")
            .trim();

          return "<li>" + escapeText(text) + "</li>";
        }).join("");

        const grownUpReminder = escapeText(
          lesson.grownUps ||
          "Review this lesson with a trusted adult and follow your family or school safety plans."
        );

        recap.innerHTML =
          "<h3>🌱 Remember these key ideas</h3>" +
          "<ul>" + recapItems + "</ul>" +
          "<p><strong>Think about it:</strong> " +
          "Who is one trusted grown-up you could ask to practice this plan with?</p>" +
          "<p class='chat-tip'>" + grownUpReminder + "</p>" +
          "<div class='notice success'>" +
          "🏅 Safety Explorer · Quest recap complete" +
          "</div>";

        const firstButton = finish.querySelector("button");

        finish.insertBefore(recap, firstButton || null);

        return;
      }

      // Add hint controls when an incorrect answer has been selected.
      addHintControls();

    } catch (error) {
      console.warn(
        "Safety Quest enhancements: Could not render lesson recap.",
        error
      );
    }
  };

  // --------------------------------------------------
  // 8. Enhanced Answer Selection
  // --------------------------------------------------

  window.chooseAnswer = function enhancedChooseAnswer(index) {
    // Prevent additional selections after a question is answered.
    if (typeof answered !== "undefined" && answered) {
      return;
    }

    const section = activeSection();

    if (!section) {
      return originalChooseAnswer(index);
    }

    // Ignore invalid answer indexes.
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= section.answers.length
    ) {
      return;
    }

    // Correct answer: use the original application handler.
    if (index === section.correct) {
      resetQuestionState();

      return originalChooseAnswer(index);
    }

    // First incorrect attempt: allow another try.
    if (!wrongTry) {
      wrongTry = true;
      hintVisible = false;

      try {
        selectedAnswer = index;

        // Render without marking the question as answered.
        originalRenderLesson();

        addHintControls();

      } catch (error) {
        console.warn(
          "Safety Quest enhancements: Could not display hint controls.",
          error
        );
      }

      return;
    }

    // Second incorrect attempt: reveal the answer and explanation.
    resetQuestionState();

    return originalChooseAnswer(index);
  };

  // --------------------------------------------------
  // 9. Enhanced Next Section
  // --------------------------------------------------

  window.nextSection = function enhancedNextSection() {
    resetQuestionState();

    return originalNextSection();
  };

  // --------------------------------------------------
  // 10. Reset Hint State When Leaving a Lesson
  // --------------------------------------------------

  document.addEventListener("click", event => {
    const target = event.target.closest("button");

    if (!target) {
      return;
    }

    const buttonText = target.textContent.trim();

    if (
      buttonText.includes("Back to lessons") ||
      buttonText.includes("Choose another quest") ||
      buttonText === "Home" ||
      buttonText.includes("Exit lesson")
    ) {
      resetQuestionState();
    }
  });

  console.log("Safety Quest enhancements loaded successfully.");

})();
