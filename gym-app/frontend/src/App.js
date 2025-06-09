import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Memberships from "./pages/Memberships";
import Trainers from "./pages/Trainers";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/">Омежка</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/memberships">Абонементы</Link>
          <Link className="nav-link" to="/trainers">Тренеры</Link>
          <Link className="nav-link" to="/profile">Профиль</Link>
          <Link className="nav-link" to="/login">Вход</Link>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/trainers" element={<Trainers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;