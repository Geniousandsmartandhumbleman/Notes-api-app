const API = "http://localhost:3000";

// ========== TEXT NOTES ==========
function createNote() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    fetch(API + "/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    }).then(() => {
        // Removed alert
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
        loadNotes(); // Auto-refresh notes after adding
    });
}

function loadNotes() {
    fetch(API + "/notes")
        .then(res => res.json())
        .then(data => {
            document.getElementById("notes").innerHTML = data.map(n => 
                `<div class="note">
                    <b>${n.title}</b>
                    <p>${n.content}</p>
                 </div>`
            ).join("");
        })
        .catch(err => console.error("Error:", err));
}

// ========== TODO LISTS ==========
function addTaskField() {
    const container = document.getElementById("tasksContainer");
    const taskCount = container.children.length / 2 + 1;
    const newTask = document.createElement("input");
    newTask.className = "taskText";
    newTask.placeholder = `Task ${taskCount}`;
    const newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.className = "taskCompleted";
    container.appendChild(newTask);
    container.appendChild(document.createElement("br"));
    container.appendChild(newCheckbox);
    container.appendChild(document.createTextNode(" Completed"));
    container.appendChild(document.createElement("br"));
}

function createTodo() {
    const title = document.getElementById("todoTitle").value;
    const taskInputs = document.querySelectorAll(".taskText");
    const taskChecks = document.querySelectorAll(".taskCompleted");
    
    const tasks = [];
    for (let i = 0; i < taskInputs.length; i++) {
        if (taskInputs[i].value.trim()) {
            tasks.push({
                text: taskInputs[i].value,
                completed: taskChecks[i] ? taskChecks[i].checked : false
            });
        }
    }

    fetch(API + "/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tasks })
    }).then(() => {
        // Removed alert
        document.getElementById("todoTitle").value = "";
        document.getElementById("tasksContainer").innerHTML = `
            <input class="taskText" placeholder="Task 1">
            <input type="checkbox" class="taskCompleted"> Completed
        `;
        loadTodos(); // Auto-refresh todos after adding
    });
}

function loadTodos() {
    fetch(API + "/todos")
        .then(res => res.json())
        .then(data => {
            document.getElementById("todos").innerHTML = data.map(todo => `
                <div class="todo">
                    <h3>${todo.title}</h3>
                    <ul>
                        ${todo.tasks.map(task => `
                            <li class="${task.completed ? 'completed' : ''}">
                                <input type="checkbox" ${task.completed ? 'checked' : ''} disabled>
                                ${task.text}
                            </li>
                        `).join("")}
                    </ul>
                </div>
            `).join("");
        })
        .catch(err => console.error("Error:", err));
}

// Load data when page loads
window.onload = () => {
    loadNotes();
    loadTodos();
};