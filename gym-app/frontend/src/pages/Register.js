import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("register/", form);
      localStorage.setItem("refresh", res.data.refresh);
      onRegister(res.data.access);
      navigate("/profile");
    } catch {
      alert("Ошибка регистрации");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      <input name="username" placeholder="Логин" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="phone" placeholder="Телефон" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Пароль"
        onChange={handleChange}
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}

export default Register;