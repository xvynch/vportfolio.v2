// ===========================================================
// main.js
// Wires together knowledgeBase, intentEngine, responseEngine,
// actionEngine, exploreMode, memorySystem, and uiRenderer into
// the live page: nav, scroll-spy, external-link modal, and Luci.
// ===========================================================

import { knowledgeBase } from "./knowledgeBase.js";
import { memorySystem } from "./memorySystem.js";
import { detectIntent, detectButtonIntent } from "./intentEngine.js";
import { buildResponse, clarify, fallback } from "./responseEngine.js";
import { scrollToSection, copyEmail, getExternalTarget, openExternal } from "./actionEngine.js";
import { exploreMode } from "./exploreMode.js";
import { uiRenderer } from "./uiRenderer.js";

/* ---------------------------------------------------------
   1. Site nav: mobile toggle + scroll-spy
--------------------------------------------------------- */
const navToggle = document.getElementById("navToggle");
const primaryNav = document.querySelector(".primary-nav");

navToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const navLinks = Array.from(document.querySelectorAll(".primary-nav a"));
const observedSections = ["about", "academic", "capabilities", "projects", "certificates", "contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => l.classList.toggle("active", l.dataset.nav === id));
    }
  });
}, { rootMargin: "-40% 0px -50% 0px" });

observedSections.forEach(sec => spyObserver.observe(sec));

/* ---------------------------------------------------------
   2. External link protection modal
--------------------------------------------------------- */
const linkModal = document.getElementById("linkModal");
const modalSub = document.getElementById("modalSub");
const modalCancel = document.getElementById("modalCancel");
const modalProceed = document.getElementById("modalProceed");
let pendingExternalUrl = null;

function requestExternalConfirm(label, url){
  pendingExternalUrl = url;
  modalSub.textContent = `You're heading to ${label}. Do you want to continue?`;
  linkModal.hidden = false;
  modalProceed.focus();
}

function closeModal(){
  linkModal.hidden = true;
  pendingExternalUrl = null;
}

modalCancel.addEventListener("click", closeModal);
modalProceed.addEventListener("click", () => {
  if (pendingExternalUrl) openExternal(pendingExternalUrl);
  closeModal();
});
linkModal.addEventListener("click", (e) => { if (e.target === linkModal) closeModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !linkModal.hidden) closeModal();
});

// Intercept clicks on real external links in the page body itself.
document.querySelectorAll(".contact-link[data-external]").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const label = link.querySelector(".contact-link-label").textContent;
    requestExternalConfirm(label, link.getAttribute("href"));
  });
});

/* ---------------------------------------------------------
   3. Luci launcher open/close
--------------------------------------------------------- */
const launcher = document.getElementById("luciLauncher");
const panel = document.getElementById("luciPanel");
const closeBtn = document.getElementById("luciClose");
const form = document.getElementById("luciForm");
const input = document.getElementById("luciInput");

const SUGGESTED_QUESTIONS = [
  "Who is Vynch?",
  "What projects has he built?",
  "Show me his certifications.",
  "Start a portfolio tour."
];

function openPanel(){
  panel.hidden = false;
  launcher.setAttribute("aria-expanded", "true");
  if (!panel.dataset.greeted) {
    greet();
    panel.dataset.greeted = "true";
  }
  input.focus();
}

function closePanel(){
  panel.hidden = true;
  launcher.setAttribute("aria-expanded", "false");
}

launcher.addEventListener("click", () => {
  panel.hidden ? openPanel() : closePanel();
});
closeBtn.addEventListener("click", closePanel);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !panel.hidden) closePanel();
});

document.getElementById("askLuciBtn").addEventListener("click", openPanel);

function greet(){
  uiRenderer.addBotMessage(
    "Hi, I'm Luci — Vynch's portfolio assistant. I can walk you through his work, or you can just ask me something.",
    [],
    null
  );
  showIdleSuggestions();
}

function showIdleSuggestions(){
  uiRenderer.renderSuggestions(SUGGESTED_QUESTIONS, (text) => {
    uiRenderer.clearSuggestions();
    handleUserUtterance(text);
  });
}

/* ---------------------------------------------------------
   4. Core conversation flow
--------------------------------------------------------- */
const TOUR_CONTROL_INTENTS = new Set(["TOUR", "RESUME_TOUR", "TOUR_NEXT", "TOUR_BACK", "TOUR_EXIT"]);
const NON_INTERRUPTING_INTENTS = new Set([...TOUR_CONTROL_INTENTS, "EASTER_EGG"]);
const TYPING_DELAY_MS = 1000;

function withTypingDelay(callback){
  uiRenderer.showTyping();
  window.setTimeout(() => {
    uiRenderer.hideTyping();
    callback();
  }, TYPING_DELAY_MS);
}

