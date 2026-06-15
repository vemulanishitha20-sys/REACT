export default function EventList({
  tasks,
  selectedTaskId,
  getStatusLabel,
  onDeleteAll,
  onDeleteTask,
  onEditTask,
  onSelectTask,
}) {
  return (
    <>
      <div className="list-toolbar">
        <button
          className="delete-all-btn"
          disabled={tasks.length === 0}
          onClick={onDeleteAll}
          type="button"
        >
          All delete
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="select-heading" aria-label="Select event" />
              <th>Key</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>
                  <button
                    className={
                      selectedTaskId === task.id
                        ? "select-box selected"
                        : "select-box"
                    }
                    onClick={() => onSelectTask(task.id)}
                    type="button"
                    aria-label={`Select ${task.name}`}
                  />
                </td>
                <td>{index + 1}</td>
                <td className="event-name-cell">{task.name}</td>
                <td className="status-cell">
                  <span className={`status-pill ${task.status}`}>
                    {getStatusLabel(task.status)}
                  </span>

                  {selectedTaskId === task.id && (
                    <div className="action-popup" role="dialog">
                      <button type="button" onClick={() => onEditTask(task)}>
                        Edit
                      </button>
                      <button
                        className="popup-delete"
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && <p className="empty-state">No tasks found</p>}
      </div>
    </>
  );
}
