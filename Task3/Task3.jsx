import { useState } from "react";

const sidebarItems = ["Home", "Add Event"];

export default function Task3() {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const value = eventName.trim();

    if (value === "") {
      setMessage("Enter valid input");
      return;
    }

    if (editIndex === -1) {
      setEvents([...events, value]);
    } else {
      const updatedEvents = [...events];
      updatedEvents[editIndex] = value;
      setEvents(updatedEvents);
      setEditIndex(-1);
    }

    setEventName("");
    setMessage("");
  }

  function handleEdit(index) {
    setEventName(events[index]);
    setEditIndex(index);
    setMessage("");
  }

  function handleDelete(index) {
    setEvents(events.filter((_, eventIndex) => eventIndex !== index));
    if (editIndex === index) {
      setEditIndex(-1);
      setEventName("");
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-title">Task 3</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {sidebarItems.map((item) => (
            <button
              className={item === "Events" ? "nav-item active" : "nav-item"}
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="navbar">
          <div>
            <p className="eyebrow">Event Manager</p>
            <h1>Events</h1>
          </div>
          <div className="user-profile" aria-label="User profile">
            <button className="user-button" type="button">
              <span className="user-icon" aria-hidden="true" />
            </button>
            <div className="user-meta">
              <span className="user-name">Nicky</span>
              <span className="user-role">Organizer</span>
            </div>
          </div>
        </header>

        <section className="content-area" aria-label="Event manager">
          <form className="event-form" onSubmit={handleSubmit}>
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
              aria-label="Event name"
            />
            <button type="submit">{editIndex === -1 ? "Add" : "Update"}</button>
          </form>

          <p className="message">{message}</p>

          <ul className="event-list">
            {events.map((event, index) => (
              <li key={`${event}-${index}`}>
                <span>{event}</span>
                <div className="event-actions">
                  <button type="button" onClick={() => handleEdit(index)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    type="button"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
