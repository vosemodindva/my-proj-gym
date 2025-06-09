import { useEffect, useState } from "react";
import axios from "../api/axios";

function Memberships() {
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    axios.get("memberships/")
      .then((res) => setMemberships(res.data))
      .catch((err) => console.log("Ошибка загрузки", err));
  }, []);

  return (
    <div>
      <h2>Абонементы</h2>
      {memberships.map((m) => (
        <div key={m.id}>
          <h3>{m.name}</h3>
          <p>{m.description}</p>
          <p>{m.price} ₽ / {m.duration_days} дней</p>
        </div>
      ))}
    </div>
  );
}

export default Memberships;
