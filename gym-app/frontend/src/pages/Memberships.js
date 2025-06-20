import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Memberships() {
  const [memberships, setMemberships] = useState([]);
  const { access, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/memberships/")
      .then((res) => setMemberships(res.data))
      .catch((err) => console.error("Ошибка загрузки абонементов", err));
  }, []);

  const handleBuy = async (id) => {
  if (!access) return navigate("/login");

  try {
    await axios.post(`/memberships/buy/${id}/`, {}, {
      headers: { Authorization: `Bearer ${access}` },
    });

    await refreshUser(); // ⬅️ обновляем userInfo в AuthContext
    navigate("/profile"); // ⬅️ переходим на профиль
  } catch (err) {
    alert("Ошибка покупки. Возможно, вы уже приобрели абонемент.");
  }
};

  return (
    <div className="container mt-4">
      <h2>Абонементы</h2>
      <div className="row">
        {memberships.map((m) => (
          <div key={m.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{m.name}</h5>
                <p className="card-text">Описание: {m.description}</p>
                <p className="card-text">Длительность: {m.duration_days} дней</p>
                <p className="card-text">Цена: {m.price} ₽</p>
                <button className="btn btn-primary" onClick={() => handleBuy(m.id)}>
                  Купить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Memberships;