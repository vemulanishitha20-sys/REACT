export default function Navbar() {
  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">Task Manager</p>
        <h1>Tasks</h1>
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
  );
}
