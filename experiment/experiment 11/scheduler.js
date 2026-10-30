export const SUBJECTS = ["CC", "DC", "CN", "JS Lab"];

const STORAGE_KEY = "class-scheduler-classes";

export function loadClasses() {
  const savedClasses = localStorage.getItem(STORAGE_KEY);
  if (savedClasses === null) {
    const initialClasses = createDefaultSchedule();
    saveClasses(initialClasses);
    return initialClasses;
  }

  const classes = JSON.parse(savedClasses);
  if (
    !Array.isArray(classes) ||
    classes.some(
      (item) =>
        typeof item.id !== "string" ||
        !SUBJECTS.includes(item.subject) ||
        !Number.isFinite(Date.parse(item.startAt)),
    )
  ) {
    throw new Error("Saved schedule data is invalid. Clear this app's saved data and try again.");
  }
  return classes;
}

export function createDefaultSchedule(now = Date.now()) {
  const starts = [
    { subject: "CC", startAt: new Date(now + 60 * 60 * 1000) },
    { subject: "CN", startAt: new Date(now + 3 * 60 * 60 * 1000) },
    { subject: "CN", startAt: new Date(now + 5 * 60 * 60 * 1000) },
  ];
  const tomorrowAtNine = new Date(now);
  tomorrowAtNine.setDate(tomorrowAtNine.getDate() + 1);
  tomorrowAtNine.setHours(9, 0, 0, 0);
  starts.push({ subject: "JS Lab", startAt: tomorrowAtNine });

  return starts.map(({ subject, startAt }) => ({
    id: crypto.randomUUID(),
    subject,
    startAt: startAt.toISOString(),
  }));
}

export function addClass(classes, subject, startAt) {
  const startTime = Date.parse(startAt);
  if (!SUBJECTS.includes(subject)) {
    throw new Error("Choose a subject from the list.");
  }
  if (!Number.isFinite(startTime) || startTime <= Date.now()) {
    throw new Error("Choose a date and time in the future.");
  }

  const nextClasses = [
    ...classes,
    { id: crypto.randomUUID(), subject, startAt: new Date(startTime).toISOString() },
  ];
  saveClasses(nextClasses);
  return nextClasses;
}

export function removeClass(classes, classId) {
  const nextClasses = classes.filter((item) => item.id !== classId);
  saveClasses(nextClasses);
  return nextClasses;
}

export function getNextClass(classes, now = Date.now()) {
  return classes
    .filter((item) => Date.parse(item.startAt) > now)
    .sort((first, second) => Date.parse(first.startAt) - Date.parse(second.startAt))[0] ?? null;
}

function saveClasses(classes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}
