import { Link } from "react-router-dom";

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav>
      <Link to="/">Главная</Link> |{" "}
      <Link to="/memberships">Абонементы</Link> |{" "}
      <Link to="/trainers">Тренеры</Link> |{" "}
      {isAuthenticated ? (
        <>
          <Link to="/profile">Профиль</Link> |{" "}
          <button onClick={onLogout}>Выход</button>
        </>
      ) : (
        <>
          <Link to="/login">Вход</Link> | <Link to="/register">Регистрация</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;