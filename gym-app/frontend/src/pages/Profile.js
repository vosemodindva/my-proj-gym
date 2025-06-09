import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { userInfo, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (!userInfo) {
    return (
      <div className="container mt-4">
        <p>Загрузка данных пользователя...</p>
      </div>
    );
  }

  const { username, email, is_superuser, is_staff, membership } = userInfo;

  return (
    <div className="container mt-4">
      <h2>Профиль</h2>
      <p><strong>Имя пользователя:</strong> {username}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Роль:</strong> {is_superuser ? "Админ" : is_staff ? "Сотрудник" : "Пользователь"}</p>

      {membership ? (
        <>
          <p><strong>Абонемент:</strong> {membership.name}</p>
          <p><strong>Срок действия:</strong> {membership.duration_days} дней</p>
        </>
      ) : (
        <p><em>У вас нет активного абонемента.</em></p>
      )}
    </div>
  );
}

export default Profile;