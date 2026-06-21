// ===========================================================
// responseEngine.js
// Converts an intent into a response payload: { text, buttons,
// topicKey, special }. Pulls facts from knowledgeBase only —
// never invents information.
// ===========================================================

import { knowledgeBase, tourSteps } from "./knowledgeBase.js";
import { memorySystem } from "./memorySystem.js";

const CLARIFY_BUTTONS = ["Projects", "Certificates", "Capabilities", "Contact"];
const FALLBACK_BUTTONS = ["Contact Vynch", "Explore Portfolio"];

function topicResponse(key){
  const entry = knowledgeBase[key];
  memorySystem.setTopic(key);
  return {
    text: entry.text,
    buttons: entry.buttons || [],
    topicKey: key
  };
}

export function buildResponse(intent){
  switch (intent) {

    case "EASTER_EGG":
      return {
        text: "Is that you reu? Boss told me about you that you're his closest negus.",
        buttons: [],
        special: "easter_egg"
      };

    case "WHO_IS_BOSS":
      return {
        text: "Boss is Vynch, the creator of this portfolio and the person who built me to help visitors explore his work, projects, achievements, and academic journey.",
        buttons: ["About Vynch", "Start Portfolio Tour"]
      };

    case "WHO_CREATED_YOU":
      return {
        text: "I was created by Vynch to make exploring his portfolio more interactive, informative, and easier to navigate.",
        buttons: ["About Vynch", "View Projects"]
      };

    case "ABOUT":
      return topicResponse("about");

    case "ACADEMIC":
      return topicResponse("academic");

    case "PROJECTS":
      return topicResponse("projects");

    case "CERTIFICATES":
      return topicResponse("certificates");

    case "CAPABILITIES":
      return topicResponse("capabilities");

    case "TOOLS":
      return topicResponse("tools");

    case "CONTACT":
      return topicResponse("contact");

    case "TOUR":
      return {
        text: knowledgeBase.tour.text,
        buttons: [],
        special: "start_tour"
      };

    case "RESUME_TOUR":
      return { text: "Resuming the tour.", buttons: [], special: "resume_tour" };

    case "FOLLOW_UP": {
      const lastTopic = memorySystem.getTopic();
      if (lastTopic && knowledgeBase[lastTopic] && knowledgeBase[lastTopic].followUp) {
        const followUp = knowledgeBase[lastTopic].followUp;
        return { text: followUp.text, buttons: followUp.buttons || [], topicKey: lastTopic };
      }
      if (lastTopic && knowledgeBase[lastTopic]) {
        // No dedicated follow-up content — restate the topic rather than invent detail.
        return topicResponse(lastTopic);
      }
      return clarify();
    }

    case "UNKNOWN":
      return clarify();

    default:
      return fallback();
  }
}

export function clarify(){
  return {
    text: "Are you asking about:",
    buttons: CLARIFY_BUTTONS,
    special: "clarify"
  };
}

export function fallback(){
  return {
    text: "I don't have that in my portfolio.",
    buttons: FALLBACK_BUTTONS,
    special: "fallback"
  };
}

export function tourStepResponse(stepIndex){
  const step = tourSteps[stepIndex];
  return {
    text: step.text,
    title: step.title,
    section: step.section,
    stepIndex,
    total: tourSteps.length
  };
}
