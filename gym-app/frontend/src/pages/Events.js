import React, { useEffect, useState } from "react";
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
    <div className="container mt-4">
      <h2>Мероприятия</h2>

      {/* 🔽 Фильтры */}
      <div className="row mb-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Возрастное ограничение:</label>
          <select
            className="form-select"
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <option value="">Все</option>
            <option value="12">12+</option>
            <option value="16">16+</option>
            <option value="18">18+</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Дата:</label>
          <input
            type="date"
            className="form-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-secondary mt-2"
            onClick={() => {
              setAgeFilter("");
              setDateFilter("");
            }}
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      {/* 🎫 Список ивентов */}
      <div className="row">
        {events.map((event) => (
          <div key={event.id} className="col-md-4 mb-3">
            <div className="card h-100">
              {event.image && (
                <img
                  src={event.image}
                  className="card-img-top"
                  alt={event.title}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">Дата: {event.date}</p>
                <p className="card-text">Возраст: {event.age_limit}+</p>
                <p className="card-text">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}