const API_URL = "http://localhost:3000/tasks";

document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const subjectInput = document.getElementById("subjectInput");
    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");
    const completedTasks = document.getElementById("completedTasks");

    const menuButton = document.getElementById("menuButton");
    const navLinks = document.getElementById("navLinks");
    const themeButton = document.getElementById("themeButton");

    menuButton.addEventListener("click", function () {
        navLinks.classList.toggle("show");
    });

    themeButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");

        const isDark = document.body.classList.contains("dark-theme");
        themeButton.textContent = isDark ? "☀️" : "🌙";
    });

    function updateSummary(tasks) {
        const completed = tasks.filter(function (task) {
            return task.completed;
        }).length;

        const remaining = tasks.length - completed;

        taskCount.textContent =
            remaining === 1
                ? "1 task remaining"
                : `${remaining} tasks remaining`;

        completedTasks.textContent = completed;
    }

    function createTaskElement(task) {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        taskItem.innerHTML = `
            <button
                type="button"
                class="complete-button"
                aria-label="Complete task"
            >
                ✓
            </button>

            <div class="task-details">
                <h4>${task.title}</h4>
                <span>${task.subject}</span>
            </div>

            <button
                type="button"
                class="delete-button"
                aria-label="Delete task"
            >
                ×
            </button>
        `;

        const completeButton =
            taskItem.querySelector(".complete-button");

        const deleteButton =
            taskItem.querySelector(".delete-button");

        completeButton.addEventListener("click", async function () {
            await updateTask(task.id, !task.completed);
        });

        deleteButton.addEventListener("click", async function () {
            await deleteTask(task.id);
        });

        return taskItem;
    }

    async function loadTasks() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            taskList.innerHTML = "";

            data.tasks.forEach(function (task) {
                taskList.appendChild(createTaskElement(task));
            });

            updateSummary(data.tasks);
        } catch (error) {
            taskList.innerHTML = `
                <li class="task-item">
                    Backend server connect nahi ho raha.
                </li>
            `;
        }
    }

    taskForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = taskInput.value.trim();
        const subject = subjectInput.value;

        if (title === "") {
            alert("Task name likhein.");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    subject: subject
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            taskInput.value = "";
            subjectInput.value = "General";

            await loadTasks();
        } catch (error) {
            alert("Backend server connect nahi ho raha.");
        }
    });

    async function updateTask(taskId, completed) {
        try {
            const response = await fetch(
                `${API_URL}/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        completed: completed
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            await loadTasks();
        } catch (error) {
            alert("Task update nahi ho saka.");
        }
    }

    async function deleteTask(taskId) {
        try {
            const response = await fetch(
                `${API_URL}/${taskId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            await loadTasks();
        } catch (error) {
            alert("Task delete nahi ho saka.");
        }
    }

    loadTasks();
});