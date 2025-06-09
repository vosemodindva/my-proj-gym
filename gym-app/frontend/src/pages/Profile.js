import { useEffect, useState } from "react";
import axios from "../api/axios";

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios.get("profile/")
      .then((res) => setUserData(res.data))
      .catch((err) => console.error("Ошибка загрузки профиля", err));
  }, []);

  if (!userData) return <p>Загрузка...</p>;

  return (
    <div>
      <h2>Профиль пользователя</h2>
      <p><strong>Имя:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Телефон:</strong> {userData.phone || "не указан"}</p>
      <p><strong>Роль:</strong> {userData.is_superuser ? "Администратор" : userData.is_staff ? "Сотрудник" : "Пользователь"}</p>

      {userData.membership ? (
        <div>
          <h3>Абонемент</h3>
          <p><strong>Название:</strong> {userData.membership.name}</p>
          <p><strong>Длительность:</strong> {userData.membership.duration_days} дней</p>
        </div>
      ) : (
        <p>У вас нет активного абонемента.</p>
      )}
    </div>
  );
}

export default Profile;