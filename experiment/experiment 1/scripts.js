const infoElement = document.getElementById('userInfo');

function updateInfo() {
  const userDetails = {
    age: 20,
    email: 'shubh.kamle.batch2024@sitnagpur.siu.edu.in',
    memberSince: '2024'
  };

  infoElement.textContent = `Name: ${userInfo.name} \u2022 Role: ${userInfo.role} \u2022 City: ${userInfo.city} \u2022 Age: ${userDetails.age}`;
  console.log('External script updateInfo() called.');
  console.error('If you see this, external JS has loaded correctly.');
}

window.addEventListener('DOMContentLoaded', () => {
  showWelcome();
  console.log('DOMContentLoaded event fired.');
});
