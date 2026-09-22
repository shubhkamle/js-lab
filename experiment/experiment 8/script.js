const form = document.querySelector('#admission-form');
const successMessage = document.querySelector('#success-message');
const admissionSummary = document.querySelector('#admission-summary');

const fields = {
  fullName: {
    input: document.querySelector('#full-name'),
    error: document.querySelector('#full-name-error'),
    validate: (value) => value.trim().length >= 2 ? '' : 'Enter your full name.'
  },
  age: {
    input: document.querySelector('#age'),
    error: document.querySelector('#age-error'),
    validate: (value) => Number.isInteger(Number(value)) && Number(value) >= 10 ? '' : 'You must be at least 10 years old.'
  },
  email: {
    input: document.querySelector('#email'),
    error: document.querySelector('#email-error'),
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email address.'
  },
  phone: {
    input: document.querySelector('#phone'),
    error: document.querySelector('#phone-error'),
    validate: (value) => /^[0-9]{10}$/.test(value.replace(/\D/g, '')) ? '' : 'Enter a 10-digit phone number.'
  },
  plan: {
    input: document.querySelector('#plan'),
    error: document.querySelector('#plan-error'),
    validate: (value) => value ? '' : 'Choose a membership plan.'
  },
  agreement: {
    input: document.querySelector('#agreement'),
    error: document.querySelector('#agreement-error'),
    validate: (value) => value ? '' : 'Please accept the membership terms.'
  }
};

function validateField(name) {
  const field = fields[name];
  const value = field.input.type === 'checkbox' ? field.input.checked : field.input.value;
  const message = field.validate(value);
  field.input.classList.toggle('invalid', Boolean(message));
  field.input.setAttribute('aria-invalid', String(Boolean(message)));
  field.error.textContent = message;
  return !message;
}

Object.entries(fields).forEach(([name, field]) => {
  field.input.addEventListener('input', () => {
    validateField(name);
    successMessage.textContent = '';
    admissionSummary.hidden = true;
  });
  field.input.addEventListener('blur', () => validateField(name));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const isValid = Object.keys(fields).map(validateField).every(Boolean);

  if (isValid) {
    const member = {
      name: fields.fullName.input.value.trim(),
      age: fields.age.input.value,
      email: fields.email.input.value.trim(),
      phone: fields.phone.input.value.trim(),
      plan: fields.plan.input.options[fields.plan.input.selectedIndex].text
    };
    successMessage.textContent = 'Thanks! Your admission application is ready.';
    admissionSummary.replaceChildren();
    const summaryHeading = document.createElement('h2');
    summaryHeading.textContent = 'Admission details';
    admissionSummary.append(summaryHeading);
    Object.entries(member).forEach(([label, value]) => {
      const row = document.createElement('p');
      const labelText = document.createElement('strong');
      labelText.textContent = `${label[0].toUpperCase()}${label.slice(1)}: `;
      row.append(labelText, document.createTextNode(value));
      admissionSummary.append(row);
    });
    admissionSummary.hidden = false;
    form.reset();
    Object.keys(fields).forEach((name) => {
      fields[name].input.classList.remove('invalid');
      fields[name].input.removeAttribute('aria-invalid');
    });
  } else {
    successMessage.textContent = '';
    admissionSummary.hidden = true;
  }
});
