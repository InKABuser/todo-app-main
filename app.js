const themeToggle = document.querySelector(".theme-toggle");

themeToggle.onclick = () => {
  document.documentElement.classList.toggle("dark-theme");
  const currentBG = getComputedStyle(document.body).backgroundImage;
};

// todo script

const Todos = [];
// const onlyCompletedTodos = Todos.filter((Todo) => Todo.complete === true);
const completeToggle = document.querySelector(".Completed");
const allToggle = document.querySelector(".all");
const activeToggle = document.querySelector(".Active");
const clearCompleteBTN = document.querySelector(".clear");
const todoInput = document.getElementById("Todo");
const todoSection = document.querySelector(".todos");
let draggedItem = null;
const leftItems = document.querySelector(".remain-items span");
//
//dragg events
todoSection.addEventListener("dragstart", (e) => {
  draggedItem = e.target;
  e.target.style.opacity = 0.5;
  e.target.classList.add("dragging");
});
todoSection.addEventListener("dragend", (e) => {
  e.target.style.opacity = "";
  e.target.classList.remove("dragging");
});
todoSection.addEventListener("dragover", (e) => {
  e.preventDefault();
  const target = e.target;
  if (target.classList.contains("todo-item") && target !== draggedItem) {
    target.classList.add("drop-target");
  }
});
todoSection.addEventListener("dragleave", (e) => {
  e.target.classList.remove("drop-target");
});
todoSection.addEventListener("drop", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("todo-item") && e.target !== draggedItem) {
    e.target.classList.remove("drop-target");

    // Check if the target is directly before the dragged item
    if (e.target.nextElementSibling === draggedItem) {
      // Insert dragged item before target if target is the previous sibling
      todoSection.insertBefore(draggedItem, e.target);
    } else {
      // Otherwise, insert dragged item after target
      todoSection.insertBefore(draggedItem, e.target.nextElementSibling);
    }
  }
});

allToggle.classList.add("active");
let currentFilter = "all";
allToggle.addEventListener("click", () => {
  currentFilter = "all";
  setActiveFilter(allToggle);
  displayTodosByFilter();
});

completeToggle.addEventListener("click", () => {
  currentFilter = "completed";
  setActiveFilter(completeToggle);
  displayTodosByFilter();
});

activeToggle.addEventListener("click", () => {
  currentFilter = "active";
  setActiveFilter(activeToggle);
  displayTodosByFilter();
});

clearCompleteBTN.addEventListener("click", () => {
  removeCompletedTodos();
});

todoSection.addEventListener("click", (e) => {
  if (e.target.matches(".done")) {
    const isChecked = e.target.checked;
    const boxParent = e.target.parentElement;
    const para = boxParent ? boxParent.nextElementSibling : null;

    if (para) {
      updateParagraphStyles(para, isChecked);
      //
      const matchingTodo = Todos.find(
        (todo) => todo.text === para.textContent.trim()
      );
      if (matchingTodo) {
        matchingTodo.complete = isChecked;
        remainingTodos();
      }
    }
  }

  if (e.target.matches(".remove-todo")) {
    const siblingPara = e.target.previousElementSibling;
    const matchingTodoToRemove = Todos.find(
      (todo) => todo.text === siblingPara.textContent.trim()
    );
    if (matchingTodoToRemove) {
      const indexOfTodo = Todos.indexOf(matchingTodoToRemove);
      removeTodo(indexOfTodo, siblingPara);
    }
  }
});

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && todoInput.value !== "") {
    pushTodo();
    todoInput.value = "";
    const newTodo = Todos[Todos.length - 1]; // Get the last added todo
    displayTodo(newTodo);
  }
});

function pushTodo() {
  let todoItem = {};
  todoItem.text = todoInput.value;
  todoItem.complete = false;
  Todos.push(todoItem);
}

function displayTodo(todo) {
  const todoDiv = document.createElement("div");
  todoDiv.className = "todo-item";
  todoDiv.setAttribute("draggable", true);
  const label = document.createElement("label");
  label.className = "checkbox-container";
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "done";
  checkBox.checked = todo.complete;
  const spanMark = document.createElement("span");
  spanMark.className = "checkmark";
  const todoText = document.createElement("p");
  todoText.className = "todo-text";
  const removeBTN = document.createElement("button");
  removeBTN.className = "remove-todo";
  //
  updateParagraphStyles(todoText, todo.complete);

  todoText.textContent = todo.text;
  label.appendChild(checkBox);
  label.appendChild(spanMark);
  todoDiv.append(label, todoText, removeBTN);
  todoSection.appendChild(todoDiv);
  //
  remainingTodos();
}

function updateParagraphStyles(para, isComplete) {
  if (isComplete) {
    para.style.textDecoration = "line-through";
    para.style.color = "var(--Light-Grayish-Blue)";
  } else {
    para.style.textDecoration = "none";
    para.style.color = "unset";
  }
}

function remainingTodos() {
  const notCompleteTodos = Todos.filter((todo) => todo.complete === false);
  leftItems.textContent = notCompleteTodos.length;
}

function removeTodo(index, childPara) {
  Todos.splice(index, 1);

  const parentDivOfTodo = childPara.parentElement;
  parentDivOfTodo.remove();
  remainingTodos();
}

// Helper function to set the active filter button
function setActiveFilter(activeButton) {
  // Remove "active" class from all filters
  allToggle.classList.remove("active");
  completeToggle.classList.remove("active");
  activeToggle.classList.remove("active");

  // Add "active" class to the selected filter
  activeButton.classList.add("active");
}

function removeCompletedTodos() {
  const notCompletedTodos = Todos.filter((todo) => !todo.complete);

  // Update the Todos array to only include the remaining (not completed) todos
  Todos.length = 0;
  Todos.push(...notCompletedTodos); // Push only the not completed todos back

  // Update the display to show only the remaining todos
  if (currentFilter === "completed") {
    todoSection.innerHTML = "";
  } else {
    displayTodosByFilter();
  }

  remainingTodos();
}

function displayTodosByFilter() {
  todoSection.innerHTML = ""; // Clear current todos

  if (currentFilter === "completed") {
    // Show only completed todos
    Todos.filter((todo) => todo.complete === true).forEach((todo) =>
      displayTodo(todo)
    );
  } else if (currentFilter === "active") {
    // Show only active (not completed) todos
    Todos.filter((todo) => todo.complete === false).forEach((todo) =>
      displayTodo(todo)
    );
  } else {
    // Show all todos
    Todos.forEach((todo) => displayTodo(todo));
  }
}
