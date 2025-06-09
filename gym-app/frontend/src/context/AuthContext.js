import { createContext, useContext, useState } from "react";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(localStorage.getItem("access") || null);
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh") || null);
  const [userInfo, setUserInfo] = useState(null);

  const login = async (accessToken, refreshToken) => {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);
    setAccess(accessToken);
    setRefresh(refreshToken);

    try {
      const res = await axios.get("/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUserInfo(res.data);
    } catch (err) {
      console.error("Не удалось загрузить профиль:", err);
      setUserInfo(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAccess(null);
    setRefresh(null);
    setUserInfo(null);
  };

  const refreshUser = async () => {
  if (!access) return;
  try {
    const res = await axios.get("/profile/", {
      headers: { Authorization: `Bearer ${access}` },
    });
    setUserInfo(res.data);
  } catch (err) {
    console.error("Ошибка обновления профиля", err);
  }
  };

  const refreshAccessToken = async () => {
  try {
    const res = await axios.post("/token/refresh/", {
      refresh: refresh,
    });
    localStorage.setItem("access", res.data.access);
    setAccess(res.data.access);
    await refreshUser(); // обновим userInfo тоже
  } catch (err) {
    console.warn("❌ Ошибка обновления токена, выходим");
    logout(); // если refresh невалиден
  }
  };

  useEffect(() => {
  if (!access) return;

  try {
    const decoded = jwt_decode(access);
    const exp = decoded.exp * 1000; // время истечения в ms
    const now = Date.now();
    const delay = exp - now - 10_000; // обновим за 10 секунд до

    if (delay > 0) {
      const timer = setTimeout(refreshAccessToken, delay);
      return () => clearTimeout(timer);
    } else {
      // токен уже истёк
      refreshAccessToken();
    }
  } catch (err) {
    console.error("Ошибка декодирования access-токена:", err);
    logout();
  }
  }, [access]);

  const isAuthenticated = !!access;

  return (
    <AuthContext.Provider value={{ access, refresh, isAuthenticated, login, logout, userInfo, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}