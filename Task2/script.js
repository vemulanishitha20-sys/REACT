let events = [];
let editIndex = -1;

const form = document.getElementById("form");
const input = document.getElementById("eventInput");
const list = document.getElementById("eventList");
const msg = document.getElementById("msg");
const addBtn = document.getElementById("addBtn");

function showEvents() {
    list.innerHTML = "";
    events.forEach((eventName, index) => {
        list.innerHTML += `
      <li>
        <span>${eventName}</span>
        <div class="event-actions">
          <button onclick="editEvent(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteEvent(${index})">Delete</button>
        </div>
      </li>`;
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const value = input.value.trim();
    if (value === "") {
        msg.textContent = "Enter valid input";
        return;
    }
    if (editIndex === -1) events.push(value);
    else {
        events[editIndex] = value;
        editIndex = -1;
        addBtn.textContent = "Add Event";
    }
    input.value = "";
    msg.textContent = "";
    showEvents();
});

function editEvent(index) {
    input.value = events[index];
    editIndex = index;
    addBtn.textContent = "Update";
}

function deleteEvent(index) {
    events.splice(index, 1);
    showEvents();
}
