// Use relative path - works with any IP
const API = "";

// ========== TEXT NOTES ==========
function createNote() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (!title || !content) {
        alert("Please fill in both title and content");
        return;
    }

    fetch(API + "/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    }).then(() => {
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
        loadNotes();
    }).catch(err => console.error("Error creating note:", err));
}

function loadNotes() {
    fetch(API + "/notes")
        .then(res => res.json())
        .then(data => {
            const notesDiv = document.getElementById("notes");
            if (!notesDiv) return;
            
            if (data.length === 0) {
                notesDiv.innerHTML = "<p>No notes yet. Create one!</p>";
                return;
            }
            
            notesDiv.innerHTML = data.map(n => 
                `<div class="note">
                    <b>${escapeHtml(n.title)}</b>
                    <p>${escapeHtml(n.content)}</p>
                 </div>`
            ).join("");
        })
        .catch(err => {
            console.error("Error loading notes:", err);
            document.getElementById("notes").innerHTML = "<p>Error loading notes. Make sure server is running.</p>";
        });
}

// ========== TODO LISTS ==========
function addTaskField() {
    const container = document.getElementById("tasksContainer");
    const taskCount = container.querySelectorAll(".taskText").length + 1;
    
    const newTask = document.createElement("input");
    newTask.className = "taskText";
    newTask.placeholder = "Task " + taskCount;
    
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
    
    if (!title) {
        alert("Please enter a todo title");
        return;
    }
    
    const tasks = [];
    for (let i = 0; i < taskInputs.length; i++) {
        if (taskInputs[i].value.trim()) {
            tasks.push({
                text: taskInputs[i].value,
                completed: taskChecks[i] ? taskChecks[i].checked : false
            });
        }
    }
    
    if (tasks.length === 0) {
        alert("Please add at least one task");
        return;
    }

    fetch(API + "/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tasks })
    }).then(() => {
        document.getElementById("todoTitle").value = "";
        document.getElementById("tasksContainer").innerHTML = `
            <input class="taskText" placeholder="Task 1">
            <input type="checkbox" class="taskCompleted"> Completed
            <br>
        `;
        loadTodos();
    }).catch(err => console.error("Error creating todo:", err));
}

function loadTodos() {
    fetch(API + "/todos")
        .then(res => res.json())
        .then(data => {
            const todosDiv = document.getElementById("todos");
            if (!todosDiv) return;
            
            if (data.length === 0) {
                todosDiv.innerHTML = "<p>No todos yet. Create one!</p>";
                return;
            }
            
            todosDiv.innerHTML = data.map(todo => `
                <div class="todo">
                    <h3>${escapeHtml(todo.title)}</h3>
                    <ul>
                        ${todo.tasks.map(task => `
                            <li class="${task.completed ? 'completed' : ''}">
                                <input type="checkbox" ${task.completed ? 'checked' : ''} disabled>
                                ${escapeHtml(task.text)}
                            </li>
                        `).join("")}
                    </ul>
                </div>
            `).join("");
        })
        .catch(err => {
            console.error("Error loading todos:", err);
            document.getElementById("todos").innerHTML = "<p>Error loading todos. Make sure server is running.</p>";
        });
}

// Helper function to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Load data when page loads
window.onload = () => {
    console.log("Page loaded, fetching data...");
    loadNotes();
    loadTodos();
};