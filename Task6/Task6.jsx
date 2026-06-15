import { useMemo, useState } from "react";
import Car from "./src/components/card.jsx";
import EventList from "./src/components/eventlist.jsx";
import Navbar from "./src/components/navbar.jsx";
import Searchbar from "./src/components/searchbar.jsx";

const tabs = [
  { label: "All", value: "all" },
  { label: "In-progress", value: "in-progress" },
  { label: "Todo", value: "todo" },
  { label: "Done", value: "done" },
];

const statusOptions = [
  { label: "Todo", value: "todo" },
  { label: "In progress", value: "in-progress" },
  { label: "Done", value: "done" },
];

const initialTasks = [];

function getStatusLabel(status) {
  return statusOptions.find((option) => option.value === status)?.label;
}

export default function Task6() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskName, setTaskName] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const visibleTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesTab = activeTab === "all" || task.status === activeTab;
      const matchesSearch =
        normalizedSearch === "" ||
        task.name.toLowerCase().includes(normalizedSearch) ||
        getStatusLabel(task.status).toLowerCase().includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm, tasks]);

  const taskCounts = useMemo(
    () =>
      tasks.reduce(
        (counts, task) => ({
          ...counts,
          all: counts.all + 1,
          [task.status]: counts[task.status] + 1,
        }),
        { all: 0, todo: 0, "in-progress": 0, done: 0 }
      ),
    [tasks]
  );

  function handleSubmit(event) {
    event.preventDefault();
    const name = taskName.trim();

    if (name === "") {
      setMessage("Enter task name");
      return;
    }

    if (editingTaskId === null) {
      setTasks([...tasks, { id: Date.now(), name, status: taskStatus }]);
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, name, status: taskStatus } : task
        )
      );
      setEditingTaskId(null);
      setSelectedTaskId(null);
    }

    setTaskName("");
    setTaskStatus("todo");
    setMessage("");
  }

  function handleSelectTask(taskId) {
    setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
  }

  function handleEditTask(task) {
    setTaskName(task.name);
    setTaskStatus(task.status);
    setEditingTaskId(task.id);
    setMessage("");
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setSelectedTaskId(null);

    if (editingTaskId === taskId) {
      setEditingTaskId(null);
      setTaskName("");
      setTaskStatus("todo");
    }
  }

  function handleDeleteAll() {
    setTasks([]);
    setSelectedTaskId(null);
    setEditingTaskId(null);
    setTaskName("");
    setTaskStatus("todo");
    setMessage("");
    setShowDeleteAllConfirm(false);
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <div className={`app-shell ${theme}-theme`}>
      <main className="main-panel">
        <Navbar
          eventCount={taskCounts.all}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <section className="task-board" aria-label="Task manager">
          <div className="board-header">
            <h2>Tasks</h2>
            <div className="tab-panel">
              <div className="tabs" aria-label="Task status filters">
                {tabs.map((tab) => (
                  <button
                    className={activeTab === tab.value ? "tab active" : "tab"}
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    type="button"
                  >
                    <span>{tab.label}</span>
                    <span className="tab-count">{taskCounts[tab.value]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Car
            taskName={taskName}
            taskStatus={taskStatus}
            statusOptions={statusOptions}
            submitLabel={editingTaskId === null ? "Add task" : "Update task"}
            message={message}
            onNameChange={setTaskName}
            onStatusChange={setTaskStatus}
            onSubmit={handleSubmit}
          />

          <Searchbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <EventList
            tasks={visibleTasks}
            selectedTaskId={selectedTaskId}
            getStatusLabel={getStatusLabel}
            onDeleteAll={() => setShowDeleteAllConfirm(true)}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onSelectTask={handleSelectTask}
          />

          {showDeleteAllConfirm && (
            <div className="confirm-overlay" role="presentation">
              <div
                className="confirm-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-all-title"
              >
                <h3 id="delete-all-title">Do you want to delete all?</h3>
                <div className="confirm-actions">
                  <button
                    className="confirm-yes"
                    type="button"
                    onClick={handleDeleteAll}
                  >
                    Yes
                  </button>
                  <button
                    className="confirm-no"
                    type="button"
                    onClick={() => setShowDeleteAllConfirm(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
