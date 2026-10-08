const form = document.querySelector("#note-form");
const noteText = document.querySelector("#note-text");
const category = document.querySelector("#category");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const noteList = document.querySelector("#note-list");

let notes = [];

function render() {
    noteList.textContent = "";

    const searchText = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter((note) => {
        return note.text.toLowerCase().includes(searchText);
    });

    if (searchText !== "" && filteredNotes.length === 0) {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        noteList.appendChild(message);
    }

    filteredNotes.forEach((note) => {
        const listItem = document.createElement("li");

        listItem.classList.add(`category-${note.category}`);

        const text = document.createElement("p");
        text.textContent = note.text;

        const categoryLabel = document.createElement("small");
        categoryLabel.textContent = note.category;

        const date = document.createElement("small");
        date.textContent = note.createdAt;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            notes = notes.filter((item) => item.id !== note.id);

            saveNotes();
            render();
        });

        listItem.appendChild(text);
        listItem.appendChild(categoryLabel);
        listItem.appendChild(date);
        listItem.appendChild(deleteButton);

        noteList.appendChild(listItem);
    });

    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = noteText.value.trim();

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    const note = {
        id: Date.now(),
        text: text,
        category: category.value,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);

    errorMessage.textContent = "";

    noteText.value = "";

    saveNotes();
    render();
});

searchInput.addEventListener("input", () => {
    render();
});

const savedNotes = localStorage.getItem("notes");

if (savedNotes) {
    notes = JSON.parse(savedNotes);
}

render();