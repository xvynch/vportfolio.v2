// ===========================================================
// intentEngine.js
// Lightweight, local keyword-based intent detection.
// No external NLP service — fully rule-based.
// ===========================================================

const EASTER_EGG_PHRASE = "tonightsthenight";

// Ordered: more specific patterns first.
const INTENT_PATTERNS = [
  { intent: "EASTER_EGG", keywords: [EASTER_EGG_PHRASE] },
  { intent: "WHO_IS_BOSS", keywords: ["who is boss", "whos boss", "who's boss"] },
  { intent: "WHO_CREATED_YOU", keywords: ["who created you", "who made you", "who built you", "who developed you"] },
  { intent: "TOUR", keywords: ["start tour", "explore portfolio", "show everything", "portfolio tour", "guided tour", "take a tour", "explore mode"] },
  { intent: "FOLLOW_UP", keywords: ["tell me more", "more about it", "more about that", "expand on that", "what about it", "go deeper"] },
  { intent: "CONTACT", keywords: ["contact", "reach him", "reach out", "email him", "get in touch", "how can i contact"] },
  { intent: "CERTIFICATES", keywords: ["certificate", "certification", "ccna", "cisco", "credential"] },
  { intent: "PROJECTS", keywords: ["project", "evergreen", "built", "flagship", "what has he made", "what has he built", "system he made"] },
  { intent: "TOOLS", keywords: ["tool", "software", "app he uses", "what does he use", "figma", "canva", "vs code", "chatgpt", "claude"] },
  { intent: "CAPABILITIES", keywords: ["capabilit", "skill", "good at", "what can he do", "expertise"] },
  { intent: "ACADEMIC", keywords: ["academic", "school", "course", "graduat", "study", "studying", "college", "dnsc", "year level"] },
  { intent: "ABOUT", keywords: ["who is vynch", "about vynch", "who is he", "tell me about him", "introduce"] }
];

function normalize(raw){
  return raw.toLowerCase().trim().replace(/[^\w\s']/g, "");
}

/**
 * Detects intent from free text input.
 * Returns { intent, isFollowUpReference }
 */
export function detectIntent(rawText, lastTopic){
  const text = normalize(rawText);

  // Easter egg short-circuits everything else.
  if (text.includes(EASTER_EGG_PHRASE)) {
    return { intent: "EASTER_EGG" };
  }

  for (const pattern of INTENT_PATTERNS) {
    if (pattern.intent === "EASTER_EGG") continue;
    for (const kw of pattern.keywords) {
      if (text.includes(kw)) {
        return { intent: pattern.intent };
      }
    }
  }

  // Pronoun / reference resolution: "it", "that", "more"
  const referencePattern = /\b(it|that|this)\b/;
  if (referencePattern.test(text) && lastTopic) {
    return { intent: "FOLLOW_UP" };
  }

  return { intent: "UNKNOWN" };
}

export function detectButtonIntent(buttonLabel){
  const map = {
    "view projects": "PROJECTS",
    "projects": "PROJECTS",
    "view certificates": "CERTIFICATES",
    "view certificate": "CERTIFICATES",
    "certificates": "CERTIFICATES",
    "about vynch": "ABOUT",
    "view academic background": "ACADEMIC",
    "capabilities": "CAPABILITIES",
    "contact": "CONTACT",
    "contact vynch": "CONTACT",
    "explore portfolio": "TOUR",
    "start portfolio tour": "TOUR",
    "resume tour": "RESUME_TOUR",
    "email": "EMAIL_FLOW",
    "copy email": "COPY_EMAIL",
    "send email": "SEND_EMAIL_CONFIRM",
    "github": "EXTERNAL_GITHUB",
    "facebook": "EXTERNAL_FACEBOOK",
    "linkedin": "EXTERNAL_LINKEDIN",
    "go back": "CONTACT",
    "next": "TOUR_NEXT",
    "back": "TOUR_BACK",
    "exit tour": "TOUR_EXIT"
  };
  return map[buttonLabel.toLowerCase()] || "UNKNOWN";
}
