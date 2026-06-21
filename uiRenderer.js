// ===========================================================
// uiRenderer.js
// Pure(ish) DOM rendering helpers for the Luci chat log,
// suggestions, typing indicator, and tour progress bar.
// ===========================================================

const log = () => document.getElementById("luciLog");
const suggestionsBox = () => document.getElementById("luciSuggestions");
const tourBar = () => document.getElementById("tourBar");
const tourBarLabel = () => document.getElementById("tourBarLabel");
const tourProgressFill = () => document.getElementById("tourProgressFill");

export const uiRenderer = {

  addUserMessage(text){
    const el = document.createElement("div");
    el.className = "luci-msg luci-msg-user";
    el.textContent = text;
    log().appendChild(el);
    this.scrollToBottom();
  },

  addBotMessage(text, buttons = [], onButtonClick){
    const el = document.createElement("div");
    el.className = "luci-msg luci-msg-bot";
    el.textContent = text;
    log().appendChild(el);

    if (buttons && buttons.length) {
      const row = document.createElement("div");
      row.className = "luci-msg-buttons";
      buttons.forEach(label => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "luci-chip";
        btn.textContent = label;
        btn.addEventListener("click", () => onButtonClick && onButtonClick(label));
        row.appendChild(btn);
      });
      log().appendChild(row);
    }
    this.scrollToBottom();
  },

  showTyping(){
    this.hideTyping();
    const el = document.createElement("div");
    el.className = "luci-typing";
    el.id = "luciTypingIndicator";
    el.innerHTML = `Luci is analyzing portfolio data <span class="typing-dots"><span></span><span></span><span></span></span>`;
    log().appendChild(el);
    this.scrollToBottom();
  },

  hideTyping(){
    const el = document.getElementById("luciTypingIndicator");
    if (el) el.remove();
  },

  scrollToBottom(){
    const l = log();
    l.scrollTop = l.scrollHeight;
  },

  clearLog(){
    log().innerHTML = "";
  },

  renderSuggestions(items, onPick){
    const box = suggestionsBox();
    box.innerHTML = "";
    if (!items || !items.length) return;

    const title = document.createElement("p");
    title.className = "luci-suggestions-title";
    title.textContent = "Try asking:";
    box.appendChild(title);

    items.forEach(text => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "luci-suggestion-btn";
      btn.textContent = `• ${text}`;
      btn.addEventListener("click", () => onPick && onPick(text));
      box.appendChild(btn);
    });
  },

  clearSuggestions(){
    suggestionsBox().innerHTML = "";
  },

  showTourBar(stepIndex, total, title){
    const bar = tourBar();
    bar.hidden = false;
    tourBarLabel().textContent = `Explore Mode • Step ${stepIndex + 1} of ${total} — ${title}`;
    const pct = ((stepIndex + 1) / total) * 100;
    tourProgressFill().style.width = `${pct}%`;
  },

  hideTourBar(){
    tourBar().hidden = true;
  }
};
