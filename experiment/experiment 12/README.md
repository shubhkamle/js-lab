# Campus Connect

A responsive campus events and workshop registration app built with HTML, CSS, JavaScript and jQuery. It features the Enthusia and Sportspectra sports events, ICSIT, and workshops tagged with the JS, CC, CN and DC subject codes.

## Run locally

The event list is loaded with jQuery AJAX from `events.json`, so serve the project over HTTP rather than opening `index.html` directly:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

Registrations are stored in the browser's local storage. jQuery is loaded from its official CDN and requires an internet connection.
