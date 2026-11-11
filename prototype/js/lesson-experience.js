/*
 * Safety Quest — read-first lesson experience
 *
 * Load after app.js, scripted-lessons.js, and lessons-v2.js.
 * This is the single active lesson and quiz renderer.
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
  let wrongAttempts = 0;
  let firstAttemptCorrect = true;
  let completedThisRun = false;
  let quizCountedThisRun = false;
  let pointsEarnedThisRun = 0;

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

  // Specific explanations for common incorrect choices.
  const wrongAnswerExplanations = {
    "You are in class and the floor starts to shake. What is your first move?": {
      0: "Running for the door while the ground is shaking can make you fall or put you near falling objects. Drop where you are, cover your head and neck, and hold on.",
      2: "A doorway is not a special safe spot in a modern classroom. You may still be hurt by falling objects. Drop, Cover, and Hold On instead."
    },
    "It is the middle of the night and the shaking wakes you up. What should you do?": {
      1: "Jumping up and running outside during the shaking is dangerous. You could trip in the dark or be hit by things falling from shelves. Stay in bed and cover your head and neck with a pillow.",
      2: "Looking for the light switch means moving around while it is dark and things may be falling. Stay in bed, protect your head and neck with a pillow, and wait for the shaking to stop."
    },
    "You are on the playground when the ground starts to shake. Where is the safest place?": {
      0: "A wall can shed bricks, glass, or other pieces during shaking. Move to an open space away from buildings, trees, and wires, then protect your head and neck.",
      1: "Branches can break and fall during an earthquake. Move to an open space away from trees, buildings, and wires."
    },
    "The big shaking stopped, and then you feel a smaller shake. What do you do?": {
      0: "Smaller aftershocks can happen after the first earthquake. Protect yourself every time you feel shaking: Drop, Cover, and Hold On.",
      1: "Looking at damage while things may still be moving can put you near falling objects. Drop, Cover, and Hold On again, and wait for a trusted adult's instructions."
    },
    "You find a lighter on the floor. What do you do?": {
      0: "Picking up or hiding a lighter means handling something that can start a fire. Leave it where it is, move away, and tell a grown-up.",
      1: "Testing a lighter can start a fire or burn you. Never play with matches or lighters. Move away and tell a grown-up."
    },
    "The smoke alarm is beeping and you see smoke in the hallway. How should you move?": {
      1: "Standing tall puts your face in thicker smoke, which can make it hard to breathe. Get low and go to your practiced exit.",
      2: "Going back into a room instead of leaving can trap you in danger. Follow your fire escape plan and get outside. If your exit is blocked, follow the plan you practiced with a grown-up."
    },
    "A firefighter in a big mask and heavy coat walks toward you. What do you do?": {
      0: "Hiding makes it harder for firefighters to find and help you. Firefighters wear protective gear to keep themselves safe. Go to them when they reach you.",
      2: "A closet is not a safe place to hide during a fire. Helpers need to be able to find you. Go to the firefighter."
    },
    "You got outside safely, but your favorite stuffed animal is still in your room. What now?": {
      0: "Going back inside is dangerous because fire and smoke can spread quickly. Stay outside at your meeting place and tell a grown-up or firefighter.",
      1: "Even a small-looking fire can spread or hide dangerous smoke. Never go back inside after escaping. Stay outside and tell a grown-up or firefighter."
    }
  };

  function makeQuiz(data) {
    const questions = (data.sections || [])
      .filter(section => Array.isArray(section.answers) &&
        Number.isInteger(section.correct) &&
        section.answers.length >= 2)
      .map(section => ({
        question: section.q || `What is important to remember about "${section.title}"?`,
        answers: section.answers.slice(),
        correct: section.correct,
        why: section.why || "Remember to follow your trusted adult's safety instructions.",
        wrongWhy: wrongAnswerExplanations[section.q] || {}
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
      quizCountedThisRun = false;
      pointsEarnedThisRun = 0;
      wrongAttempts = 0;
      firstAttemptCorrect = true;
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
      const disabled = checked ? "disabled" : "";
      return `<button type="button" class="quiz-option ${state}" data-answer="${index}" ${disabled}>
        <span class="sq-answer-letter">${String.fromCharCode(65 + index)}.</span> ${escapeHTML(answer)}
      </button>`;
    }).join("");

    let feedback = `<p class="sq-quiz-prompt">Choose the answer you think is safest.</p>`;
    if (checked && selectedIndex === question.correct) {
      feedback = `<div class="feedback sq-quiz-feedback sq-feedback-correct" role="status" aria-live="polite">
        <strong>🌟 That's right!</strong>
        <p>${escapeHTML(question.why)}</p>
        ${wrongAttempts > 0 ? `<p>You learned from your first try and got it! Keep that safety tip in mind.</p>` : ""}
      </div>`;
    } else if (checked) {
      const specific = question.wrongWhy && question.wrongWhy[selectedIndex];
      const chosen = question.answers[selectedIndex];
      const correct = question.answers[question.correct];
      feedback = `<div class="feedback sq-quiz-feedback sq-feedback-wrong" role="status" aria-live="polite">
        <strong>💡 Let's learn from that choice.</strong>
        <p><strong>You chose:</strong> ${escapeHTML(chosen)}.</p>
        <p>${escapeHTML(specific || `That choice is not the safest action for this situation. The safer choice is “${correct}.” ${question.why}`)}</p>
        <p><strong>Remember:</strong> ${escapeHTML(question.why)}</p>
        <p>${wrongAttempts === 1 ? "Read the explanation, then try the question one more time." : "You've had another try. Read the safety tip carefully before continuing."}</p>
      </div>`;
    }

    const actionLabel = !checked
      ? "Check answer"
      : (selectedIndex !== question.correct && wrongAttempts === 1)
        ? "Try again"
        : (quizIndex === quizQuestions.length - 1 ? "See my results →" : "Next question →");

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
            ${actionLabel}
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
        if (selectedIndex === question.correct) {
          if (firstAttemptCorrect) {
            score++;
            progress.points = (progress.points || 0) + 5;
            pointsEarnedThisRun += 5;
          }
        } else {
          wrongAttempts++;
          firstAttemptCorrect = false;
        }
        renderLesson();
      } else if (selectedIndex !== question.correct && wrongAttempts === 1) {
        // The first incorrect attempt triggers a teaching explanation and one retry.
        checked = false;
        selectedIndex = null;
        renderLesson();
      } else if (quizIndex < quizQuestions.length - 1) {
        quizIndex++;
        selectedIndex = null;
        checked = false;
        wrongAttempts = 0;
        firstAttemptCorrect = true;
        renderLesson();
      } else {
        mode = "finish";
        if (typeof persist === "function") persist();
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

    if (!quizCountedThisRun) {
      progress.quizzes = (progress.quizzes || 0) + 1;
      quizCountedThisRun = true;
    }

    if (!completedThisRun) {
      const alreadyCompleted = progress.completed.includes(activeLesson);
    
      if (!alreadyCompleted) {
        progress.completed.push(activeLesson);
        progress.points = (progress.points || 0) + 20;
        pointsEarnedThisRun += 20;
      }
    
      completedThisRun = true;
    }
    
    if (typeof persist === "function") persist();
    if (typeof updateStats === "function") updateStats();
    if (typeof renderModules === "function") renderModules();

    content.innerHTML = `
      <section class="lesson-panel finish sq-finish">
        <div class="big">🏆</div>
        <div class="sq-reading-kicker">QUEST COMPLETE</div>
        <h2>You did it, Explorer!</h2>
        <p>${escapeHTML(passedMessage)}</p>
        <div class="sq-score">${score} / ${total}</div>
        <p class="sq-score-label">quiz answers correct</p>
        <div class="notice success"> ⭐ You earned ${pointsEarnedThisRun} quest points this time!</div>
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
      wrongAttempts = 0; firstAttemptCorrect = true; quizCountedThisRun = false; pointsEarnedThisRun = 0;
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
