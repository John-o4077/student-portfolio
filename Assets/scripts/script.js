/* ---------- nav toggler ---------- */

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  const icon = navToggle.querySelector("i");

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");

    if (navLinks.classList.contains("open")) {
      icon.classList.replace("ri-menu-line", "ri-close-line");
    } else {
      icon.classList.replace("ri-close-line", "ri-menu-line");
    }
  });
}

/* ---------- planner js ---------- */

const STORAGE_KEY = "planner_tasks";

const form = document.getElementById("taskForm");

if (!form) return;

const elements = {
  form,
  input: document.getElementById("taskInput"),
  priority: document.getElementById("taskPriority"),
  due: document.getElementById("taskDue"),
  list: document.getElementById("taskList"),
  empty: document.getElementById("emptyState"),
  total: document.getElementById("statTotal"),
  open: document.getElementById("statOpen"),
  done: document.getElementById("statDone"),
};

let tasks = getTasks();

function getTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDate(date) {
  if (!date) return "No due date";

  return `Due ${new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function updateStats() {
  const completed = tasks.filter(task => task.done).length;

  elements.total.textContent = tasks.length;
  elements.done.textContent = completed;
  elements.open.textContent = tasks.length - completed;
}

function createTaskElement(task) {
  return `
    <li class="task-item ${task.done ? "done" : ""}" data-id="${task.id}">
      <button class="task-check">
        ${task.done ? "✓" : ""}
      </button>

      <div class="task-main">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">
          ${task.priority} priority · ${formatDate(task.due)}
        </div>
      </div>

      <button class="task-delete">
        Delete
      </button>
    </li>
  `;
}

function renderTasks() {
  elements.empty.style.display = tasks.length ? "none" : "block";

  elements.list.innerHTML = tasks
    .map(createTaskElement)
    .join("");

  updateStats();
}

function addTask(title, priority, due) {
  tasks.push({
    id: Date.now(),
    title,
    priority,
    due,
    done: false,
  });

  saveTasks();
  renderTasks();
}

elements.form.addEventListener("submit", e => {
  e.preventDefault();

  const title = elements.input.value.trim();

  if (!title) return;

  addTask(
    title,
    elements.priority.value,
    elements.due.value
  );

  elements.form.reset();
  elements.priority.value = "Medium";
  elements.input.focus();
});

elements.list.addEventListener("click", e => {
  const item = e.target.closest(".task-item");

  if (!item) return;

  const id = Number(item.dataset.id);

  if (e.target.classList.contains("task-check")) {
    tasks = tasks.map(task =>
      task.id === id
        ? { ...task, done: !task.done }
        : task
    );
  }

  if (e.target.classList.contains("task-delete")) {
    tasks = tasks.filter(task => task.id !== id);
  }

  saveTasks();
  renderTasks();
});

renderTasks();

/* ---------- contact js ---------- */

const form = document.getElementById("contactForm");

if (form) {
  const status = document.getElementById("formStatus");

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("error-name"),
      wrapper: document.getElementById("field-name"),
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("error-email"),
      wrapper: document.getElementById("field-email"),
    },
    phone: {
      input: document.getElementById("phone"),
      error: document.getElementById("error-phone"),
      wrapper: document.getElementById("field-phone"),
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("error-message"),
      wrapper: document.getElementById("field-message"),
    },
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^\d+$/;

  function showError(field, message) {
    field.error.textContent = message;
    field.wrapper.classList.toggle("invalid", message !== "");
  }

  function validateName() {
    const value = fields.name.input.value.trim();

    if (!value) {
      showError(fields.name, "Name is required.");
      return false;
    }

    showError(fields.name, "");
    return true;
  }

  function validateEmail() {
    const value = fields.email.input.value.trim();

    if (!value) {
      showError(fields.email, "Email is required.");
      return false;
    }

    if (!EMAIL_REGEX.test(value)) {
      showError(fields.email, "Enter a valid email address.");
      return false;
    }

    showError(fields.email, "");
    return true;
  }

  function validatePhone() {
    const value = fields.phone.input.value.trim();

    if (!value) {
      showError(fields.phone, "Phone number is required.");
      return false;
    }

    if (!PHONE_REGEX.test(value)) {
      showError(fields.phone, "Phone number must contain only digits.");
      return false;
    }

    showError(fields.phone, "");
    return true;
  }

  function validateMessage() {
    const value = fields.message.input.value.trim();

    if (!value) {
      showError(fields.message, "Message cannot be empty.");
      return false;
    }

    showError(fields.message, "");
    return true;
  }

  fields.name.input.addEventListener("blur", validateName);
  fields.email.input.addEventListener("blur", validateEmail);
  fields.phone.input.addEventListener("blur", validatePhone);
  fields.message.input.addEventListener("blur", validateMessage);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    status.classList.remove("show");

    const isValid =
      validateName() &&
      validateEmail() &&
      validatePhone() &&
      validateMessage();

    if (!isValid) {
      const firstInvalid = form.querySelector(
        ".invalid input, .invalid textarea"
      );

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    status.classList.add("show");
    form.reset();

    Object.values(fields).forEach((field) => showError(field, ""));
  });
}
