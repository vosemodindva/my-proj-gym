import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    description: "",
    photo: null,
  });

  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get("/api/trainers/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setFormData({
          name: res.data.name || "",
          experience: res.data.experience || "",
          description: res.data.description || "",
          photo: null,
        });
      })
      .catch((error) => {
        console.error("Ошибка при загрузке профиля тренера:", error);
      });
  }, []);

  const handleRemoveClient = (clientId) => {
    if (!window.confirm("Удалить этого клиента?")) return;

    axios
      .post(
        `/api/trainers/remove_client/`,
        { client_id: clientId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Клиент удален");
        setProfile((prev) => ({
          ...prev,
          clients: prev.clients.filter((c) => c.client.id !== clientId),
          client_count: prev.client_count - 1,
        }));
      })
      .catch(() => {
        alert("Ошибка при удалении клиента");
      });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        alert("Максимальный размер фото — 5MB");
        return;
      }
      setFormData({ ...formData, photo: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("experience", formData.experience);
    data.append("description", formData.description);
    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    axios
      .put("/api/trainers/me/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        alert("Профиль обновлен!");
        setProfile(res.data);
      });
  };

  const handleDeletePhoto = () => {
    const data = new FormData();
    data.append("photo", "");

    axios
      .put("/api/trainers/me/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Фото удалено");
        window.location.reload();
      });
  };

  if (!profile) return <p>Загрузка профиля...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Профиль тренера</h2>

      {profile.photo_url && (
        <div>
          <img
            src={profile.photo_url}
            alt="Фото тренера"
            width={200}
            style={{ borderRadius: "8px" }}
          />
          <br />
          <button
            style={{ marginTop: "10px", backgroundColor: "tomato", color: "white" }}
            onClick={handleDeletePhoto}
          >
            Удалить фото
          </button>
        </div>
      )}

      <p><strong>Имя:</strong> {profile.name}</p>
      <p><strong>Стаж:</strong> {profile.experience_years}</p>
      <p><strong>Описание:</strong> {profile.description}</p>
      <p><strong>Клиентов:</strong> {profile.client_count}</p>

      <h3>Клиенты</h3>
      {Array.isArray(profile.clients) && profile.clients.length > 0 ? (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Время</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {profile.clients.map((c, index) => (
              <tr key={index}>
                <td>{c.client.username}</td>
                <td>{c.client.email}</td>
                <td>{new Date(c.appointment_time).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveClient(c.client.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Нет клиентов</p>
      )}

      <h3>Редактировать профиль</h3>
      <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Имя"
        />
        <br />
        <input
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Стаж (в годах)"
          type="number"
        />
        <br />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Описание"
          rows={4}
          cols={40}
        />
        <br />
        <input type="file" name="photo" accept="image/*" onChange={handleChange} />
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>Сохранить</button>
      </form>
    </div>
  );
};

export default TrainerProfile;