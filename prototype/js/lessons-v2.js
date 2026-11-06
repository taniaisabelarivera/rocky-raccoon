/*
 * Safety Quest — improved Earthquake + Fire lessons (v2)
 *
 * What it does:
 *  - Replaces lessonData.earthquake and lessonData.fire with 4-step lessons
 *  - Adds per-lesson `sources` and a `grownUps` note, shown on the finish screen
 *  - Updates the time estimates on the module cards
 *
 * Content is paraphrased from Ready.gov, CDC, ShakeOut/Earthquake Country Alliance,
 * NFPA, and CAL FIRE guidance. It still needs review by an educator and/or a local
 * fire or emergency-management professional before public release.
 */
(() => {
  "use strict";
  if (typeof lessonData === "undefined" || typeof modules === "undefined") {
    console.warn("lessons-v2: load this file after the main app script.");
    return;
  }

  // Correct-answer positions are deliberately varied (not always A or B).
  lessonData.earthquake = {
    title: "Earthquake Ready",
    icon: "🌎",
    intro: "Sometimes the ground shakes. Knowing what to do ahead of time helps you protect yourself.",
    sections: [
      {
        title: "Meet your safety move",
        body: "An earthquake is when the ground shakes. It can start suddenly, so we practice ahead of time. Your safety move has three parts: DROP down onto your hands and knees. COVER your head and neck with your arms, and get under a sturdy desk or table if one is close. HOLD ON to it until the shaking stops.",
        callout: "🛡️ Drop. Cover. Hold On. Do it right away, even if the shaking feels small at first. You can't tell if it will get stronger.",
        q: "You are in class and the floor starts to shake. What is your first move?",
        answers: [
          "Run out the door as fast as you can",
          "Drop to your hands and knees, then Cover and Hold On",
          "Stand in the doorway"
        ],
        correct: 1,
        why: "Yes! Drop, Cover, and Hold On keeps you from being knocked over and helps protect you from falling things. Doorways are not safer than other spots."
      },
      {
        title: "Stay put, stay safe",
        body: "If you are inside, stay inside until the shaking stops. Running is risky because you could fall or get hit by something that falls. Stay away from windows, glass, and tall shelves that could tip over. Never use an elevator during an earthquake.",
        callout: "🛏️ In bed? Stay there! Cover your head and neck with a pillow. In the dark, it is hard to see things that fell, so moving around can lead to more injuries.",
        q: "It is the middle of the night and the shaking wakes you up. What should you do?",
        answers: [
          "Stay in bed and cover your head and neck with a pillow",
          "Jump up and run outside",
          "Run to find the light switch"
        ],
        correct: 0,
        why: "Right! Staying put and protecting your head is safer than moving around in the dark."
      },
      {
        title: "Outside and on the go",
        body: "If you are outside when the shaking starts, move away from buildings, trees, streetlights, and power lines. When you are in an open space, Drop, Cover, and Hold On. If you are in a car, the driver should pull over to a clear spot, away from bridges, trees, and buildings, and stop.",
        callout: "🌳 Outside, the danger is things that can fall, like bricks, glass, branches, and wires. Open space is the best place to be.",
        q: "You are on the playground when the ground starts to shake. Where is the safest place?",
        answers: [
          "Right next to the tall school wall",
          "Under a big tree",
          "In an open space, away from buildings, trees, and wires"
        ],
        correct: 2,
        why: "Great job! Open space keeps you away from things that could fall on you."
      },
      {
        title: "After the shaking stops",
        body: "Stay calm and listen to your teacher or a trusted grown-up. Expect aftershocks. These are smaller shakes that can come minutes, days, or even weeks later. Each time you feel one, Drop, Cover, and Hold On again. Stay out of damaged buildings, and tell a grown-up right away if you are hurt.",
        callout: "💚 You already did the hard part. Practicing with your class and family makes it feel more familiar.",
        q: "The big shaking stopped, and then you feel a smaller shake. What do you do?",
        answers: [
          "Relax. Once it stops, nothing else can happen",
          "Run to look at what got damaged",
          "Drop, Cover, and Hold On again"
        ],
        correct: 2,
        why: "Exactly! Aftershocks can happen, so protect yourself every time you feel one."
      }
    ],
    grownUps: "Practice Drop, Cover, and Hold On at home and at school at least once a year (for example, during the Great ShakeOut drill). Pick sturdy cover in each room, check for heavy objects above beds, and fasten tall furniture to the wall.",
    sources: [
      { name: "Ready.gov: Earthquakes", url: "https://www.ready.gov/earthquakes" },
      { name: "CDC: Safety Guidelines During an Earthquake", url: "https://www.cdc.gov/disasters/earthquakes/during.html" },
      { name: "ShakeOut / Earthquake Country Alliance: Recommended Safety Actions", url: "https://www.shakeout.org/" }
    ]
  };

  lessonData.fire = {
    title: "Fire Safety Basics",
    icon: "🔥",
    intro: "Fire safety means making safe choices, getting out fast, and getting help from grown-ups.",
    sections: [
      {
        title: "Fire is not a toy",
        body: "Matches and lighters are tools for grown-ups, not toys. If you find one, don't touch it. Tell a grown-up. Smoke alarms keep us safe. When one beeps, it means get outside.",
        callout: "🔥 If your clothes ever catch fire: STOP, DROP, and ROLL. Cover your face with your hands and roll until the fire is out. Then get a grown-up.",
        q: "You find a lighter on the floor. What do you do?",
        answers: [
          "Pick it up and hide it yourself",
          "Try it to see how it works",
          "Don't touch it. Tell a grown-up"
        ],
        correct: 2,
        why: "Yes! Matches and lighters are for grown-ups. Telling a grown-up keeps everyone safe."
      },
      {
        title: "Get low and go",
        body: "If the smoke alarm beeps or you see smoke, get out right away the way your family practiced. Smoke rises, so the air near the floor is cleaner. Get low and go under the smoke to your exit, even if you have to crawl. Don't stop for toys, shoes, or pets. Grown-ups and firefighters will help them.",
        callout: "🚪 Practice with a grown-up: touch a closed door with the back of your hand. If it feels hot, don't open it. Use your second way out.",
        q: "The smoke alarm is beeping and you see smoke in the hallway. How should you move?",
        answers: [
          "Get low, under the smoke, and go to your exit",
          "Stand up tall and run through the smoke",
          "Go back to your room and close the door"
        ],
        correct: 0,
        why: "That's right! Staying low keeps you in cleaner air while you go to your exit."
      },
      {
        title: "Never hide",
        body: "When you are scared, you might want to hide. But in a fire, hiding is dangerous because helpers can't find you. Never hide under a bed, in a closet, or in a bathroom. Go to your exit and your meeting place. Firefighters wear big masks, heavy coats, and air tanks, and they can look and sound strange. They are helpers. Go to them.",
        callout: "🚒 A firefighter's job is to help you. If someone is still inside, tell the firefighter.",
        q: "A firefighter in a big mask and heavy coat walks toward you. What do you do?",
        answers: [
          "Hide under a bed so you are out of the way",
          "Go to the firefighter. They are there to help you",
          "Run to a closet and stay quiet"
        ],
        correct: 1,
        why: "Great! Firefighters are trained to help. Going to them is the safest choice."
      },
      {
        title: "Get out, stay out, get help",
        body: "Once you are outside, go to your family's meeting place and stay there. Never go back inside, not for a toy, a pet, or anything else. A grown-up calls 9-1-1 from outside, using a cell phone or a neighbor's phone. Never call from inside a burning home.",
        callout: "📍 Pick a meeting place in front of your home, like a mailbox or a tree, where firefighters can see you.",
        q: "You got outside safely, but your favorite stuffed animal is still in your room. What now?",
        answers: [
          "Run back in. It will only take a second",
          "Go back in only if the fire looks small",
          "Stay at the meeting place and tell a grown-up or firefighter"
        ],
        correct: 2,
        why: "Exactly! Once you are out, stay out. Things can be replaced, and you can't."
      }
    ],
    grownUps: "Make a home fire escape plan with two ways out of every room and an outside meeting place. Practice it at least twice a year, including at night. Make sure children can open their windows and doors, and plan for an adult to wake children, since kids can sleep through alarms. Let children see a firefighter in full gear so they don't hide. Test smoke alarms regularly.",
    sources: [
      { name: "Ready.gov: Home Fire Escape Plan", url: "https://www.ready.gov/home-fire-escape-plan" },
      { name: "Ready.gov: Fire Drill", url: "https://www.ready.gov/firedrill" },
      { name: "NFPA: Learn Not to Burn", url: "https://www.nfpa.org/learnnottoburn" },
      { name: "CAL FIRE: Fire Safety Outreach", url: "https://www.fire.ca.gov/what-we-do/fire-safety-outreach" }
    ]
  };

  // Keep the module cards honest about length.
  const timeById = { earthquake: "5 min", fire: "5 min" };
  modules.forEach(m => { if (timeById[m.id]) m.time = timeById[m.id]; });
  if (typeof renderModules === "function") renderModules();

  // Show "For grown-ups" + sources on the quest-complete screen.
  const prevRender = window.renderLesson;
  window.renderLesson = function renderLessonWithSources() {
    prevRender();
    try {
      const d = lessonData[activeLesson];
      if (!d || sectionIndex < d.sections.length) return;
      const finish = document.querySelector("#lessonContent .finish");
      if (!finish || finish.querySelector(".sq-sources") || !d.sources) return;

      const box = document.createElement("div");
      box.className = "sq-sources notice";
      box.style.textAlign = "left";
      box.style.maxWidth = "520px";
      box.style.margin = "18px auto";

      const h = document.createElement("strong");
      h.textContent = "For grown-ups";
      box.appendChild(h);

      if (d.grownUps) {
        const p = document.createElement("p");
        p.style.margin = "6px 0";
        p.textContent = d.grownUps;
        box.appendChild(p);
      }

      const label = document.createElement("div");
      label.style.fontWeight = "800";
      label.textContent = "Sources:";
      box.appendChild(label);

      const ul = document.createElement("ul");
      ul.style.margin = "4px 0 0";
      ul.style.paddingLeft = "18px";
      d.sources.forEach(s => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = s.url;
        a.textContent = s.name;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        li.appendChild(a);
        ul.appendChild(li);
      });
      box.appendChild(ul);

      const firstButton = finish.querySelector("button");
      finish.insertBefore(box, firstButton || null);
    } catch (e) {
      console.warn("lessons-v2: could not render sources", e);
    }
  };
})();
