const STORAGE_KEY = 'todo-list';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const counter = document.getElementById('counter');
const emptyState = document.getElementById('empty-state');

let todos = loadTodos();
let newTodoId = null;

function loadTodos() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // localStorage может быть недоступен (например, в приватном режиме)
  }
}

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function render() {
  list.innerHTML = '';

  for (const todo of todos) {
    const item = document.createElement('li');
    item.className = 'todo-item' + (todo.done ? ' todo-item--done' : '');
    if (todo.id === newTodoId) item.classList.add('todo-item--new');
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-item__checkbox';
    checkbox.checked = todo.done;
    checkbox.id = `todo-${todo.id}`;

    const text = document.createElement('label');
    text.className = 'todo-item__text';
    text.htmlFor = checkbox.id;
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'todo-item__delete';
    deleteButton.setAttribute('aria-label', `Удалить задачу «${todo.text}»`);
    deleteButton.textContent = '×';

    item.append(checkbox, text, deleteButton);
    list.append(item);
  }

  const remaining = todos.filter((todo) => !todo.done).length;
  counter.textContent = todos.length ? `Осталось: ${remaining} из ${todos.length}` : '';
  emptyState.hidden = todos.length > 0;
  newTodoId = null;
}

function update() {
  saveTodos();
  render();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  newTodoId = createId();
  todos.push({ id: newTodoId, text, done: false });
  input.value = '';
  input.focus();
  update();
});

list.addEventListener('change', (event) => {
  if (!event.target.matches('.todo-item__checkbox')) return;
  const id = event.target.closest('.todo-item').dataset.id;
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = event.target.checked;
    update();
  }
});

list.addEventListener('click', (event) => {
  if (!event.target.matches('.todo-item__delete')) return;
  const id = event.target.closest('.todo-item').dataset.id;
  todos = todos.filter((t) => t.id !== id);
  update();
});

render();
