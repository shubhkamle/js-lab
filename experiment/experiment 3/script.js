document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('gradesForm');
  const marksInputs = () => Array.from(document.querySelectorAll('.mark'));
  const errorEl = document.getElementById('error');
  const resultEl = document.getElementById('result');
  const resetBtn = document.getElementById('resetBtn');

  function clearMessages(){ errorEl.textContent=''; resultEl.textContent=''; }

  function getGrade(percent){
    if(percent >= 90) return 'A';
    if(percent >= 80) return 'B';
    if(percent >= 70) return 'C';
    if(percent >= 60) return 'D';
    return 'F';
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    clearMessages();
    const marks = marksInputs().map(input => input.value.trim());

    // Validation: all fields required and numeric 0-100
    for(let i=0;i<marks.length;i++){
      const v = marks[i];
      if(v === ''){
        errorEl.textContent = `Please enter a mark for Subject ${i+1}.`;
        marksInputs()[i].focus();
        return;
      }
      const n = Number(v);
      if(Number.isNaN(n) || n < 0 || n > 100){
        errorEl.textContent = `Subject ${i+1} must be a number between 0 and 100.`;
        marksInputs()[i].focus();
        return;
      }
    }

    const nums = marks.map(v=>Number(v));
    const total = nums.reduce((s,x)=>s+x,0);
    const average = total / nums.length;
    const grade = getGrade(average);
    const status = average >= 40 ? 'Pass' : 'Fail';

    const student = document.getElementById('studentName').value.trim();
    const nameLine = student ? `<strong>${student}</strong> — ` : '';

    resultEl.innerHTML = `${nameLine}Total: ${total} / ${nums.length*100}<br>Percentage: ${average.toFixed(2)}%<br>Grade: <strong>${grade}</strong><br>Status: ${status}`;
  });

  resetBtn.addEventListener('click', ()=>{
    form.reset();
    clearMessages();
  });
});
