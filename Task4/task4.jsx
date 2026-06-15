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

export default function Task4() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskName, setTaskName] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [message, setMessage] = useState("");

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
  }

  return (
    <div className="app-shell">
      <main className="main-panel">
        <Navbar />

        <section className="task-board" aria-label="Task manager">
          <div className="board-header">
            <h2>Tasks</h2>
            <div className="tabs" aria-label="Task status filters">
              {tabs.map((tab) => (
                <button
                  className={activeTab === tab.value ? "tab active" : "tab"}
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <Searchbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

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

          <EventList
            tasks={visibleTasks}
            selectedTaskId={selectedTaskId}
            getStatusLabel={getStatusLabel}
            onDeleteAll={handleDeleteAll}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onSelectTask={handleSelectTask}
          />
        </section>
      </main>
    </div>
  );
}
