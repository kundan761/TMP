import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    assignedTo: ""
  });
  
  const navigate = useNavigate();
  // Axios instance with token
  const authAxios = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` }
  });

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await authAxios.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all users (for assignment dropdown)
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

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAxios.post("/tasks/create-task", form);
      setForm({ title: "", description: "", dueDate: "", priority: "Low", status: "Todo", assignedTo: "" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome {user?.username}</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Create Task</h3>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
          <option value="">-- Assign to --</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>{u.username}</option>
          ))}
        </select>
        <button type="submit">Add Task</button>
      </form>

      <h3>My Tasks</h3>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <b>{task.title}</b> - {task.status} - {task.dueDate} - {task.priority} - Assigned to: {task.assignedTo?.username  || "None"}
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;