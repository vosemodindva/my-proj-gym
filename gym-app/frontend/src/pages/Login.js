import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("token/", form);
      login(res.data.access, res.data.refresh);
      navigate("/profile");
    } catch (err) {
      setError("Неверное имя пользователя или пароль");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('/media/images/Register.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        fontFamily: "Montserrat, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
          width: "100%",
          maxWidth: "400px",
          color: "#fff",
          animation: "fadeIn 1.2s ease-out",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#ffeb3b",
            marginBottom: "30px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
          }}
        >
          Вход в Омежку
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Имя пользователя</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
                marginTop: "5px",
              }}
            />
          </div>
          <div className="mb-3">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
                marginTop: "5px",
              }}
            />
          </div>
          {error && (
            <div className="alert alert-danger" style={{ marginTop: "15px" }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-warning"
            style={{
              width: "100%",
              marginTop: "20px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            Войти
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default Login;