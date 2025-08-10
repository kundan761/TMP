import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        loginForm
      );
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "wrong credentials");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        registerForm
      );
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className={`auth-container ${
        isLogin ? "login-active" : "register-active"
      }`}
    >
      <div className="form-container login-container">
        <form onSubmit={handleLoginSubmit}>
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={handleLoginChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={handleLoginChange}
            required
          />
          <button type="submit">Login</button>
          <p className="switch-text">
            Don't have an account?{" "}
            <span onClick={() => setIsLogin(false)}>Register</span>
          </p>
        </form>
      </div>

      <div className="form-container register-container">
        <form onSubmit={handleRegisterSubmit}>
          <h2>Register</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={registerForm.username}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={handleRegisterChange}
            required
          />
          <button type="submit">Register</button>
          <p className="switch-text">
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Login</span>
          </p>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className={`overlay-panel ${isLogin ? "overlay-left" : "overlay-right"}`}>
            <h1>Hello, Friend!</h1>
            <p>Enter your details and start your journey</p>
            <button className="ghost" onClick={() => setIsLogin(true)}>
              Login
            </button>
          </div>
          <div className={`overlay-panel ${isLogin ? "overlay-right" : "overlay-left"}`}>
            <h1>Welcome Back!</h1>
            <p>To keep connected with us, please login</p>
            <button className="ghost" onClick={() => setIsLogin(false)}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
