/*
 * Safety Quest — read-first lesson experience
 *
 * Load AFTER app.js, scripted-lessons.js, lessons-v2.js,
 * rocky-why.js, and enhancements.js.
 *
 * Reading sections no longer interrupt the learner with questions.
 * The existing section questions are collected into a quiz at the end.
 */
(() => {
  "use strict";

  if (typeof window.openLesson !== "function" ||
      typeof window.renderLesson !== "function" ||
      typeof lessonData === "undefined") {
    console.warn("lesson-experience: required lesson application was not found.");
    return;
  }

  const originalOpenLesson = window.openLesson;
  let mode = "reading";
  let readingIndex = 0;
  let quizQuestions = [];
  let quizIndex = 0;
  let selectedIndex = null;
  let checked = false;
  let score = 0;
  let correctCounted = false;
  let completedThisRun = false;

  const extraQuestions = {
    earthquake: [{
      question: "What should you do if you feel an aftershock?",
      answers: [
        "Ignore it because the first earthquake is over",
        "Drop, Cover, and Hold On again",
        "Run outside while the ground is moving"
      ],
      correct: 1,
      why: "Aftershocks are smaller shakes that can happen after an earthquake. Protect yourself each time you feel shaking."
    }],
    fire: [{
      question: "What should you do after you get outside during a fire?",
      answers: [
        "Go back inside for a favorite toy",
        "Hide nearby",
        "Stay outside at the meeting place and tell a grown-up"
      ],
      correct: 2,
      why: "Get out, stay out, and get help. Never go back inside a burning building."
    }]
  };

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function lesson() {
    return lessonData[activeLesson] || null;
  }

  function sectionText(body) {
    if (Array.isArray(body)) return body.map(item => `<p>${escapeHTML(item)}</p>`).join("");
    return `<p>${escapeHTML(body || "")}</p>`;
  }

  function makeQuiz(data) {
    const questions = (data.sections || [])
      .filter(section => Array.isArray(section.answers) &&
        Number.isInteger(section.correct) &&
        section.answers.length >= 2)
      .map(section => ({
        question: section.q || `What is important to remember about "${section.title}"?`,
        answers: section.answers.slice(),
        correct: section.correct,
        why: section.why || "Great effort! Remember to follow your trusted adult's safety instructions."
      }));

    (extraQuestions[activeLesson] || []).forEach(question => questions.push(question));
    return questions.slice(0, 5);
  }

  function progressDots(total, current, completed) {
    return Array.from({ length: total }, (_, index) =>
      `<span class="step-dot ${index < completed || (index === current && mode !== "quiz") ? "done" : ""}"></span>`
    ).join("");
  }

  function renderHeader(data, label, count, current) {
    return `
      <div class="lesson-hero">
        <div class="lesson-emoji">${escapeHTML(data.icon || "🦝")}</div>
        <div>
          <span class="eyebrow" style="background:white;color:var(--green);border-color:#dbe6d5">
            ${escapeHTML(label)} · ${current} OF ${count}
          </span>
          <h2>${escapeHTML(data.title)}</h2>
          <p>${escapeHTML(data.intro || "")}</p>
        </div>
      </div>
      <div class="step-indicator">${progressDots(count, current - 1, current - 1)}</div>`;
  }

  function renderReading() {
    const data = lesson();
    if (!data) return;
    const sections = data.sections || [];
    const section = sections[readingIndex];
    if (!section) {
      mode = "summary";
      renderLesson();
      return;
    }

    sectionIndex = readingIndex;
    const content = document.getElementById("lessonContent");
    if (!content) return;

    content.innerHTML = `
      ${renderHeader(data, "LEARN", sections.length, readingIndex + 1)}
      <article class="lesson-panel sq-reading">
        <div class="sq-reading-kicker">📖 PART ${readingIndex + 1} · LEARN</div>
        <h3>${escapeHTML(section.title)}</h3>
        ${sectionText(section.body)}
        ${section.callout ? `<div class="callout">${escapeHTML(section.callout)}</div>` : ""}
        ${section.example ? `<div class="sq-example"><strong>🦝 Rocky's example</strong><p>${escapeHTML(section.example)}</p></div>` : ""}
        <div class="sq-reading-footer">
          <span>Take your time. You can go back and read this again.</span>
        </div>
        <div class="lesson-actions">
          <button class="secondary" type="button" id="sqExit">Exit lesson</button>
          <div class="sq-nav-actions">
            <button class="secondary" type="button" id="sqPrevious" ${readingIndex === 0 ? "disabled" : ""}>← Previous</button>
            <button class="btn" type="button" id="sqContinue">${readingIndex === sections.length - 1 ? "Review what you learned →" : "Next section →"}</button>
          </div>
        </div>
      </article>`;

    document.getElementById("sqExit").addEventListener("click", () => showPage("explore"));
    document.getElementById("sqPrevious").addEventListener("click", () => {
      if (readingIndex > 0) readingIndex--;
      renderLesson();
    });
    document.getElementById("sqContinue").addEventListener("click", () => {
      if (readingIndex < sections.length - 1) {
        readingIndex++;
      } else {
        mode = "summary";
      }
      renderLesson();
    });
  }

  function renderSummary() {
    const data = lesson();
    if (!data) return;
    const content = document.getElementById("lessonContent");
    if (!content) return;
    const recap = (data.sections || []).map(section =>
      `<li><strong>${escapeHTML(section.title)}:</strong> ${escapeHTML(section.callout || section.body || "")}</li>`
    ).join("");
    const grownUps = data.grownUps
      ? `<div class="notice sq-grownups"><strong>For grown-ups:</strong><p>${escapeHTML(data.grownUps)}</p></div>`
      : "";
    const sources = Array.isArray(data.sources) && data.sources.length
      ? `<div class="sq-sources"><strong>Learn more (for grown-ups)</strong><ul>${data.sources.map(source =>
          `<li><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.name)}</a></li>`
        ).join("")}</ul></div>`
      : "";

    content.innerHTML = `
      ${renderHeader(data, "LESSON REVIEW", 1, 1)}
      <section class="lesson-panel sq-summary">
        <div class="sq-reading-kicker">🌱 YOU DID IT! YOU FINISHED THE READING</div>
        <h3>What should you remember?</h3>
        <p>Here are the big ideas from this lesson. Read them once more before your quiz.</p>
        <ul class="sq-recap-list">${recap}</ul>
        ${grownUps}${sources}
        <div class="lesson-actions">
          <button class="secondary" type="button" id="sqBackToRead">← Review lesson</button>
          <button class="btn" type="button" id="sqStartQuiz">Start the 5-question quiz →</button>
        </div>
      </section>`;

    document.getElementById("sqBackToRead").addEventListener("click", () => {
      readingIndex = 0;
      mode = "reading";
      renderLesson();
    });
    document.getElementById("sqStartQuiz").addEventListener("click", () => {
      quizQuestions = makeQuiz(data);
      quizIndex = 0;
      selectedIndex = null;
      checked = false;
      score = 0;
      correctCounted = false;
      mode = "quiz";
      renderLesson();
    });
  }

  function renderQuiz() {
    const data = lesson();
    const question = quizQuestions[quizIndex];
    const content = document.getElementById("lessonContent");
    if (!data || !content || !question) {
      mode = "finish";
      renderLesson();
      return;
    }

    const options = question.answers.map((answer, index) => {
      let state = "";
      if (checked && index === question.correct) state = "correct";
      else if (checked && index === selectedIndex) state = "wrong";
      return `<button type="button" class="quiz-option ${state}" data-answer="${index}" ${checked ? "disabled" : ""}>
        <span class="sq-answer-letter">${String.fromCharCode(65 + index)}.</span> ${escapeHTML(answer)}
      </button>`;
    }).join("");

    const feedback = checked
      ? `<div class="feedback sq-quiz-feedback" role="status" aria-live="polite">
          ${selectedIndex === question.correct ? "✅ Correct! " : "💡 Good try! "}
          ${escapeHTML(question.why)}
        </div>`
      : `<p class="sq-quiz-prompt">Choose the answer you think is safest.</p>`;

    content.innerHTML = `
      ${renderHeader(data, "KNOWLEDGE CHECK", quizQuestions.length, quizIndex + 1)}
      <section class="lesson-panel sq-quiz">
        <div class="sq-reading-kicker">🎓 QUESTION ${quizIndex + 1} OF ${quizQuestions.length}</div>
        <h3>${escapeHTML(question.question)}</h3>
        <div class="quiz-options">${options}</div>
        ${feedback}
        <div class="lesson-actions">
          <button class="secondary" type="button" id="sqQuitQuiz">Exit lesson</button>
          <button class="btn" type="button" id="sqQuizAction" ${!checked && selectedIndex === null ? "disabled" : ""}>
            ${checked ? (quizIndex === quizQuestions.length - 1 ? "See my results →" : "Next question →") : "Check answer"}
          </button>
        </div>
      </section>`;

    content.querySelectorAll("[data-answer]").forEach(button => {
      button.addEventListener("click", () => {
        if (checked) return;
        selectedIndex = Number(button.dataset.answer);
        content.querySelectorAll("[data-answer]").forEach(option => option.classList.remove("selected"));
        button.classList.add("selected");
        document.getElementById("sqQuizAction").disabled = false;
      });
    });

    document.getElementById("sqQuitQuiz").addEventListener("click", () => showPage("explore"));
    document.getElementById("sqQuizAction").addEventListener("click", () => {
      if (!checked) {
        checked = true;
        progress.quizzes = (progress.quizzes || 0) + 1;
        if (selectedIndex === question.correct) {
          score++;
          progress.points = (progress.points || 0) + 5;
          correctCounted = true;
        }
        if (typeof persist === "function") persist();
        renderLesson();
      } else if (quizIndex < quizQuestions.length - 1) {
        quizIndex++;
        selectedIndex = null;
        checked = false;
        correctCounted = false;
        renderLesson();
      } else {
        mode = "finish";
        renderLesson();
      }
    });
  }

  function renderFinish() {
    const data = lesson();
    const content = document.getElementById("lessonContent");
    if (!data || !content) return;
    const total = quizQuestions.length;
    const passedMessage = score === total
      ? "Amazing work! You got every question right."
      : score >= Math.ceil(total * 0.6)
        ? "Great effort! You remembered lots of important safety ideas."
        : "Nice work finishing! You can review the lesson and try the quiz again.";

    if (!completedThisRun) {
      const alreadyCompleted = progress.completed.includes(activeLesson);
      if (!alreadyCompleted) {
        progress.completed.push(activeLesson);
        progress.points = (progress.points || 0) + 20;
      }
      completedThisRun = true;
      if (typeof persist === "function") persist();
      if (typeof updateStats === "function") updateStats();
      if (typeof renderModules === "function") renderModules();
    }

    content.innerHTML = `
      <section class="lesson-panel finish sq-finish">
        <div class="big">🏆</div>
        <div class="sq-reading-kicker">QUEST COMPLETE</div>
        <h2>You did it, Explorer!</h2>
        <p>${escapeHTML(passedMessage)}</p>
        <div class="sq-score">${score} / ${total}</div>
        <p class="sq-score-label">quiz answers correct</p>
        <div class="notice success">⭐ You earned ${20 + score * 5} possible quest points for this lesson run!</div>
        <p>Remember: practice your family or school safety plan with a trusted grown-up.</p>
        <div class="lesson-actions sq-finish-actions">
          <button class="secondary" type="button" id="sqReview">Review lesson</button>
          <button class="btn" type="button" id="sqLessons">Choose another lesson →</button>
        </div>
        <button class="link-btn" type="button" id="sqRetry">Try the quiz again</button>
      </section>`;

    document.getElementById("sqReview").addEventListener("click", () => {
      readingIndex = 0; mode = "reading"; completedThisRun = true; renderLesson();
    });
    document.getElementById("sqLessons").addEventListener("click", () => showPage("explore"));
    document.getElementById("sqRetry").addEventListener("click", () => {
      quizIndex = 0; selectedIndex = null; checked = false; score = 0;
      quizQuestions = makeQuiz(data); mode = "quiz"; renderLesson();
    });
  }

  window.renderLesson = function renderReadFirstLesson() {
    if (mode === "reading") renderReading();
    else if (mode === "summary") renderSummary();
    else if (mode === "quiz") renderQuiz();
    else if (mode === "finish") renderFinish();
  };

  window.openLesson = function openReadFirstLesson(id) {
    mode = "reading";
    readingIndex = 0;
    quizQuestions = [];
    quizIndex = 0;
    selectedIndex = null;
    checked = false;
    score = 0;
    completedThisRun = false;
    originalOpenLesson(id);
    // The original opener may have called the original renderer internally.
    renderLesson();
  };

  // Retain compatibility with any existing controls that call nextSection().
  window.nextSection = function nextReadFirstSection() {
    if (mode === "reading") {
      if (readingIndex < (lesson()?.sections?.length || 1) - 1) readingIndex++;
      else mode = "summary";
      renderLesson();
    }
  };

  console.log("Safety Quest read-first lesson experience loaded.");
})();
