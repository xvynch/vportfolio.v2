// ===========================================================
// actionEngine.js
// Side-effecting actions Luci can trigger: smooth-scroll
// navigation with highlight, clipboard copy, and resolving
// external link targets (the actual "leave site" confirmation
// UI lives in main.js / uiRenderer, this just supplies data).
// ===========================================================

import { contactDetails } from "./knowledgeBase.js";

const SECTION_IDS = {
  about: "about",
  academic: "academic",
  capabilities: "capabilities",
  projects: "projects",
  certificates: "certificates",
  contact: "contact",
  top: "top"
};

export function scrollToSection(key){
  const id = SECTION_IDS[key] || key;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.remove("section-highlight");
  // restart animation
  void el.offsetWidth;
  el.classList.add("section-highlight");
  window.setTimeout(() => el.classList.remove("section-highlight"), 1200);
}

export async function copyEmail(){
  try {
    await navigator.clipboard.writeText(contactDetails.email);
    return true;
  } catch (e) {
    return false;
  }
}

const EXTERNAL_TARGETS = {
  EXTERNAL_GITHUB: { type: "github", label: "GitHub", url: contactDetails.github },
  EXTERNAL_FACEBOOK: { type: "facebook", label: "Facebook", url: contactDetails.facebook },
  EXTERNAL_LINKEDIN: { type: "linkedin", label: "LinkedIn", url: contactDetails.linkedin },
  SEND_EMAIL_CONFIRM: { type: "email", label: "your email app", url: `mailto:${contactDetails.email}` }
};

export function getExternalTarget(intent){
  return EXTERNAL_TARGETS[intent] || null;
}

export function openExternal(url){
  window.open(url, "_blank", "noopener");
}
