import { Effects } from "./game";

export type Choice = {
  id: string;
  text: string;
  effects: Effects;
  nextScene?: string;
};

export type Scene = {
  id: string;
  prompt: string;
  choices: Choice[];
  background?: string;
};

// Mini-scene helper
export const createMiniScene = (
  day: number,
  id: string,
  locationName: string,
  background: string,
  nextScene: string
): Scene => ({
  id: `${id}_day${day}`,
  prompt: `You are at the ${locationName}. What do you do?`,
  choices: [
    { id: `leave_${id}_day${day}`, text: `Leave ${locationName}`, effects: {}, nextScene }
  ],
  background
});

// Day-specific transportation scene
export const TRANSPORTATION_SCENE = (day: number): Scene => ({
  id: `transportation_day${day}`,
  prompt: "It’s cold outside and you live a 25-minute walk away. How do you get there?",
  choices: [
    { id: `cta_day${day}`, text: "Take the CTA and save money", effects: { money: -3, health: -5, spread: +4 }, nextScene: `bedroom_day${day}` },
    { id: `uber_day${day}`, text: "Take an Uber and save time", effects: { money: -20, spread: +1 }, nextScene: `bedroom_day${day}` },
    { id: `walk_day${day}`, text: "Walk", effects: { health: -10 }, nextScene: `bedroom_day${day}` }
  ],
  background: "busstop"
});

