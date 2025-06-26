import { useEffect, useState } from "react";
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

  if (!profile) return <p style={{ color: "#fff", textAlign: "center" }}>Загрузка профиля...</p>;

  return (
    <div
      style={{
        backgroundImage: `url("/media/images/glav.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        fontFamily: '"Montserrat", sans-serif',
        color: "#fff",
        padding: "40px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "30px",
          maxWidth: "800px",
          margin: "auto",
          animation: "fadeIn 1.5s ease-out",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#ffeb3b",
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.8)",
            marginBottom: "25px",
          }}
        >
          Профиль тренера
        </h2>

        {profile.photo_url && (
          <div style={{ textAlign: "center" }}>
            <img
              src={profile.photo_url}
              alt="Фото тренера"
              width={200}
              style={{ borderRadius: "10px", marginBottom: "10px" }}
            />
            <br />
            <button
              style={{
                marginTop: "10px",
                backgroundColor: "#ff5252",
                color: "#fff",
                padding: "6px 12px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleDeletePhoto}
            >
              Удалить фото
            </button>
          </div>
        )}

        <p><strong>Имя:</strong> {profile.name}</p>
        <p><strong>Стаж:</strong> {profile.experience_years} лет</p>
        <p><strong>Описание:</strong> {profile.description}</p>
        <p><strong>Клиентов:</strong> {profile.client_count}</p>

        <h3 style={{ marginTop: "20px" }}>Клиенты</h3>
        {Array.isArray(profile.clients) && profile.clients.length > 0 ? (
          <table style={{
            width: "100%",
            backgroundColor: "#222",
            borderCollapse: "collapse",
            marginTop: "10px",
            color: "#fff",
          }}>
            <thead style={{ backgroundColor: "#333" }}>
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
                      style={{
                        backgroundColor: "#e53935",
                        color: "#fff",
                        padding: "4px 8px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
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

        <h3 style={{ marginTop: "30px" }}>Редактировать профиль</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Имя"
            style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px" }}
          />
          <input
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Стаж (в годах)"
            type="number"
            style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px" }}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Описание"
            rows={4}
            style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px" }}
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
          />
          <br />
          <button
            type="submit"
            style={{
              backgroundColor: "#4caf50",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Сохранить
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TrainerProfile;
