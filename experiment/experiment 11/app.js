import { SUBJECTS, addClass, getNextClass, loadClasses, removeClass } from "./scheduler.js";

const form = document.querySelector("#class-form");
const subjectInput = document.querySelector("#subject");
const startAtInput = document.querySelector("#start-at");
const classList = document.querySelector("#class-list");
const emptyState = document.querySelector("#empty-state");
const classCount = document.querySelector("#class-count");
const message = document.querySelector("#message");
const title = document.querySelector("#countdown-title");
const nextClassTime = document.querySelector("#next-class-time");
const countdownParts = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

let classes;
let startTimer = null;
let notifiedClassId = null;

for (const subject of SUBJECTS) {
  const option = document.createElement("option");
  option.value = subject;
  option.textContent = subject;
  subjectInput.append(option);
}

try {
  classes = loadClasses();
  render();
  updateCountdown();
  scheduleStartNotice();
  window.setInterval(updateCountdown, 1000);
} catch (error) {
  showMessage(error.message);
  form.querySelector("button").disabled = true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    classes = addClass(classes, subjectInput.value, startAtInput.value);
    message.textContent = "";
    render();
    updateCountdown();
    scheduleStartNotice();
    startAtInput.value = "";
  } catch (error) {
    showMessage(error.message);
  }
});

classList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-id]");
  if (!removeButton) return;

  try {
    classes = removeClass(classes, removeButton.dataset.removeId);
    render();
    updateCountdown();
    scheduleStartNotice();
  } catch (error) {
    showMessage(error.message);
  }
});

function render() {
  const sortedClasses = [...classes].sort(
    (first, second) => Date.parse(first.startAt) - Date.parse(second.startAt),
  );
  const upcoming = getNextClass(classes);
  classList.replaceChildren();
  emptyState.hidden = sortedClasses.length > 0;
  classCount.textContent = `${sortedClasses.length} ${sortedClasses.length === 1 ? "class" : "classes"}`;

  for (const scheduledClass of sortedClasses) {
    const item = document.createElement("li");
    const isNext = scheduledClass.id === upcoming?.id;
    const isPast = Date.parse(scheduledClass.startAt) <= Date.now();
    item.className = `class-item${isNext ? " is-next" : ""}${isPast ? " is-past" : ""}`;

    const info = document.createElement("div");
    info.className = "class-info";
    const subject = document.createElement("strong");
    subject.textContent = scheduledClass.subject;
    const date = document.createElement("time");
    date.dateTime = scheduledClass.startAt;
    date.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(scheduledClass.startAt));
    info.append(subject, date);
    item.append(info);

    if (isNext) {
      const status = document.createElement("span");
      status.className = "class-status";
      status.textContent = "UP NEXT";
      item.append(status);
    } else if (isPast) {
      const status = document.createElement("span");
      status.className = "class-status";
      status.textContent = "DONE";
      item.append(status);
    }

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.dataset.removeId = scheduledClass.id;
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${scheduledClass.subject}`);
    item.append(removeButton);
    classList.append(item);
  }
}

function updateCountdown() {
  const next = getNextClass(classes);
  if (!next) {
    title.textContent = "No upcoming class";
    nextClassTime.textContent = "Add a class to start your countdown.";
    setCountdown(0);
    render();
    return;
  }

  title.textContent = next.subject;
  nextClassTime.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(next.startAt));

  const remainingSeconds = Math.max(0, Math.floor((Date.parse(next.startAt) - Date.now()) / 1000));
  setCountdown(remainingSeconds);
  render();
}

function setCountdown(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  countdownParts.days.textContent = String(days).padStart(2, "0");
  countdownParts.hours.textContent = String(hours).padStart(2, "0");
  countdownParts.minutes.textContent = String(minutes).padStart(2, "0");
  countdownParts.seconds.textContent = String(seconds).padStart(2, "0");
}

function scheduleStartNotice() {
  window.clearTimeout(startTimer);
  const next = getNextClass(classes);
  if (!next) return;

  const delay = Date.parse(next.startAt) - Date.now();
  startTimer = window.setTimeout(() => {
    if (notifiedClassId !== next.id) {
      notifiedClassId = next.id;
      showMessage(`${next.subject} is starting now.`);
    }
    updateCountdown();
    scheduleStartNotice();
  }, Math.min(delay, 2_147_000_000));
}

function showMessage(text) {
  message.textContent = text;
}