// === CHOICES BY DAY ===
export const CHOICES_BY_DAY: Record<number, Scene[]> = {
  1: [
    {
      id: "opening_day1",
      prompt: "Welcome to Patient Zero. Press Start to begin your story.",
      choices: [
        { id: "start_day1", text: "Start your day", effects: {}, nextScene: "bedroom_day1" }
      ],
      background: "opening"
    },
    {
      id: "bedroom_day1",
      prompt: "You wake up with what may be a sore throat… or maybe you just yelled too much gaming last night. You have a midterm coming up. Do you go to class?",
      choices: [
        { id: "go_class_day1", text: "Go to class", effects: { health: -10, spread: +6 }, nextScene: "classroom_day1" },
        { id: "stay_home_day1", text: "Stay home", effects: { spread: 0 }, nextScene: "transportation_day1" }
      ],
      background: "bedroom"
    },
    createMiniScene(1, "classroom", "classroom", "classroom", "transportation_day1"),
    TRANSPORTATION_SCENE(1),
    {
      id: "groceries_day1",
      prompt: "You’re out of groceries. Leaving the apartment sounds exhausting.",
      choices: [
        { id: "grocery_store_day1", text: "Go grocery shopping", effects: { money: -40, health: -10, spread: +3 }, nextScene: "grocery_day1" },
        { id: "instacart_day1", text: "Instacart groceries", effects: { money: -60, health: +10, spread: 0 }, nextScene: "transportation_day1" }
      ],
      background: "bedroom"
    },
    createMiniScene(1, "grocery", "grocery store", "grocery", "transportation_day1"),
    TRANSPORTATION_SCENE(1),
    {
      id: "birthday_invite_day1",
      prompt: "Your friend texts: “Please come to dinner tonight. Everyone is coming.” It’s their birthday.",
      choices: [
        { id: "go_party_day1", text: "Go to the birthday dinner", effects: { health: -10, money: -30, spread: +5 }, nextScene: "birthday_day1" },
        { id: "stay_home_party_day1", text: "Stay home", effects: { health: +10, spread: 0 }, nextScene: "transportation_day1" },
        { id: "mask_party_day1", text: "Go, but wear a mask", effects: { health: -10, money: -30, spread: 0 }, nextScene: "birthday_day1" }
      ],
      background: "bedroom"
    },
    createMiniScene(1, "birthday", "birthday party", "birthday", "transportation_day1"),
    TRANSPORTATION_SCENE(1)
  ],

  2: [
    {
      id: "sick_meds_day2",
      prompt: "You wake up with a stronger sore throat and a persistent headache. The only medicine you have is a bag of old cough drops. What do you do?",
      choices: [
        { id: "store_meds_day2", text: "Go to the store and get good cough medicine", effects: { health: +10, money: -20, spread: +1 }, nextScene: "pharmacy_day2" },
        { id: "cough_drops_day2", text: "Guzzle some cough drops and gargle salt water", effects: { health: -10, spread: 0 }, nextScene: "transportation_day2" }
      ],
      background: "bedroom"
    },
    createMiniScene(2, "pharmacy", "pharmacy", "pharmacy", "transportation_day2"),
    TRANSPORTATION_SCENE(2),
    {
      id: "work_day2",
      prompt: "You feel really sick, but you remember why you’ve been pushing through. You need money. What do you do?",
      choices: [
        { id: "work_full_day2", text: "Go to work anyway", effects: { money: +70, health: -10, spread: +10 }, nextScene: "work_day2" },
        { id: "call_sick_day2", text: "Call out sick", effects: { money: 0, health: +10, spread: 0 }, nextScene: "transportation_day2" },
        { id: "work_short_day2", text: "Ask to do a shorter shift", effects: { money: +35, health: -10, spread: +5 }, nextScene: "work_day2" }
      ],
      background: "bedroom"
    },
    createMiniScene(2, "work", "work", "work", "transportation_day2"),
    TRANSPORTATION_SCENE(2),
    {
      id: "study_day2",
      prompt: "That night, your group chat is blowing up about a study session. Your exam is coming up fast. What do you do?",
      choices: [
        { id: "study_group_day2", text: "Go to the study session", effects: { health: -10, spread: +3 }, nextScene: "classroom_day2" },
        { id: "study_alone_day2", text: "Stay home and study alone", effects: { health: -10, spread: 0 }, nextScene: "transportation_day2" },
        { id: "skip_study_day2", text: "Skip studying to get sleep", effects: { health: +10, spread: 0 }, nextScene: "transportation_day2" }
      ],
      background: "bedroom"
    },
    createMiniScene(2, "classroom", "classroom", "classroom", "transportation_day2"),
    TRANSPORTATION_SCENE(2)
  ],

  3: [
    {
      id: "fever_day3",
      prompt: "You wake up and you definitely have a fever. Your throat hurts when you swallow and your whole body feels heavy.",
      choices: [
        { id: "nyquil_day3", text: "Take more cough medicine (NyQuil, the good stuff). Drop by the pharmacy again.", effects: { health: +10, money: -20, spread: +1 }, nextScene: "pharmacy_day3" },
        { id: "drink_water_day3", text: "Drink water and try to sleep it off", effects: { health: -10, spread: 0 }, nextScene: "transportation_day3" }
      ],
      background: "bedroom"
    },
    createMiniScene(3, "pharmacy", "pharmacy", "pharmacy", "transportation_day3"),
    TRANSPORTATION_SCENE(3),
    {
      id: "exam_day3",
      prompt: "Your exam is at 11 am. Go take it or postpone?",
      choices: [
        { id: "take_exam_day3", text: "Go take the exam", effects: { health: -10, spread: +2 }, nextScene: "classroom_day3" },
        { id: "postpone_exam_day3", text: "Email your professor and postpone", effects: { health: +10, spread: 0 }, nextScene: "transportation_day3" }
      ],
      background: "bedroom"
    },
    createMiniScene(3, "classroom", "classroom", "classroom", "transportation_day3"),
    TRANSPORTATION_SCENE(3),
    {
      id: "doctor_day3",
      prompt: "You are at a breaking point. You have been vomiting and feel weak and dizzy. What do you do?",
      choices: [
        { id: "doctor_visit_day3", text: "Go to the doctor and prepare for the dent in your bank account", effects: { health: +20, money: -120, spread: 0 }, nextScene: "hospital_day3" },
        { id: "stay_home_day3", text: "Keep on chugging at home", effects: { health: -80, money: 0, spread: 0 }, nextScene: "transportation_day3" }
      ],
      background: "hospital"
    },
    createMiniScene(3, "hospital", "hospital", "hospital", "transportation_day3"),
    TRANSPORTATION_SCENE(3)
  ]
};
