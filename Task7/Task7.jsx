import { useMemo, useState } from "react";
import Car from "./src/components/card.jsx";
import EventList from "./src/components/eventlist.jsx";
import Navbar from "./src/components/navbar.jsx";
import Products from "./src/components/products.jsx";
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

export default function Task7() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskName, setTaskName] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [activeTab, setActiveTab] = useState("all");
  const [activePage, setActivePage] = useState("tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

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

  function handleAddToCart(product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }

  function handleDeleteCartItem(productId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function cartTotal() {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  return (
    <div className={`app-shell ${theme}-theme`}>
      <main className="main-panel">
        <Navbar
          activePage={activePage}
          eventCount={taskCounts.all}
          theme={theme}
          onShowProducts={() => setActivePage("products")}
          onShowTasks={() => setActivePage("tasks")}
          onToggleTheme={toggleTheme}
        />

        {activePage === "tasks" ? (
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
        ) : (
          <Products onAddToCart={handleAddToCart} />
        )}

        {activePage === "products" && (
          <button
            className="cart-floating-btn"
            type="button"
            onClick={() => setShowCart(true)}
          >
            Cart
            <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
          </button>
        )}

        {showCart && (
          <div className="cart-overlay" role="presentation">
            <aside
              className="cart-popup"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
            >
              <div className="cart-header">
                <h3 id="cart-title">Cart</h3>
                <button
                  className="cart-close"
                  type="button"
                  onClick={() => setShowCart(false)}
                  aria-label="Close cart"
                >
                  x
                </button>
              </div>

              {cartItems.length === 0 ? (
                <p className="empty-state">No products added</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <article className="cart-item" key={item.id}>
                        <img
                          src={item.images?.[0] || item.thumbnail}
                          alt={item.title}
                        />
                        <div>
                          <h4>{item.title}</h4>
                          <p>
                            ${item.price} x {item.quantity}
                          </p>
                        </div>
                        <button
                          className="cart-item-delete"
                          type="button"
                          onClick={() => handleDeleteCartItem(item.id)}
                        >
                          Delete
                        </button>
                      </article>
                    ))}
                  </div>
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>${cartTotal().toFixed(2)}</strong>
                  </div>
                </>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
