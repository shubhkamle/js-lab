const todoForm = document.querySelector('#todo-form');
const nameInput = document.querySelector('#name-input');
const rollInput = document.querySelector('#roll-input');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const emptyState = document.querySelector('#empty-state');
const taskCount = document.querySelector('#task-count');
let tasks = [];

function updateSummary() {
  const count = tasks.length;
  taskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'}`;
  emptyState.hidden = count > 0;
}

function createTaskElement(task) {
  const item = document.createElement('li');
  item.className = 'todo-item';
  item.dataset.id = task.id;
  const text = document.createElement('span');
  text.className = 'todo-text';
  text.textContent = task.text;
  const details = document.createElement('div');
  details.className = 'todo-details';
  const person = document.createElement('strong');
  person.textContent = task.name;
  const roll = document.createElement('span');
  roll.textContent = `Roll no. ${task.rollNumber}`;
  details.append(person, roll);
  const content = document.createElement('div');
  content.className = 'todo-content';
  content.append(details, text);
  const actions = document.createElement('div');
  actions.className = 'item-actions';
  for (const action of ['done', 'edit', 'delete']) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${action}-button`;
    button.textContent = action === 'done' ? (task.completed ? '✓' : '○') : action === 'delete' ? '×' : 'Edit';
    button.setAttribute('aria-label', action === 'done' ? (task.completed ? 'Mark task as not done' : 'Mark task as done') : action === 'delete' ? 'Delete task' : 'Edit task');
    button.dataset.action = action;
    actions.append(button);
  }
  if (task.completed) item.classList.add('completed');
  item.append(content, actions);
  return item;
}

function renderTasks() {
  todoList.replaceChildren(...tasks.map(createTaskElement));
  updateSummary();
}

function editTask(item) {
  const task = tasks.find((entry) => entry.id === item.dataset.id);
  if (!task) return;
  const input = document.createElement('input');
  input.className = 'edit-input';
  input.value = task.text;
  input.setAttribute('aria-label', 'Edit task');
  item.querySelector('.todo-text').replaceWith(input);
  input.focus();
  input.select();
  const finishEditing = () => {
    const nextText = input.value.trim();
    if (nextText) task.text = nextText;
    renderTasks();
  };
  input.addEventListener('blur', finishEditing, { once: true });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') input.blur();
    if (event.key === 'Escape') { input.value = task.text; input.blur(); }
  });
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const rollNumber = rollInput.value.trim();
  const text = todoInput.value.trim();
  if (!name || !rollNumber || !text) return;
  tasks.push({ id: crypto.randomUUID(), name, rollNumber, text, completed: false });
  renderTasks();
  todoForm.reset();
  todoInput.focus();
});

todoList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const item = button.closest('.todo-item');
  const task = tasks.find((entry) => entry.id === item.dataset.id);
  if (button.dataset.action === 'delete') {
    tasks = tasks.filter((task) => task.id !== item.dataset.id);
    renderTasks();
  } else if (button.dataset.action === 'done' && task) {
    task.completed = !task.completed;
    renderTasks();
  } else if (button.dataset.action === 'edit') editTask(item);
});

updateSummary();
