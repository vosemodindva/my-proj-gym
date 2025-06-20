import React, { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/events/")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Ошибка загрузки мероприятий:", err));
  }, []);

  console.log("Ивенты:", events);

  return (
    <div className="container mt-4">
      <h2>Мероприятия</h2>
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
                <p className="card-text">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}