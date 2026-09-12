
// To-Do List App

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    li.className = task.completed ? "completed" : "";
    li.dataset.id = task.id;

    li.innerHTML = `
      <input
        type="checkbox"
        class="task-check"
        ${task.completed ? "checked" : ""}
        aria-label="Mark task complete"
      >

      <span class="task-text">${task.text}</span>

      <button class="edit-btn" type="button">
        Edit
      </button>

      <button class="delete-btn" type="button">
        Delete
      </button>
    `;

    taskList.appendChild(li);
  });
}

// Add task
function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please enter a task.");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
}

// Add button
addTaskBtn.addEventListener("click", addTask);

// Enter key
taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Event delegation
taskList.addEventListener("click", event => {
  const li = event.target.closest("li");

  if (!li) return;

  const id = Number(li.dataset.id);

  // Delete
  if (event.target.classList.contains("delete-btn")) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
  }

  // Edit
  if (event.target.classList.contains("edit-btn")) {
    const task = tasks.find(task => task.id === id);

    const newText = prompt("Edit task:", task.text);

    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();

      saveTasks();
      renderTasks();
    }
  }
});

// Complete / uncomplete task
taskList.addEventListener("change", event => {
  if (!event.target.classList.contains("task-check")) {
    return;
  }

  const li = event.target.closest("li");
  const id = Number(li.dataset.id);

  const task = tasks.find(task => task.id === id);

  if (task) {
    task.completed = event.target.checked;

    saveTasks();
    renderTasks();
  }
});

// Filtering
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderTasks();
  });
});

// Initial render
renderTasks();
