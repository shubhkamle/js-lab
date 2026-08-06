/**
 * @typedef {function(string): {ok:boolean,isPalindrome?:boolean,cleaned?:string,error?:string}} CheckerFunction
 */

/**
 * Factory that creates a palindrome checker.
 * Demonstrates closure (normalize captured), scope, and try-catch.
 */
function makePalindromeChecker() {
  // normalize is private to the closure
  const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  /**
   * Check if a string is a palindrome.
   * @type {CheckerFunction}
   */
  function check(input) {
    try {
      if (input === null || input === undefined) throw new TypeError('Input is required');
      if (typeof input !== 'string') input = String(input);
      const cleaned = normalize(input);
      const reversed = cleaned.split('').reverse().join('');
      const isPalindrome = cleaned.length > 0 && cleaned === reversed;
      return { ok: true, isPalindrome, cleaned };
    } catch (err) {
      return { ok: false, error: err && err.message ? err.message : String(err) };
    }
  }

  // expose only the check function (keeps normalize hidden)
  return { check };
}

// ---- UI wiring ----
const checker = makePalindromeChecker();
const inputEl = document.getElementById('text');
const btn = document.getElementById('check');
const clr = document.getElementById('clear');
const resultEl = document.getElementById('result');

function renderResult(res) {
  if (!res) { resultEl.textContent = ''; return; }
  if (!res.ok) {
    resultEl.textContent = `Error: ${res.error}`;
    resultEl.style.color = '#ff6b6b';
    return;
  }
  if (res.cleaned === '') {
    resultEl.textContent = 'Enter letters or numbers to check.';
    resultEl.style.color = '#f0f0f0';
    return;
  }
  if (res.isPalindrome) {
    resultEl.textContent = `"${res.cleaned}" is a palindrome.`;
    resultEl.style.color = '#6ee7b7';
  } else {
    resultEl.textContent = `"${res.cleaned}" is NOT a palindrome.`;
    resultEl.style.color = '#ffd66b';
  }
}

btn.addEventListener('click', () => {
  const out = checker.check(inputEl.value);
  renderResult(out);
});

clr.addEventListener('click', () => {
  inputEl.value = '';
  renderResult(null);
  inputEl.focus();
});

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btn.click();
});
