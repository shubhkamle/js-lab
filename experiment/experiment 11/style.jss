:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #172554;
  background: #f3f7ff;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  font-weight: 400;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  padding: 48px 20px;
}

button,
input,
select {
  font: inherit;
}

.app {
  width: min(100%, 760px);
  margin: 0 auto;
}

.page-header {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 0.72rem;
  font-weight: 750;
  letter-spacing: 0.13em;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 8px;
  font-size: clamp(2rem, 6vw, 2.8rem);
  letter-spacing: -0.05em;
}

.subtitle {
  margin-bottom: 0;
  color: #64748b;
}

.student-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-top: 16px;
  color: #1d4ed8;
  font-size: 0.88rem;
}

.student-details span {
  color: #64748b;
}

.countdown-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  border-radius: 18px;
  color: white;
  background: linear-gradient(125deg, #1d4ed8, #3b82f6);
  box-shadow: 0 14px 35px rgb(37 99 235 / 18%);
}

.eyebrow-light {
  color: #bfdbfe;
}

.countdown-card h2 {
  margin-bottom: 6px;
  font-size: 1.4rem;
}

.next-class-time {
  margin-bottom: 0;
  color: #dbeafe;
  font-size: 0.9rem;
}

.countdown {
  display: flex;
  gap: 10px;
}

.time-unit {
  display: grid;
  min-width: 60px;
  gap: 3px;
  justify-items: center;
}

.time-unit span {
  font-size: 1.65rem;
  font-variant-numeric: tabular-nums;
  font-weight: 750;
}

.time-unit small {
  color: #dbeafe;
  font-size: 0.68rem;
  text-transform: uppercase;
}

.content-card {
  margin-top: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  box-shadow: 0 5px 18px rgb(15 23 42 / 4%);
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-heading .eyebrow {
  margin-bottom: 5px;
}

.section-heading h2 {
  margin-bottom: 0;
  font-size: 1.2rem;
}

.class-form {
  display: grid;
  grid-template-columns: 1fr 1.4fr auto;
  align-items: end;
  gap: 14px;
}

label {
  display: grid;
  gap: 8px;
  color: #334155;
  font-size: 0.82rem;
  font-weight: 650;
}

input,
select {
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  outline: none;
  color: #172554;
  background: #fff;
}

input:focus,
select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 15%);
}

button {
  min-height: 44px;
  padding: 0 17px;
  border: 0;
  border-radius: 9px;
  color: white;
  background: #2563eb;
  cursor: pointer;
  font-weight: 650;
  transition: background 150ms ease;
}

button:hover {
  background: #1d4ed8;
}

.message {
  min-height: 1.25em;
  margin: 12px 0 0;
  color: #b91c1c;
  font-size: 0.85rem;
}

.class-count {
  color: #64748b;
  font-size: 0.82rem;
}

.class-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.class-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
}

.class-info {
  display: grid;
  gap: 4px;
}

.class-info strong {
  font-size: 0.95rem;
}

.class-info time {
  color: #64748b;
  font-size: 0.82rem;
}

.class-item.is-next {
  border-color: #93c5fd;
  background: #eff6ff;
}

.class-item.is-past {
  opacity: 0.58;
}

.class-status {
  margin-left: auto;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
}

.remove-button {
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid #dbeafe;
  color: #1d4ed8;
  background: white;
  font-size: 0.78rem;
}

.remove-button:hover {
  color: white;
}

.empty-state {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

footer {
  padding: 20px 0 0;
  color: #94a3b8;
  font-size: 0.78rem;
  text-align: center;
}

@media (max-width: 620px) {
  body {
    padding: 30px 16px;
  }

  .countdown-card {
    align-items: flex-start;
    flex-direction: column;
    padding: 23px;
  }

  .countdown {
    width: 100%;
    justify-content: space-between;
  }

  .class-form {
    grid-template-columns: 1fr;
  }

  .class-form button {
    width: 100%;
  }

  .content-card {
    padding: 20px;
  }
}
