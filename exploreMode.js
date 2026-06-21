// ===========================================================
// exploreMode.js
// Guided 8-step portfolio walkthrough. Users can interrupt with
// questions at any time; the tour pauses and offers "Resume Tour".
// ===========================================================

import { tourSteps } from "./knowledgeBase.js";
import { memorySystem } from "./memorySystem.js";
import { tourStepResponse } from "./responseEngine.js";

export const exploreMode = {

  start(){
    memorySystem.startTour();
    return this.current();
  },

  current(){
    const step = memorySystem.getTourStep();
    return tourStepResponse(step);
  },

  next(){
    const step = memorySystem.getTourStep();
    if (step >= tourSteps.length - 1) {
      memorySystem.exitTour();
      return null; // tour finished
    }
    const newStep = memorySystem.advanceTourStep();
    return tourStepResponse(newStep);
  },

  back(){
    const newStep = memorySystem.rewindTourStep();
    return tourStepResponse(newStep);
  },

  exit(){
    memorySystem.exitTour();
  },

  pause(){
    memorySystem.pauseTour();
  },

  resume(){
    memorySystem.resumeTour();
    return this.current();
  },

  isActive(){
    return memorySystem.isTourActive();
  },

  isPaused(){
    return memorySystem.isTourPaused();
  },

  isLastStep(){
    return memorySystem.getTourStep() >= tourSteps.length - 1;
  },

  isFirstStep(){
    return memorySystem.getTourStep() <= 0;
  }
};
