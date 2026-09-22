const themeSelect = document.querySelector("#theme-select");
const textSizeSelect = document.querySelector("#text-size-select");
const swatches = document.querySelectorAll("[data-accent]");
const compactToggle = document.querySelector("#compact-toggle");
const motionToggle = document.querySelector("#motion-toggle");
const saveStatus = document.querySelector("#save-status");

const localPreferences = {
  theme: localStorage.getItem("theme") || "system",
  textSize: localStorage.getItem("textSize") || "medium",
  accent: localStorage.getItem("accent") || "teal",
  reduceMotion: localStorage.getItem("reduceMotion") === "true",
};

const sessionPreferences = {
  compact: sessionStorage.getItem("compactLayout") === "true",
};

function applyTheme(theme) {
  const resolvedTheme = theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;

  document.documentElement.dataset.theme = resolvedTheme;
}

function applyAccent(accent) {
  document.documentElement.dataset.accent = accent;
  swatches.forEach((swatch) => {
    swatch.classList.toggle("selected", swatch.dataset.accent === accent);
  });
}

function applyTextSize(textSize) {
  document.documentElement.dataset.textSize = textSize;
}

function showSavedMessage(message) {
  saveStatus.textContent = message;
  window.clearTimeout(showSavedMessage.timeoutId);
  showSavedMessage.timeoutId = window.setTimeout(() => {
    saveStatus.textContent = "";
  }, 1800);
}

themeSelect.value = localPreferences.theme;
textSizeSelect.value = localPreferences.textSize;
motionToggle.checked = localPreferences.reduceMotion;
compactToggle.checked = sessionPreferences.compact;
document.body.classList.toggle("compact", sessionPreferences.compact);
document.documentElement.classList.toggle("reduce-motion", localPreferences.reduceMotion);
applyTheme(localPreferences.theme);
applyAccent(localPreferences.accent);
applyTextSize(localPreferences.textSize);

themeSelect.addEventListener("change", (event) => {
  const theme = event.target.value;
  localStorage.setItem("theme", theme);
  applyTheme(theme);
  showSavedMessage("Theme saved for future visits.");
});

textSizeSelect.addEventListener("change", (event) => {
  const textSize = event.target.value;
  localStorage.setItem("textSize", textSize);
  applyTextSize(textSize);
  showSavedMessage("Text size saved for future visits.");
});

swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    const accent = swatch.dataset.accent;
    localStorage.setItem("accent", accent);
    applyAccent(accent);
    showSavedMessage("Accent color saved for future visits.");
  });
});

compactToggle.addEventListener("change", (event) => {
  const compact = event.target.checked;
  sessionStorage.setItem("compactLayout", String(compact));
  document.body.classList.toggle("compact", compact);
  showSavedMessage("Layout saved for this session.");
});

motionToggle.addEventListener("change", (event) => {
  const reduceMotion = event.target.checked;
  localStorage.setItem("reduceMotion", String(reduceMotion));
  document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  showSavedMessage("Motion preference saved for future visits.");
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (themeSelect.value === "system") {
    applyTheme("system");
  }
});
