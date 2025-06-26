import { useEffect, useState } from "react";
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

      await refreshUser();
      navigate("/profile");
    } catch (err) {
      alert("Ошибка покупки. Возможно, вы уже приобрели абонемент.");
      console.error("Произошла ошибка:", err);
    }
  };

  return (
    <div style={{
      backgroundImage: `url("/media/images/Memberships.png")`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      fontFamily: '"Montserrat", sans-serif',
      color: '#fff',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#ffeb3b',
        textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
        padding: '25px',
        background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))',
        borderRadius: '15px',
        animation: 'slideIn 1.5s ease-out',
        fontFamily: '"Montserrat", sans-serif',
      }}>Выберите абонемент</h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginTop: '50px',
        perspective: '1000px',
      }}>
        {memberships.map((m, index) => (
          <div key={m.id} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '25px',
            width: '500px',
            margin: '10px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            transition: 'transform 0.4s ease',
            transformStyle: 'preserve-3d',
            animation: `cardIn 1.${2 + index * 2}s ease-out`,
          }}
          onMouseOver={(e) => e.target.style.transform = 'rotateY(10deg) scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'rotateY(0) scale(1)'}>
            <h2 style={{
              color: '#ffeb3b',
              marginBottom: '15px',
              fontWeight: 700,
              fontFamily: '"Montserrat", sans-serif',
              overflowWrap: 'break-word',
            }}>{m.name}</h2>
            {m.description && <p style={{
              lineHeight: '1.6',
              color: '#e0e0e0',
              fontFamily: '"Montserrat", sans-serif',
              marginBottom: '10px',
              overflowWrap: 'break-word',
            }}>{m.description}</p>}
            {m.additional_info && <p style={{
              lineHeight: '1.6',
              color: '#e0e0e0',
              fontFamily: '"Montserrat", sans-serif',
              marginBottom: '10px',
              fontStyle: 'italic',
              overflowWrap: 'break-word',
            }}>{m.additional_info}</p>}
            <p style={{
              lineHeight: '1.6',
              color: '#e0e0e0',
              fontFamily: '"Montserrat", sans-serif',
              overflowWrap: 'break-word',
            }}>Длительность: {m.duration_days} дней</p>
            <button style={{
              background: '#ffeb3b',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}

            onMouseOver={(e) => e.target.style.background = '#ffd700'}
            onMouseOut={(e) => e.target.style.background = '#ffeb3b'}
            onClick={() => handleBuy(m.id)}>
              Купить
            </button>
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes cardIn {
            from { transform: rotateY(90deg) scale(0.5); opacity: 0; }
            to { transform: rotateY(0) scale(1); opacity: 1; }
          }
          @media (max-width: 768px) {
            h1 { font-size: 24px; padding: 15px; }
            div[style*="width: 400px"] { width: 100%; }
          }
        `}
      </style>
    </div>
  );
}

export default Memberships;