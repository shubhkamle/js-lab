const sourceInput = document.querySelector('#source-input');
const fetchButton = document.querySelector('#fetch-button');
const jqueryButton = document.querySelector('#jquery-button');
const tableHead = document.querySelector('#table-head');
const tableBody = document.querySelector('#table-body');
const rowCount = document.querySelector('#row-count');
const statusMessage = document.querySelector('#status-message');
const statusDot = document.querySelector('#status-dot');

function setStatus(message, state = 'ready') {
  statusMessage.textContent = message;
  statusDot.className = `status-dot ${state}`;
}

function renderTable(data) {
  const rows = Array.isArray(data) ? data : [data];
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];

  if (!columns.length) {
    tableHead.innerHTML = '';
    tableBody.innerHTML = '<tr class="empty-row"><td colspan="1">The JSON file contains no table columns.</td></tr>';
    rowCount.textContent = '0 rows';
    return;
  }

  tableHead.innerHTML = `<tr>${columns.map((column) => `<th scope="col">${column}</th>`).join('')}</tr>`;
  tableBody.innerHTML = rows.map((row) => `
    <tr>${columns.map((column) => `<td>${formatValue(row[column])}</td>`).join('')}</tr>
  `).join('');
  rowCount.textContent = `${rows.length} ${rows.length === 1 ? 'row' : 'rows'}`;
}

function formatValue(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function setLoading(isLoading) {
  fetchButton.disabled = isLoading;
  jqueryButton.disabled = isLoading;
}

async function loadWithFetch() {
  setLoading(true);
  setStatus('Loading with fetch()…', 'loading');

  try {
    const response = await fetch(sourceInput.value.trim());
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    renderTable(await response.json());
    setStatus('Data loaded successfully with fetch().');
  } catch (error) {
    setStatus(getLoadErrorMessage(error), 'error');
  } finally {
    setLoading(false);
  }
}

function loadWithJQuery() {
  setLoading(true);
  setStatus('Loading with $.getJSON()…', 'loading');

  $.getJSON(sourceInput.value.trim())
    .done((data) => {
      renderTable(data);
      setStatus('Data loaded successfully with $.getJSON().');
    })
    .fail((_request, _status, error) => {
      setStatus(getLoadErrorMessage(error), 'error');
    })
    .always(() => setLoading(false));
}

function getLoadErrorMessage(error) {
  if (window.location.protocol === 'file:') {
    return 'Please run this page with a local server, such as: python3 -m http.server 8000';
  }
  return error?.message || error || 'Unable to load JSON data.';
}

fetchButton.addEventListener('click', loadWithFetch);
jqueryButton.addEventListener('click', loadWithJQuery);
