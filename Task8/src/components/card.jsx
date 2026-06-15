export default function Car({
  taskName,
  taskStatus,
  statusOptions,
  submitLabel,
  message,
  onNameChange,
  onStatusChange,
  onSubmit,
}) {
  return (
    <>
      <form className="task-form" onSubmit={onSubmit}>
        <input
          value={taskName}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Task name"
          aria-label="Task name"
        />
        <select
          value={taskStatus}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Task status"
        >
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <button type="submit">{submitLabel}</button>
      </form>

      <p className="message">{message}</p>
    </>
  );
}
