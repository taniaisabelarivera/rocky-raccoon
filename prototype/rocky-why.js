/*
 * "Ask Rocky why": explains wrong quiz answers. 
 *
 * Behavior:
 *  - Appears only after a wrong answer has been revealed (not on the first "try again").
 *  - If AI is enabled, calls POST /api/explain with the lesson step and the chosen answer.
 *  - If AI is off or the call fails, shows a prepared explanation built from the lesson
 *    itself, so the demo never dead-ends.
 */
(() => {
  "use strict";

  if (typeof window.renderLesson !== "function" || typeof lessonData === "undefined") {
    console.warn("rocky-why: load this file after the main app script and enhancements.js.");
    return;
  }

  const style = document.createElement("style");
  style.textContent = `
    .rw-box { margin: 12px 0; }
    .rw-reply { display: flex; gap: 10px; align-items: flex-start; margin-top: 10px; }
    .rw-reply .rocky-mini { width: 38px; height: 38px; font-size: 22px; border-radius: 12px; }
    .rw-reply .bubble { white-space: pre-wrap; }
    body.large-text .rw-reply .bubble { font-size: 16px; }
  `;
  document.head.appendChild(style);

  // Cache replies so re-renders don't lose them or re-spend API calls.
  const cache = new Map();
  const keyFor = () => `${activeLesson}:${sectionIndex}:${selectedAnswer}`;

  // Prepared explanation built only from lesson content (offline/AI-failure fallback).
  function preparedExplanation(section) {
    const safest = section.answers[section.correct];
    const point = String(section.callout || "").replace(/^\S+\s*/, "").trim();
    return (
      "Good thinking, Explorer. Let's look at it together. " +
      (point ? point + " " : "") +
      "That is why the safest choice is: " + safest + ". " +
      "Ask a trusted grown-up to practice this with you."
    );
  }

  async function fetchExplanation(section) {
    if (!CONFIG.aiEnabled) return preparedExplanation(section);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const d = lessonData[activeLesson];
      const res = await fetch(CONFIG.explainEndpoint || "/api/explain", {
        method: "POST",
        signal: ctrl.signal,
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: "Bearer " + session.access_token } : {})
        },
        body: JSON.stringify({
          lessonId: activeLesson,
          sectionIndex,
          selectedIndex: selectedAnswer,
          context: {
            lessonTitle: d.title,
            sectionTitle: section.title,
            body: section.body,
            callout: section.callout,
            question: section.q,
            answers: section.answers,
            correctIndex: section.correct
          }
        })
      });
      if (!res.ok) throw new Error("Explain service returned " + res.status);
      const data = await res.json();
      if (!data.reply) throw new Error("Empty reply");
      return data.reply;
    } catch (e) {
      console.warn("rocky-why:", e);
      return preparedExplanation(section);
    } finally {
      clearTimeout(timer);
    }
  }

  function showReply(box, text) {
    box.querySelector(".rw-reply")?.remove();
    const wrap = document.createElement("div");
    wrap.className = "rw-reply";

    const face = document.createElement("div");
    face.className = "rocky-mini";
    face.textContent = "🦝";
    face.setAttribute("aria-hidden", "true");

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text; // textContent: model output is never treated as HTML

    wrap.append(face, bubble);
    box.appendChild(wrap);
  }

  function addWhyControls() {
    const content = document.getElementById("lessonContent");
    const d = lessonData[activeLesson];
    const section = d?.sections?.[sectionIndex];
    if (!content || !section || !answered) return;
    if (selectedAnswer === section.correct) return;                 // only for wrong answers
    if (!Number.isInteger(selectedAnswer) || !section.answers[selectedAnswer]) return;
    if (content.querySelector(".rw-box")) return;

    const feedback = content.querySelector(".feedback");
    if (!feedback) return;

    const box = document.createElement("div");
    box.className = "rw-box";
    box.setAttribute("aria-live", "polite");

    const key = keyFor();
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "secondary";
    btn.textContent = "Ask Rocky why 🦝";
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.textContent = "Rocky is thinking…";
      const text = await fetchExplanation(section);
      cache.set(key, text);
      btn.remove();
      showReply(box, text);
    });

    box.appendChild(btn);
    feedback.after(box);

    if (cache.has(key)) {
      btn.remove();
      showReply(box, cache.get(key));
    }
  }

  const prevRender = window.renderLesson;
  window.renderLesson = function renderLessonWithWhy() {
    prevRender();
    try { addWhyControls(); } catch (e) { console.warn("rocky-why:", e); }
  };
})();
