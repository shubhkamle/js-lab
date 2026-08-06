// Function declaration: reverse a PIN string
function reversePin(pin) {
  let reversed = '';
  for (let i = pin.length - 1; i >= 0; i -= 1) {
    reversed += pin[i];
  }
  return reversed;
}

// Function expression: check whether a PIN is palindrome using reversePin
const isPalindromePin = function(pin) {
  const cleaned = pin.trim();
  return cleaned !== '' && cleaned === reversePin(cleaned);
};

// Arrow function: generate a message based on palindrome result
const getSecurityMessage = (pin) => {
  if (isPalindromePin(pin)) {
    return {
      text: 'Security alert: PALINDROME PIN detected.',
      type: 'warning'
    };
  }
  return {
    text: 'PIN accepted. No palindrome pattern found.',
    type: 'success'
  };
};

// Closure example: create a secure validator with private message counter
function createPinValidator() {
  let validationCount = 0; // private state inside closure

  return function(pin) {
    validationCount += 1;
    const result = getSecurityMessage(pin);
    result.count = validationCount;
    return result;
  };
}

const validatePin = createPinValidator();

const pinInput = document.getElementById('pinInput');
const checkButton = document.getElementById('checkButton');
const resultArea = document.getElementById('result');

checkButton.addEventListener('click', () => {
  const pin = pinInput.value;
  if (!/^[0-9]{4,6}$/.test(pin)) {
    resultArea.textContent = 'Please enter a 4 to 6 digit numeric PIN.';
    resultArea.className = 'message warning';
    resultArea.style.display = 'block';
    return;
  }

  const response = validatePin(pin);
  resultArea.textContent = `${response.text} (Checked ${response.count} time${response.count === 1 ? '' : 's'}.)`;
  resultArea.className = `message ${response.type}`;
  resultArea.style.display = 'block';
});
