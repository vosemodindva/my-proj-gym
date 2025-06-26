import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [ageFilter, setAgeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchEvents = async () => {
    let query = "";
    if (ageFilter) query += `age_limit=${ageFilter}&`;
    if (dateFilter) query += `date=${dateFilter}&`;

    try {
      const res = await axios.get(`/events/?${query}`);
      setEvents(res.data);
    } catch (err) {
      console.error("Ошибка загрузки мероприятий:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [ageFilter, dateFilter]);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Мероприятия</h2>

      {/* Фильтры */}
      <div style={styles.filters}>
        <div style={styles.filterBlock}>
          <label style={styles.label}>Возрастное ограничение:</label>
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">Все</option>
            <option value="12">12+</option>
            <option value="16">16+</option>
            <option value="18">18+</option>
          </select>
        </div>

        <div style={styles.filterBlock}>
          <label style={styles.label}>Дата:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={styles.input}
          />
        </div>

        <button
          style={styles.resetBtn}
          onClick={() => {
            setAgeFilter("");
            setDateFilter("");
          }}
        >
          Сбросить фильтры
        </button>
      </div>

      
      <div style={styles.cards}>
        {events.map((event) => (
          <div key={event.id} style={styles.card}>
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                style={styles.image}
              />
            )}
            <h3 style={styles.cardTitle}>{event.title}</h3>
            <p>Дата: {event.date}</p>
            <p>Возраст: {event.age_limit}+</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @media (max-width: 768px) {
            h2 { font-size: 20px; }
            div[style*="width: 300px"] { width: 100% !important; }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  page: {
    backgroundImage: `url("/media/images/Events.jpg")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    fontFamily: '"Montserrat", sans-serif',
    color: '#fff',
    padding: '40px',
    overflowX: 'hidden',
  },
  title: {
    textAlign: 'center',
    fontSize: '36px',
    color: '#ffeb3b',
    textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
    marginBottom: '40px',
    animation: 'fadeInUp 1s ease-out',
  },
  filters: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  filterBlock: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '160px',
  },
  label: {
    marginBottom: '6px',
  },
  select: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
  },
  input: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
  },
  resetBtn: {
    backgroundColor: '#ffeb3b',
    color: '#000',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 'auto',
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '25px',
    width: '300px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    animation: 'fadeInUp 0.8s ease-out',
  },
  image: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  cardTitle: {
    color: '#ffeb3b',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};
