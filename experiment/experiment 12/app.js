$(function () {
  "use strict";

  const STORAGE_KEY = "campus-connect-registrations";
  let events = [];
  let toastTimer;

  const $grid = $("#event-grid");
  const $dialog = $("#registration-dialog");

  function readRegistrations() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) {
        throw new Error("Saved registrations are not in the expected format.");
      }
      return parsed.filter((item) =>
        item && typeof item.eventId === "string" &&
        typeof item.name === "string" && typeof item.email === "string"
      );
    } catch (error) {
      showToast("Could not read saved registrations. Check your browser storage.");
      console.error("Unable to read registrations from localStorage:", error);
      return [];
    }
  }

  function saveRegistrations(registrations) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
      return true;
    } catch (error) {
      console.error("Unable to save registrations to localStorage:", error);
      showToast("Could not save your registration. Check browser storage and try again.");
      return false;
    }
  }

  function showToast(message) {
    const $toast = $("#toast");
    $toast.text(message).addClass("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => $toast.removeClass("visible"), 3200);
  }

  function getEvent(eventId) {
    return events.find((event) => event.id === eventId);
  }

  function renderEvents() {
    const query = $("#event-search").val().trim().toLowerCase();
    const subject = $("#subject-filter").val();
    const type = $("#type-filter").val();
    const registrations = readRegistrations();
    const filtered = events.filter((event) => {
      const matchesQuery = [event.name, event.description, event.type, event.subjectName]
        .join(" ").toLowerCase().includes(query);
      return matchesQuery &&
        (subject === "all" || event.subject === subject) &&
        (type === "all" || event.type === type);
    });

    $("#event-count").text(`${filtered.length} ${filtered.length === 1 ? "event" : "events"} to explore`);
    $grid.empty();
    if (filtered.length === 0) {
      $grid.append($("<p>").addClass("no-events").text("No events match those filters. Try another search."));
      return;
    }

    filtered.forEach((event, index) => {
      const registrationCount = registrations.filter((item) => item.eventId === event.id).length;
      const isRegistered = registrations.some((item) => item.eventId === event.id);
      const isFull = registrationCount >= event.spots;
      const $visual = $("<div>").addClass(`event-visual visual-${event.theme}`);
      $visual.append($("<span>").addClass("visual-number").text(String(index + 1).padStart(2, "0")));
      $visual.append($("<span>").addClass("visual-symbol").text(event.symbol));
      $visual.append($("<span>").addClass("visual-kicker").text(`${event.type.toUpperCase()} / CAMPUS LIFE`));

      const $tags = $("<div>").addClass("event-tags")
        .append($("<span>").addClass("tag").text(event.type))
        .append($("<span>").addClass("tag subject-tag").text(event.subject));
      const $meta = $("<div>").addClass("event-meta")
        .append($("<span>").text(`◷ ${event.date} · ${event.time}`))
        .append($("<span>").text(`⌖ ${event.venue}`));
      const buttonText = isRegistered ? "Registered ✓" : isFull ? "Event full" : "Save my spot ↗";
      const $button = $("<button>").attr({
        type: "button",
        class: "register-button",
        "data-event-id": event.id,
        disabled: isRegistered || isFull
      }).text(buttonText);

      const $card = $("<article>").addClass("event-card").attr("data-event-id", event.id);
      $card.append($visual);
      const $content = $("<div>").addClass("event-content")
        .append($tags)
        .append($("<h3>").text(event.name))
        .append($("<p>").addClass("event-description").text(event.description))
        .append($meta);
      $content.append($("<div>").addClass("event-footer")
        .append($("<span>").addClass("spots").text(`${Math.max(event.spots - registrationCount, 0)} spots left`))
        .append($button));
      $card.append($content);
      $grid.append($card);
    });
  }

  function renderRegistrations() {
    const registrations = readRegistrations();
    const $list = $("#registration-list").empty();
    $("#registration-total").text(`${registrations.length} saved`);

    if (registrations.length === 0) {
      $list.append($("<p>").addClass("empty-state")
        .text("Nothing on your calendar just yet. Find an event that feels like you."));
      return;
    }

    registrations.forEach((registration) => {
      const event = getEvent(registration.eventId);
      if (!event) return;
      const $details = $("<div>")
        .append($("<strong>").text(event.name))
        .append($("<span>").text(`${event.date} · ${event.time} · ${registration.name} · PRN ${registration.prn || "not provided"}`));
      const $remove = $("<button>").attr({
        type: "button",
        class: "cancel-button",
        "data-event-id": event.id
      }).text("Cancel registration");
      $list.append($("<article>").addClass("registration-item").append($details, $remove));
    });
  }

  function refreshViews() {
    renderEvents();
    renderRegistrations();
  }

  function loadEvents() {
    $.ajax({
      url: "events.json",
      dataType: "json",
      cache: false
    }).done((data) => {
      if (!Array.isArray(data) || data.some((event) =>
        !event || typeof event.id !== "string" || typeof event.name !== "string" ||
        typeof event.spots !== "number"
      )) {
        $grid.empty().append($("<p>").addClass("no-events").text("The event list could not be loaded: the data format is invalid."));
        $("#event-count").text("Events unavailable");
        console.error("The event list response did not match the expected format.");
        return;
      }
      events = data;
      refreshViews();
    }).fail((_, status, error) => {
      $grid.empty().append($("<p>").addClass("no-events").text("We couldn’t load events. Please run the app from a local web server and try again."));
      $("#event-count").text("Events unavailable");
      console.error("Unable to load events.json:", status, error);
    });
  }

  $("#event-search").on("input", renderEvents);
  $("#subject-filter, #type-filter").on("change", renderEvents);

  $grid.on("click", ".register-button", function () {
    const event = getEvent($(this).attr("data-event-id"));
    if (!event) {
      showToast("That event is no longer available. Reload the page and try again.");
      return;
    }
    $("#selected-event-id").val(event.id);
    $("#dialog-event-name").text(`${event.name} · ${event.date} at ${event.time}`);
    $("#form-message").text("");
    $("#registration-form")[0].reset();
    $("#student-name").val("Shubh Kamle");
    $("#student-prn").val("24070521159");
    $("#selected-event-id").val(event.id);
    $dialog[0].showModal();
    $("#student-name").trigger("focus");
  });

  $(".dialog-close").on("click", () => $dialog[0].close());
  $dialog.on("click", function (event) {
    if (event.target === this) this.close();
  });

  $("#registration-form").on("submit", function (event) {
    event.preventDefault();
    const eventId = $("#selected-event-id").val();
    const selectedEvent = getEvent(eventId);
    const name = $("#student-name").val().trim();
    const prn = $("#student-prn").val().trim();
    const email = $("#student-email").val().trim().toLowerCase();
    const registrations = readRegistrations();

    if (!selectedEvent || !name || !prn || !/^\d+$/.test(prn) || !email) {
      $("#form-message").text("Enter your name, a numeric PRN, and a valid email address.");
      return;
    }
    if (registrations.some((item) => item.eventId === eventId && (item.prn === prn || item.email === email))) {
      $("#form-message").text("This PRN or email is already registered for this event.");
      return;
    }
    if (registrations.filter((item) => item.eventId === eventId).length >= selectedEvent.spots) {
      $("#form-message").text("Sorry, this event has reached its registration limit.");
      return;
    }

    const updated = registrations.concat({
      eventId,
      name,
      prn,
      email,
      registeredAt: new Date().toISOString()
    });
    if (!saveRegistrations(updated)) {
      $("#form-message").text("Your registration could not be saved. Please try again.");
      return;
    }
    $dialog[0].close();
    refreshViews();
    showToast(`You’re in! See you at ${selectedEvent.name}.`);
  });

  $("#registration-list").on("click", ".cancel-button", function () {
    const eventId = $(this).attr("data-event-id");
    const registrations = readRegistrations();
    const updated = registrations.filter((item) => item.eventId !== eventId);
    if (saveRegistrations(updated)) {
      refreshViews();
      showToast("Your registration has been cancelled.");
    }
  });

  loadEvents();
});
