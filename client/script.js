const API = "http://localhost:3000";

function createNote() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    fetch(API + "/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    });
}

function loadNotes() {
    fetch(API + "/notes")
    .then(res => res.json())
    .then(data => {
        document.getElementById("notes").innerHTML =
        data.map(n => `<p><b>${n.title}</b>: ${n.content}</p>`).join("");
    });
}