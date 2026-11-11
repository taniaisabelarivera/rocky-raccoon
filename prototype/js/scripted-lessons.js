
/* Safety Quest — expanded scripted lesson library.
 * Loaded after js/app.
 * Reuses the existing lesson renderer, quiz, account, progress, and chat systems.
 */
(() => {
  "use strict";

  if (typeof lessonData === "undefined" || typeof modules === "undefined") {
    console.warn("scripted-lessons: load after js/app.");
    return;
  }

  const scriptedLessons = {
    earthquake: {
      title: "Earthquake Ready",
      icon: "🌎",
      intro: "Learn what earthquakes are and how to protect yourself before, during, and after the ground shakes.",
      sections: [
        {
          title: "What is an earthquake?",
          body: "An earthquake happens when the ground suddenly shakes or moves. Deep underneath Earth's surface, giant pieces of rock slowly move. Sometimes these pieces push or slide against each other, which can make the ground shake.",
          callout: "🌎 Earthquakes can be small or strong, but knowing what to do can help us stay safe!",
          q: "What is an earthquake?",
          answers: [
            "A storm with strong wind",
            "The ground suddenly shaking or moving",
            "A river overflowing"
          ],
          correct: 1,
          why: "Correct! An earthquake is when the ground suddenly shakes or moves."
        },
        {
          title: "What happens during an earthquake?",
          body: "You might notice the ground shaking beneath your feet, furniture moving or wobbling, books or other objects falling, and windows rattling.",
          callout: "🦝 Don't panic, Safety Rangers! Knowing what to expect can help you remember your safety steps.",
          q: "Which might happen during an earthquake?",
          answers: [
            "Windows rattling",
            "The sun getting brighter",
            "Flowers growing"
          ],
          correct: 0,
          why: "Right! Windows can rattle, and furniture or objects may move or fall."
        },
        {
          title: "Drop, Cover, and Hold On",
          body: "DROP: Get down on your hands and knees. COVER: Protect your head and neck. Get underneath a sturdy desk or table if one is nearby. HOLD ON: Hold onto your shelter until the shaking stops.",
          callout: "🛡️ Drop, Cover, and Hold On! You’ve got this, Safety Rangers!",
          q: "What are the three steps to remember during an earthquake?",
          answers: [
            "Run, Jump, and Hide",
            "Drop, Cover, and Hold On",
            "Stand, Walk, and Wave"
          ],
          correct: 1,
          why: "Exactly! Drop, Cover, and Hold On helps protect your head and body."
        },
        {
          title: "What NOT to do",
          body: "During an earthquake, don't run outside while the ground is shaking, stand near windows or glass, use elevators, or stand in a doorway for protection. Stay where you are and protect your head and neck.",
          callout: "💚 Stay low, stay covered, and stay safe!",
          q: "Which action should you avoid during an earthquake?",
          answers: [
            "Protect your head and neck",
            "Take cover under a sturdy table if nearby",
            "Use an elevator"
          ],
          correct: 2,
          why: "Correct! Don't use elevators during an earthquake. Protect yourself where you are."
        },
        {
          title: "What if you're outside?",
          body: "If an earthquake happens while you're outside, move away from trees, buildings, and power lines if you can safely do so. Find a clear, open area nearby, drop down, and protect your head and neck until the shaking stops.",
          callout: "🌳 If you're already outside, stay outside! Find a safe, open space!",
          q: "Where should you go if you're outside during an earthquake?",
          answers: [
            "Next to a building",
            "A clear, open area away from things that could fall",
            "Under power lines"
          ],
          correct: 1,
          why: "That's right! Choose open space away from buildings, trees, and power lines."
        },
        {
          title: "After the shaking stops",
          body: "Listen to your teacher or a trusted adult. Watch out for broken glass and fallen objects. Be ready for aftershocks—smaller earthquakes that happen afterward. Walk carefully to a safe place when instructed.",
          callout: "🤝 Stay calm, listen carefully, and remember that we're safer when we work together!",
          q: "What should you do after the shaking stops?",
          answers: [
            "Listen to a trusted adult and watch for hazards",
            "Run back for your belongings",
            "Assume there cannot be another shake"
          ],
          correct: 0,
          why: "Great job! Listen to a trusted adult, watch for hazards, and remember aftershocks can happen."
        }
      ],
      grownUps: "Review this lesson with a trusted adult and follow your family, school, and local emergency officials' plans."
    },

    fire: {
      title: "Fire Preparedness",
      icon: "🔥",
      intro: "Learn how alarms work, how to leave safely, and why your safety matters more than belongings.",
      sections: [
        {
          title: "What is a fire emergency?",
          body: "Fire can help us cook food and stay warm, but it can also be dangerous when it spreads somewhere it shouldn't. A fire emergency occurs when a fire becomes unsafe and people need to get away from danger.",
          callout: "🔥 If you see fire or smoke, tell an adult and get to safety right away.",
          q: "What should you do if you see fire or smoke?",
          answers: [
            "Tell a trusted adult and get to safety",
            "Try to put the fire out",
            "Hide and stay quiet"
          ],
          correct: 0,
          why: "Correct! Tell an adult and get away from danger. Fire extinguishers are for trained adults."
        },
        {
          title: "What is a fire alarm?",
          body: "A fire alarm is a warning system that sounds a loud signal to alert everyone to a potential fire. When you hear one, stop what you're doing, listen to your teacher or trusted adult, walk calmly toward the nearest safe exit, and go to your designated meeting spot.",
          callout: "🚨 When the alarm sounds, it's time to move safely! Never ignore a fire alarm!",
          q: "When a fire alarm sounds at school, what should you do?",
          answers: [
            "Ignore it if you don't see smoke",
            "Stop, listen to your teacher, and leave using the safe route",
            "Run to get your backpack"
          ],
          correct: 1,
          why: "Exactly! Listen to your teacher, follow the safe exit route, and go to the meeting spot."
        },
        {
          title: "Fire extinguishers",
          body: "A fire extinguisher is a special safety tool that can put out certain small fires. You might see one hanging on a wall at school or in a building. Fire extinguishers are for trained adults to use when it is safe to do so.",
          callout: "🧯 If you see a fire, don't try to put it out yourself! Get away and tell a trusted adult!",
          q: "Who should use a fire extinguisher?",
          answers: [
            "A child who wants to help",
            "A trained adult, when it is safe",
            "Anyone who sees a fire"
          ],
          correct: 1,
          why: "Right! Fire extinguishers are for trained adults. Your job is to get away and tell an adult."
        },
        {
          title: "What about your backpack?",
          body: "Imagine you're sitting in class when the fire alarm rings. Leave your backpack and school supplies behind. Follow your teacher to the nearest safe exit. Never go back inside for your belongings. Stay with your class at the meeting spot.",
          callout: "🎒 Your safety is more important than your stuff! Leave your backpack behind and get outside!",
          q: "The fire alarm rings while you're in class. What should you leave behind?",
          answers: [
            "Your backpack and school supplies",
            "Your teacher",
            "The meeting spot"
          ],
          correct: 0,
          why: "Correct! Leave belongings behind and stay with your class."
        },
        {
          title: "How do we escape safely?",
          body: "If there is a fire, stay low if there is smoke, use the stairs rather than an elevator, follow a safe exit route, and stay outside once you've escaped. If smoke or fire blocks your way, use another safe exit. If you cannot escape, close the door, stay away from smoke, and call for help.",
          callout: "🚪 Get out, stay out, and let the firefighters handle the fire!",
          q: "What should you do after escaping a building fire?",
          answers: [
            "Go back for your things",
            "Stay outside and wait for help",
            "Use the elevator to return"
          ],
          correct: 1,
          why: "That's right! Stay outside. Never go back into a building during a fire."
        }
      ],
      grownUps: "Review this lesson with a trusted adult and follow your family, school, and local emergency officials' plans."
    },

    flood: {
      title: "Flood Preparedness",
      icon: "🌊",
      intro: "Learn why floodwater is dangerous and how to stay away from it.",
      sections: [
        {
          title: "What is a flood?",
          body: "A flood happens when too much water covers land that is usually dry. Floods can occur when there is heavy rain, rivers overflow, or large amounts of water enter an area. Some floods happen slowly, while others happen very quickly.",
          callout: "💧 Water can be powerful! Let's learn how to stay safe when floods happen!",
          q: "What is a flood?",
          answers: [
            "Water covering land that is usually dry",
            "A very windy day",
            "A power outage"
          ],
          correct: 0,
          why: "Correct! A flood covers land that is usually dry."
        },
        {
          title: "Why can floods be dangerous?",
          body: "Floodwater can move quickly and knock people down, carry away cars and other objects, hide dangerous electrical wires, and contain dirt, germs, and sharp objects.",
          callout: "⚠️ Floodwater might look like a giant puddle, but it can be dangerous! Never play in floodwater!",
          q: "Why should you stay out of floodwater?",
          answers: [
            "It is always clean",
            "It can move quickly and hide dangerous objects",
            "It is safe if it looks shallow"
          ],
          correct: 1,
          why: "Exactly. Floodwater can be powerful and hide hazards you cannot see."
        },
        {
          title: "What should you do during a flood?",
          body: "Listen to your teacher or a trusted adult. Move away from flooded areas. Go to higher ground when instructed. Never walk, swim, or play in floodwater.",
          callout: "🌊 Turn Around, Don't Drown!",
          q: "You see floodwater covering a street. What should you do?",
          answers: [
            "Walk through carefully",
            "Stay away and tell a trusted adult",
            "Play in it with friends"
          ],
          correct: 1,
          why: "Right! Stay away from floodwater and tell a trusted adult."
        },
        {
          title: "What if you're at school?",
          body: "If a flood happens while you're at school, stay with your teacher, listen carefully to emergency instructions, follow your school's safe evacuation plan, and stay away from flooded hallways and outdoor areas.",
          callout: "🏫 Your teachers have safety plans to help protect you. Stay together and follow their directions!",
          q: "What should you do if flooding happens at school?",
          answers: [
            "Leave the class alone",
            "Stay with your teacher and follow the school plan",
            "Walk through a flooded hallway"
          ],
          correct: 1,
          why: "Correct! Stay with your teacher and follow school instructions."
        },
        {
          title: "What happens after a flood?",
          body: "Even after the rain stops, some places may still be unsafe. Stay away from leftover floodwater, watch where you step, wait until a trusted adult says an area is safe, and avoid fallen electrical wires.",
          callout: "💚 Just because the water stops rising doesn't mean it's safe to go back!",
          q: "When is it safe to return to a flooded area?",
          answers: [
            "As soon as rain stops",
            "When a trusted adult or officials say it is safe",
            "When the water looks clear"
          ],
          correct: 1,
          why: "That's right! Wait until a trusted adult or officials say it is safe."
        }
      ],
      grownUps: "Review this lesson with a trusted adult and follow your family, school, and local emergency officials' plans."
    },

    kit: {
      title: "General Safety & Preparedness",
      icon: "🎒",
      intro: "Learn how a plan, emergency supplies, and trusted helpers can help us prepare.",
      sections: [
        {
          title: "What does being prepared mean?",
          body: "Being prepared means getting ready before something unexpected happens. Emergencies can happen at home, at school, or outside. When we have a plan and the right supplies, we can respond more safely.",
          callout: "🌱 A great Safety Ranger doesn't wait for an emergency to get ready!",
          q: "What does being prepared mean?",
          answers: [
            "Getting ready before something unexpected happens",
            "Waiting until an emergency is over",
            "Collecting toys"
          ],
          correct: 0,
          why: "Correct! Preparing ahead of time means making a plan and gathering useful supplies."
        },
        {
          title: "What is an emergency kit?",
          body: "An emergency kit is a collection of important supplies that can help during an emergency. A kit might include drinking water, food that doesn't spoil quickly, a flashlight, first-aid supplies, extra batteries, and a battery-powered or hand-crank radio.",
          callout: "🧰 An emergency kit is like a safety toolbox! Every item has an important job!",
          q: "Which item belongs in an emergency kit?",
          answers: [
            "A flashlight",
            "A game console",
            "A glass decoration"
          ],
          correct: 0,
          why: "Yes! A flashlight can provide light when the power goes out."
        },
        {
          title: "What is first aid?",
          body: "First aid is the first help someone receives when they are hurt or sick. A first aid kit might have bandages, disposable gloves, gauze, and cleaning supplies. If someone gets hurt, tell a trusted adult right away.",
          callout: "🩹 You don't have to be a doctor to help! Getting a trusted adult is an important first step.",
          q: "If someone gets hurt, what should you do first?",
          answers: [
            "Try a medical treatment by yourself",
            "Tell a trusted adult",
            "Ignore it"
          ],
          correct: 1,
          why: "Correct! Tell a trusted adult. You do not have to handle an injury alone."
        },
        {
          title: "What should you do if someone gets hurt?",
          body: "Stay calm and make sure you are in a safe place. Tell a teacher or trusted adult. Call 911 if there is a serious emergency and an adult is not already getting help. Follow the emergency helper's instructions.",
          callout: "🤝 Helping doesn't always mean touching someone's injury. Sometimes the best way to help is to get an adult!",
          q: "What is a safe way to help someone who is hurt?",
          answers: [
            "Make sure you're safe and tell a trusted adult",
            "Move them right away",
            "Give them medicine"
          ],
          correct: 0,
          why: "Exactly! First make sure you're safe, then get a trusted adult or emergency help."
        },
        {
          title: "What is an emergency backpack?",
          body: "An emergency backpack, sometimes called a go-bag, holds supplies you might need if you have to leave home quickly. With a trusted adult, you can help pack water, non-perishable snacks, a flashlight, extra clothes, emergency contact information, and a small comfort item.",
          callout: "🎒 Pack your emergency backpack with an adult and keep it somewhere easy to find!",
          q: "Who should help you prepare an emergency backpack?",
          answers: [
            "A trusted adult",
            "A stranger online",
            "No one"
          ],
          correct: 0,
          why: "Right! Prepare your backpack with a trusted adult."
        }
      ],
      grownUps: "Review this lesson with a trusted adult and follow your family, school, and local emergency officials' plans."
    },

    help: {
      title: "Calling 911 & First Responders",
      icon: "🚑",
      intro: "Learn when 911 is for emergencies, who first responders are, and what information dispatchers may ask.",
      sections: [
        {
          title: "What is 911?",
          body: "911 is a special phone number you can call when someone needs emergency help right away. You can call 911 for a dangerous fire, someone who is seriously hurt, or another dangerous emergency.",
          callout: "☎️ 911 is for real emergencies, not jokes or games!",
          q: "When should someone call 911?",
          answers: [
            "To ask about homework",
            "For a dangerous fire or serious injury",
            "To play a prank"
          ],
          correct: 1,
          why: "Correct! 911 is for urgent emergencies when someone needs help right away."
        },
        {
          title: "Who are first responders?",
          body: "First responders are trained helpers who respond to emergencies. Firefighters help with fires, rescues, and other emergencies. Paramedics and EMTs give medical help to people who are sick or injured. Police officers help protect people and respond to dangerous situations.",
          callout: "🚒 First responders are important members of our community who work hard to help keep us safe!",
          q: "Which first responder gives emergency medical care?",
          answers: [
            "A firefighter",
            "A paramedic or EMT",
            "A librarian"
          ],
          correct: 1,
          why: "Exactly! Paramedics and EMTs provide emergency medical care."
        },
        {
          title: "How do you call 911?",
          body: "If there is a serious emergency, get to a safe place, dial 9-1-1, tell the dispatcher what happened and where you are, listen carefully, answer questions, and stay on the phone until they tell you it's okay to hang up.",
          callout: "🦝 Stay as calm as you can. The person answering the phone is there to help you!",
          q: "What should you do when speaking with a 911 dispatcher?",
          answers: [
            "Hang up right away",
            "Listen and answer their questions truthfully",
            "Make up an answer"
          ],
          correct: 1,
          why: "Right! Tell the truth, answer what you can, and follow the dispatcher's instructions."
        },
        {
          title: "What should you tell the dispatcher?",
          body: "A dispatcher is the person who answers your emergency call and sends help. They might ask where you are, what happened, whether anyone is hurt, and what phone number you're calling from. It's okay if you don't know every answer. Just tell the truth and do your best.",
          callout: "💬 You don't have to know everything! Explain what you see and listen carefully!",
          q: "What if you don't know the answer to a dispatcher's question?",
          answers: [
            "Make something up",
            "Hang up",
            "Tell the truth and do your best"
          ],
          correct: 2,
          why: "That's right! It's okay not to know everything. Tell the truth and listen."
        },
        {
          title: "Rocky's 911 practice",
          body: "Imagine you see someone who has fallen and is not waking up. You are in a safe place and need to call 911. This is only a pretend practice question.",
          callout: "📣 Never call the real 911 number just to practice!",
          q: "What should you tell the dispatcher?",
          answers: [
            "“I don't know! Goodbye!”",
            "“Someone is hurt and won't wake up. I'm at this address.”",
            "“Can you help me with homework?”"
          ],
          correct: 1,
          why: "Good practice! In a real emergency, tell the dispatcher what happened and your location. Never make a real call just to practice."
        }
      ],
      grownUps: "Review this lesson with a trusted adult and follow your family, school, and local emergency officials' plans."
    },

    blackout: {
      title: "Blackout Preparedness",
      icon: "🔦",
      intro: "Learn what a power outage is, what can cause it, and how to stay safe when the lights go out.",
      sections: [
        {
          title: "What is a blackout?",
          body: "A blackout, also called a power outage, happens when electricity stops working in an area. Lights might turn off, televisions might stop working, electronic devices might lose power, and some buildings might become dark.",
          callout: "🔦 The lights might go out, but don't worry! Let's learn how to stay safe!",
          q: "What is a blackout?",
          answers: [
            "When electricity stops working in an area",
            "A very rainy morning",
            "When the internet is slow"
          ],
          correct: 0,
          why: "Correct! A blackout is a power outage."
        },
        {
          title: "Why do blackouts happen?",
          body: "Blackouts can happen for different reasons, including strong storms, trees falling onto power lines, earthquakes, or problems with electrical equipment. Sometimes electricity comes back quickly. Other times, it takes longer.",
          callout: "🌩️ We can't always stop a blackout, but we can prepare for one!",
          q: "Which event can cause a blackout?",
          answers: [
            "A tree falling onto power lines",
            "A sunny afternoon",
            "A birthday party"
          ],
          correct: 0,
          why: "That's right! Storms, fallen trees, earthquakes, and equipment problems can cause outages."
        },
        {
          title: "What should you do during a blackout?",
          body: "If the power goes out, stay calm, find a trusted adult, use a flashlight if you need light, stay away from fallen power lines, and avoid touching electrical equipment.",
          callout: "🔦 Flashlights are our friends during a blackout! Ask an adult for help finding one!",
          q: "The power suddenly goes out. What should you do?",
          answers: [
            "Play with candles",
            "Find a trusted adult and use a flashlight",
            "Touch electrical equipment"
          ],
          correct: 1,
          why: "Correct! Stay calm, find a trusted adult, and use a flashlight."
        },
        {
          title: "What should you NOT do?",
          body: "During a blackout, don't play with candles, matches, or lighters. Don't touch fallen electrical wires, open the refrigerator over and over, or use electrical appliances without adult supervision.",
          callout: "⚡ Stay away from anything that could cause a fire or electric shock!",
          q: "Which is NOT a safe blackout activity?",
          answers: [
            "Use a flashlight with an adult's help",
            "Stay away from fallen wires",
            "Play with candles"
          ],
          correct: 2,
          why: "Exactly! Never play with candles, matches, or lighters."
        },
        {
          title: "How can we prepare?",
          body: "You and your family can prepare by keeping flashlights, extra batteries, drinking water, food that doesn't need cooking, and a battery-powered radio. You can also make a family emergency plan.",
          callout: "🎒 Being prepared means we know what to do, even when the lights go out!",
          q: "What is a useful item to prepare for a blackout?",
          answers: [
            "A flashlight and extra batteries",
            "A candle for children to use",
            "A plugged-in appliance"
          ],
          correct: 0,
          why: "Right! Flashlights and batteries are useful supplies."
        }
      ],
      grownUps: "Review this lesson with a trusted adult and follow your family, school, and local emergency officials' plans."
    }
  };

  // Replace the short demo lessons with the full scripted curriculum.
  Object.assign(lessonData, scriptedLessons);

  const moduleDetails = [
    {
      id: "earthquake",
      title: "Earthquake Ready",
      icon: "🌎",
      tag: "EARTHQUAKE",
      desc: "Learn what earthquakes are and how to stay safe before, during, and after shaking.",
      time: "7 min"
    },
    {
      id: "fire",
      title: "Fire Preparedness",
      icon: "🔥",
      tag: "FIRE SAFETY",
      desc: "Learn about fire alarms, extinguishers, backpacks, and safe exits.",
      time: "7 min"
    },
    {
      id: "flood",
      title: "Flood Preparedness",
      icon: "🌊",
      tag: "FLOOD SAFETY",
      desc: "Understand flood hazards and what to do at home or school.",
      time: "6 min"
    },
    {
      id: "kit",
      title: "General Safety & Preparedness",
      icon: "🎒",
      tag: "BE PREPARED",
      desc: "Explore emergency kits, first aid awareness, and go-bags.",
      time: "7 min"
    },
    {
      id: "help",
      title: "Calling 911 & First Responders",
      icon: "🚑",
      tag: "GETTING HELP",
      desc: "Learn when to call 911 and what first responders do.",
      time: "7 min"
    },
    {
      id: "blackout",
      title: "Blackout Preparedness",
      icon: "🔦",
      tag: "POWER OUTAGES",
      desc: "Learn how to stay safe when the power goes out.",
      time: "6 min"
    }
  ];

  // Preserve existing module information and progress IDs.
  const existing = new Map(modules.map(m => [m.id, m]));

  modules.splice(
    0,
    modules.length,
    ...moduleDetails.map(detail => ({
      ...(existing.get(detail.id) || {}),
      ...detail
    }))
  );

  if (typeof renderModules === "function") {
    renderModules();
  }

})();
