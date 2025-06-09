import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("token/", form);
      localStorage.setItem("refresh", res.data.refresh);
      onLogin(res.data.access);
      navigate("/profile");
    } catch {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вход</h2>
      <input name="username" placeholder="Логин" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Пароль"
        onChange={handleChange}
      />
      <button type="submit">Войти</button>
    </form>
  );
}

export default Login;