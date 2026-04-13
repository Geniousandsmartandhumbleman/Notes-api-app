const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const DB = "data.json";

// Read data from JSON file
function readData() {
    try {
        const data = JSON.parse(fs.readFileSync(DB));
        // Ensure both arrays exist
        if (!data.notes) data.notes = [];
        if (!data.todos) data.todos = [];
        return data;
    } catch {
        return { notes: [], todos: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// POST /notes - Create a text note
app.post("/notes", (req, res) => {
    const data = readData();

    const newNote = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content
    };

    data.notes.push(newNote);
    writeData(data);

    res.json({ message: "Note added", note: newNote });
});

// GET /notes - Get all text notes
app.get("/notes", (req, res) => {
    const data = readData();
    res.json(data.notes);
});

// POST /todos - Create a todo list
app.post("/todos", (req, res) => {
    const data = readData();

    const newTodo = {
        id: Date.now(),
        title: req.body.title,
        tasks: req.body.tasks || []
    };

    data.todos.push(newTodo);
    writeData(data);

    res.json({ message: "Todo added", todo: newTodo });
});

// GET /todos - Get all todo lists
app.get("/todos", (req, res) => {
    const data = readData();
    res.json(data.todos);
});

app.listen(3000, () => {
    console.log("Server running on http://0.0.0.0:3000");
});