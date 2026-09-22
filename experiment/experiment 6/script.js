const emailInput = document.querySelector('#email-input');
const validateButton = document.querySelector('#validate-email');
const emailStatus = document.querySelector('#email-status');
const emailMessage = document.querySelector('#email-message');
const extractInput = document.querySelector('#extract-input');
const analysisInput = document.querySelector('#analysis-input');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const extractionPatterns = {
  emails: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi,
  phones: /(?:\+?\d[\d\s().-]{8,}\d)/g,
  urls: /https?:\/\/[^\s]+/gi
};

function validateEmail() {
  const value = emailInput.value.trim();
  const valid = emailPattern.test(value);
  emailStatus.textContent = valid ? 'Valid' : 'Invalid';
  emailStatus.className = `status ${valid ? 'valid' : 'invalid'}`;
  emailMessage.textContent = valid
    ? `${value} has a valid email format.`
    : 'Please enter a complete email such as name@example.com.';
}

function formatMatches(matches) {
  return matches.length ? matches.join(', ') : 'None found';
}

function extractData() {
  const text = extractInput.value;
  document.querySelector('#email-results').textContent = formatMatches(text.match(extractionPatterns.emails) || []);
  document.querySelector('#phone-results').textContent = formatMatches(text.match(extractionPatterns.phones) || []);
  const urls = (text.match(extractionPatterns.urls) || []).map((url) => url.replace(/[.,!?;:]+$/, ''));
  document.querySelector('#url-results').textContent = formatMatches(urls);
}

function analyzeText() {
  const text = analysisInput.value;
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  document.querySelector('#character-count').textContent = text.length;
  document.querySelector('#word-count').textContent = words.length;
  document.querySelector('#line-count').textContent = text ? text.split(/\r?\n/).length : 0;
  document.querySelector('#sentence-count').textContent = sentences.length;
}

validateButton.addEventListener('click', validateEmail);
emailInput.addEventListener('input', () => {
  if (emailInput.value.trim()) validateEmail();
});
extractInput.addEventListener('input', extractData);
analysisInput.addEventListener('input', analyzeText);
