import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    status: "Todo",
    assignedTo: "",
  });
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const authAxios = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchTasks = async () => {
    try {
      const res = await authAxios.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await authAxios.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAxios.post("/tasks/create-task", form);
      setForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        status: "Todo",
        assignedTo: "",
      });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await authAxios.delete(`/tasks/delete-task/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const updatedStatus = destination.droppableId;

    try {
      const task = tasks.find((t) => t._id === draggableId);
      await authAxios.put(`/tasks/update-task/${draggableId}`, {
        ...task,
        status: updatedStatus,
        assignedTo: task.assignedTo?._id || "",
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = {
    Todo: tasks.filter((t) => t.status === "Todo"),
    "In Progress": tasks.filter((t) => t.status === "In Progress"),
    Done: tasks.filter((t) => t.status === "Done"),
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <strong className="welcome">
          Tracko
        </strong>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Create Task Button */}
      <div className="toolbar">
        <h3 className="welcome">
          <i> Welcome {(user?.username).slice(0,1).toUpperCase() + (user?.username).slice(1)},</i>
        </h3>
        <button className="create-btn" onClick={() => setShowForm(true)}>
          + Create Task
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Task</h3>
            <form onSubmit={handleSubmit} className="task-form">
              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
              >
                <option value="">-- Assign to --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username}
                  </option>
                ))}
              </select>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jira-like Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {Object.entries(columns).map(([status, tasks]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  className="kanban-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h4>{status}</h4>
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={`task-card priority-${task.priority.toLowerCase()}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h4 className="task-title">{task.title}</h4>
                          <p className="task-desc">{task.description}</p>
                          <div className="task-meta">
                            <span>
                              Assigned:{" "}
                              {task?.updatedAt
                                ? new Date(task?.updatedAt).toLocaleDateString()
                                : "N/A"}
                            </span>
                            <span>
                              Due:{" "}
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "N/A"}
                            </span>
                            <span>
                              Assign To:{" "}
                              {task?.assignedTo
                                ? task?.assignedTo?.username.charAt(0).toUpperCase() + task?.assignedTo?.username.slice(1)
                                : "Unassigned"}
                            </span>
                          </div>
                          <button
                            id="delete-btn"
                            onClick={() => handleDelete(task._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
