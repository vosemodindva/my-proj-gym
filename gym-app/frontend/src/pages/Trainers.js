import { useEffect, useState } from "react";
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessage(res.data.detail))
      .catch((err) => {
        const msg = err.response?.data?.detail || "Ошибка при отмене записи";
        setMessage(msg);
      });
  };

  return (
    <div style={{
      backgroundImage: `url('/media/images/Trainers.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      fontFamily: 'Montserrat, sans-serif',
      color: '#fff',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#ffeb3b',
        textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
        padding: '25px',
        background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))',
        borderRadius: '15px',
        animation: 'slideIn 1.5s ease-out',
        marginBottom: '30px'
      }}>Тренеры</h2>

      {message && (
        <div style={{
          background: '#2196f3',
          padding: '10px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>{message}</div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginTop: '50px',
        perspective: '1000px'
      }}>
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '25px',
              width: '280px',
              margin: '10px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              transition: 'transform 0.4s ease',
              transformStyle: 'preserve-3d',
              animation: 'zoomIn 1s ease-out',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {trainer.photo && (
              <img
                src={trainer.photo}
                alt={trainer.name}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  marginBottom: '15px'
                }}
              />
            )}
            <h3 style={{ color: '#ffeb3b', marginBottom: '10px' }}>{trainer.name}</h3>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>Стаж: {trainer.experience} лет</p>
            <p style={{ fontSize: '14px', color: '#ddd' }}>{trainer.description}</p>

            <label>Время записи:</label>
            <input
              type="datetime-local"
              value={appointmentTimes[trainer.id] || ""}
              onChange={(e) => handleInputChange(trainer.id, e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: 'none',
              }}
            />

            <button
              onClick={() => assignTrainer(trainer.id)}
              style={{
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '5px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >Записаться</button>

            <button
              onClick={() => unassignTrainer(trainer.id)}
              style={{
                background: 'transparent',
                color: '#ff5252',
                border: '1px solid #ff5252',
                padding: '8px 12px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >Отписаться</button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes zoomIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 768px) {
          h2 { font-size: 24px; padding: 15px; }
          div[style*="width: 280px"] { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

