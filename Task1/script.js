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
        <span>${eventName}</span><br>
        <button onclick="editEvent(${index})">Edit</button>
        <button onclick="deleteEvent(${index})">Delete</button>
      </li>`;
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = input.value;
  if (value.trim() === "") {
    msg.textContent = "Please enter an event name";
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
