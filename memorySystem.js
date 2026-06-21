// ===========================================================
// memorySystem.js
// Lightweight, in-memory (no backend, no localStorage) session
// context: tracks the last topic so Luci can resolve "it" / "that".
// ===========================================================

const state = {
  lastTopic: null,        // last knowledgeBase key discussed, e.g. "projects"
  lastIntent: null,       // last detected intent
  tourActive: false,
  tourStep: 0,
  tourPaused: false
};

export const memorySystem = {
  setTopic(topicKey){
    state.lastTopic = topicKey;
  },
  getTopic(){
    return state.lastTopic;
  },
  setIntent(intent){
    state.lastIntent = intent;
  },
  getIntent(){
    return state.lastIntent;
  },

  // --- tour state ---
  startTour(){
    state.tourActive = true;
    state.tourPaused = false;
    state.tourStep = 0;
  },
  pauseTour(){
    state.tourPaused = true;
  },
  resumeTour(){
    state.tourPaused = false;
  },
  exitTour(){
    state.tourActive = false;
    state.tourPaused = false;
    state.tourStep = 0;
  },
  isTourActive(){
    return state.tourActive;
  },
  isTourPaused(){
    return state.tourPaused;
  },
  getTourStep(){
    return state.tourStep;
  },
  setTourStep(n){
    state.tourStep = n;
  },
  advanceTourStep(){
    state.tourStep += 1;
    return state.tourStep;
  },
  rewindTourStep(){
    state.tourStep = Math.max(0, state.tourStep - 1);
    return state.tourStep;
  }
};