function onChipClick(label){
  uiRenderer.addUserMessage(label);
  uiRenderer.clearSuggestions();
  const intent = detectButtonIntent(label);
  routeIntent(intent, label);
}

function handleUserUtterance(text){
  uiRenderer.addUserMessage(text);
  uiRenderer.clearSuggestions();
  const intent = detectIntent(text, memorySystem.getTopic()).intent;
  routeIntent(intent, text);
}

function routeIntent(intent, rawLabel){
  // If the tour is mid-flight and the user does something that isn't a
  // tour control, pause the tour, answer them, then offer to resume.
  if (exploreMode.isActive() && !exploreMode.isPaused() && !NON_INTERRUPTING_INTENTS.has(intent)) {
    exploreMode.pause();
    uiRenderer.hideTourBar();
  }

  withTypingDelay(() => processIntent(intent, rawLabel));
}

function processIntent(intent, rawLabel){
  switch (intent) {

    case "EMAIL_FLOW":
      uiRenderer.addBotMessage(
        "Here's how you'd like to reach Vynch by email:",
        ["Copy Email", "Send Email", "Go Back"],
        onChipClick
      );
      return;

    case "COPY_EMAIL":
      copyEmail().then(ok => {
        uiRenderer.addBotMessage(
          ok ? "Copied — vynchmiranda@gmail.com is on your clipboard." : "Couldn't copy automatically: vynchmiranda@gmail.com",
          ["Send Email", "Go Back"],
          onChipClick
        );
      });
      return;

    case "SEND_EMAIL_CONFIRM": {
      const target = getExternalTarget(intent);
      uiRenderer.addBotMessage("Opening your email app needs a quick confirmation first.", [], null);
      requestExternalConfirm(target.label, target.url);
      return;
    }

    case "EXTERNAL_GITHUB":
    case "EXTERNAL_FACEBOOK":
    case "EXTERNAL_LINKEDIN": {
      const target = getExternalTarget(intent);
      uiRenderer.addBotMessage(`Opening ${target.label} needs a quick confirmation first.`, [], null);
      requestExternalConfirm(target.label, target.url);
      return;
    }

    case "TOUR": {
      const step = exploreMode.start();
      scrollToSection(step.section);
      renderTourStep(step);
      return;
    }

    case "RESUME_TOUR": {
      const step = exploreMode.resume();
      scrollToSection(step.section);
      renderTourStep(step);
      return;
    }

    case "TOUR_NEXT": {
      const step = exploreMode.next();
      if (!step) {
        uiRenderer.hideTourBar();
        uiRenderer.addBotMessage("That's the full tour — feel free to ask me anything else.", [], null);
        showIdleSuggestions();
        return;
      }
      scrollToSection(step.section);
      renderTourStep(step);
      return;
    }

    case "TOUR_BACK": {
      const step = exploreMode.back();
      scrollToSection(step.section);
      renderTourStep(step);
      return;
    }

    case "TOUR_EXIT":
      exploreMode.exit();
      uiRenderer.hideTourBar();
      uiRenderer.addBotMessage("Tour exited. Ask me anything, or jump back in anytime.", [], null);
      showIdleSuggestions();
      return;

    case "EASTER_EGG": {
      const resp = buildResponse(intent);
      uiRenderer.addBotMessage(resp.text, [], null);
      return; // no buttons, no mode change — straight back to normal state
    }

    case "UNKNOWN": {
      const resp = clarify();
      uiRenderer.addBotMessage(resp.text, resp.buttons, onChipClick);
      return;
    }

    default: {
      const resp = buildResponse(intent);
      if (!resp) {
        const fb = fallback();
        uiRenderer.addBotMessage(fb.text, fb.buttons, onChipClick);
        return;
      }
      uiRenderer.addBotMessage(resp.text, resp.buttons || [], onChipClick);
      if (resp.topicKey && knowledgeBase[resp.topicKey] && knowledgeBase[resp.topicKey].section) {
        scrollToSection(knowledgeBase[resp.topicKey].section);
      }
      // If a paused tour exists, offer to resume after answering.
      if (exploreMode.isPaused()) {
        window.setTimeout(() => {
          uiRenderer.addBotMessage("Want to continue where you left off?", ["Resume Tour"], onChipClick);
        }, 250);
      }
    }
  }
}

function renderTourStep(step){
  uiRenderer.showTourBar(step.stepIndex, step.total, step.title);
  const isLast = step.stepIndex === step.total - 1;
  const isFirst = step.stepIndex === 0;
  const buttons = isLast ? ["Exit Tour"] : (isFirst ? ["Next", "Exit Tour"] : ["Next", "Back", "Exit Tour"]);
  uiRenderer.addBotMessage(step.text, buttons, onChipClick);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  handleUserUtterance(text);
});
