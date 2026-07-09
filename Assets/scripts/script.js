/* ---------- nav toggler ---------- */

(function initNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
  });
})();

/* ---------- planner js ---------- */

(function initPlanner() {
  const form = document.getElementById("taskForm");
  if (!form) return; // not on this page

  const input = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("taskPriority");
  const dueInput = document.getElementById("taskDue");
  const list = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  const statTotal = document.getElementById("statTotal");
  const statOpen = document.getElementById("statOpen");
  const statDone = document.getElementById("statDone");

  const STORAGE_KEY = "tega_planner_tasks";

  let tasks = loadTasks();

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.log(e);
    }
  }

  function formatDue(dateStr) {
    if (!dateStr) return "No due date";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return "No due date";
    return (
      "Due " +
      d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  }

  function render() {
    list.innerHTML = "";

    if (tasks.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      tasks.forEach((task) => list.appendChild(buildTaskEl(task)));
    }

    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    statTotal.textContent = String(total);
    statDone.textContent = String(done);
    statOpen.textContent = String(total - done);
  }

  function buildTaskEl(task) {
    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " done" : "");
    li.dataset.id = String(task.id);

    const check = document.createElement("button");
    check.className = "task-check";
    check.type = "button";
    check.textContent = task.done ? "✓" : "";
    check.addEventListener("click", () => toggleTask(task.id));

    const main = document.createElement("div");
    main.className = "task-main";

    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta.textContent = `${task.priority} priority · ${formatDue(task.due)}`;

    main.appendChild(title);
    main.appendChild(meta);

    const del = document.createElement("button");
    del.className = "task-delete";
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(check);
    li.appendChild(main);
    li.appendChild(del);
    return li;
  }

  function addTask(title, priority, due) {
    tasks.push({
      id: Date.now(),
      title: title.trim(),
      priority,
      due,
      done: false,
    });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) {
      input.focus();
      return;
    }
    addTask(title, prioritySelect.value, dueInput.value);
    form.reset();
    prioritySelect.value = "Medium";
    input.focus();
  });

  render();
})();

/* ---------- contact js ---------- */

(function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("formStatus");

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("error-name"),
      wrap: document.getElementById("field-name"),
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("error-email"),
      wrap: document.getElementById("field-email"),
    },
    phone: {
      input: document.getElementById("phone"),
      error: document.getElementById("error-phone"),
      wrap: document.getElementById("field-phone"),
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("error-message"),
      wrap: document.getElementById("field-message"),
    },
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const DIGITS_RE = /^[0-9]+$/;

  function setError(field, message) {
    field.error.textContent = message;
    field.wrap.classList.toggle("invalid", Boolean(message));
  }

  function validateName() {
    const v = fields.name.input.value.trim();
    if (!v) {
      setError(fields.name, "Name is required.");
      return false;
    }
    setError(fields.name, "");
    return true;
  }

  function validateEmail() {
    const v = fields.email.input.value.trim();
    if (!v) {
      setError(fields.email, "Email address is required.");
      return false;
    }
    if (!EMAIL_RE.test(v)) {
      setError(
        fields.email,
        "Enter a valid email address (e.g. name@example.com).",
      );
      return false;
    }
    setError(fields.email, "");
    return true;
  }

  function validatePhone() {
    const v = fields.phone.input.value.trim();
    if (!v) {
      setError(fields.phone, "Phone number is required.");
      return false;
    }
    if (!DIGITS_RE.test(v)) {
      setError(fields.phone, "Phone number must contain digits only.");
      return false;
    }
    setError(fields.phone, "");
    return true;
  }

  function validateMessage() {
    const v = fields.message.input.value.trim();
    if (!v) {
      setError(fields.message, "Message cannot be empty.");
      return false;
    }
    setError(fields.message, "");
    return true;
  }

  fields.name.input.addEventListener("blur", validateName);
  fields.email.input.addEventListener("blur", validateEmail);
  fields.phone.input.addEventListener("blur", validatePhone);
  fields.message.input.addEventListener("blur", validateMessage);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.classList.remove("show");

    const validName = validateName();
    const validEmail = validateEmail();
    const validPhone = validatePhone();
    const validMessage = validateMessage();

    if (validName && validEmail && validPhone && validMessage) {
      status.classList.add("show");
      form.reset();
    } else {
      const firstInvalid = form.querySelector(
        ".invalid input, .invalid textarea",
      );
      if (firstInvalid) firstInvalid.focus();
    }
  });
})();
