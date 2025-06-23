import React, { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [appointmentTimes, setAppointmentTimes] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/trainers/")
      .then(res => setTrainers(res.data))
      .catch(err => console.error("Ошибка загрузки тренеров", err));
  }, []);

  const handleInputChange = (trainerId, value) => {
    setAppointmentTimes(prev => ({ ...prev, [trainerId]: value }));
  };

  const assignTrainer = (trainerId) => {
    const token = localStorage.getItem("access");
    const appointment_time = appointmentTimes[trainerId];

    if (!appointment_time) {
      alert("Пожалуйста, выберите время записи");
      return;
    }

    axios
      .post(`/trainers/${trainerId}/assign/`, { appointment_time }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMessage(res.data.detail))
      .catch((err) => {
        const msg = err.response?.data?.detail || "Ошибка при записи";
        setMessage(msg);
      });
  };

  const unassignTrainer = (trainerId) => {
    const token = localStorage.getItem("access");

    axios
      .post(`/trainers/${trainerId}/unassign/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMessage(res.data.detail))
      .catch((err) => {
        const msg = err.response?.data?.detail || "Ошибка при отмене записи";
        setMessage(msg);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Тренеры</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row">
        {trainers.map(trainer => (
          <div key={trainer.id} className="col-md-4">
            <div className="card mb-3">
              {trainer.photo && (
                <img
                  src={trainer.photo}
                  className="card-img-top"
                  alt={trainer.name}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{trainer.name}</h5>
                <p className="card-text">Стаж: {trainer.experience} лет</p>
                <p className="card-text">{trainer.description}</p>

                <label>Время записи:</label>
                <input
                  type="datetime-local"
                  className="form-control mb-2"
                  value={appointmentTimes[trainer.id] || ""}
                  onChange={(e) => handleInputChange(trainer.id, e.target.value)}
                />

                <button
                  className="btn btn-success me-2"
                  onClick={() => assignTrainer(trainer.id)}
                >
                  Записаться
                </button>

                <button
                  className="btn btn-outline-danger"
                  onClick={() => unassignTrainer(trainer.id)}
                >
                  Отписаться
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}