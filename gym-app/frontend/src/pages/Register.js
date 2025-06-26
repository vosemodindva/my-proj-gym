import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("register/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/profile");
    } catch (err) {
      setError("Ошибка регистрации");
      console.error("Регистрация не удалась:", err.response);
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
          Регистрация
        </h2>
        {error && (
          <div
            style={{
              background: "#f44336",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Имя пользователя"
            value={form.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="phone"
            placeholder="Телефон"
            value={form.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
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
            Зарегистрироваться
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

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  marginBottom: "15px",
  background: "rgba(255, 255, 255, 0.8)",
  fontSize: "16px",
};

