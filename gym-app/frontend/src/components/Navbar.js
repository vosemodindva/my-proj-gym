// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, userInfo } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">🏋️‍♂️ Омежка</Link>

        {/* 🔽 Кнопка-гамбургер */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* 🔽 Раскрывающееся меню */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/memberships">Абонементы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/trainers">Тренеры</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events">Мероприятия</Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Профиль</Link>
                </li>

                {userInfo?.trainer_profile && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/trainer/profile">Профиль тренера</Link>
                  </li>
                )}

                {userInfo?.is_superuser && (
                  <span className="badge bg-warning text-dark ms-2">Admin</span>
                )}
                {userInfo?.is_staff && !userInfo?.is_superuser && (
                  <span className="badge bg-info text-dark ms-2">Сотрудник</span>
                )}

                <li className="nav-item">
                  <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Вход</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Регистрация</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
