import React, { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    axios.get("/trainers/")
      .then(res => setTrainers(res.data))
      .catch(err => console.error("Ошибка загрузки тренеров", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Тренеры</h2>
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
                <p className="card-text">{trainer.bio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}