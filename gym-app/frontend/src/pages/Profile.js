import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { userInfo, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (!userInfo) {
    return (
      <div style={{
        backgroundImage: `url('/media/images/glav.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        fontFamily: '"Montserrat", sans-serif',
        color: '#fff',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px 40px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          textAlign: 'center',
        }}>
          <p>Загрузка данных пользователя...</p>
        </div>
      </div>
    );
  }

  const { username, email, is_superuser, is_staff, membership } = userInfo;

  return (
    <div style={{
      backgroundImage: `url("/media/images/glav.jpg")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      fontFamily: '"Montserrat", sans-serif',
      color: '#fff',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        textAlign: 'left',
        animation: 'slideIn 1.2s ease-out'
      }}>
        <h2 style={{
          color: '#ffeb3b',
          marginBottom: '25px',
          fontWeight: 700,
          textAlign: 'center'
        }}>Профиль</h2>
        <p><strong>Имя пользователя:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Роль:</strong> {is_superuser ? "Админ" : is_staff ? "Сотрудник" : "Пользователь"}</p>
        {membership ? (
          <>
            <p><strong>Абонемент:</strong> {membership.name}</p>
            <p><strong>Срок действия:</strong> {membership.duration_days} дней</p>
          </>
        ) : (
          <p><em>У вас нет активного абонемента.</em></p>
        )}
      </div>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @media (max-width: 768px) {
            h2 { font-size: 20px; }
            p { font-size: 14px; }
            div[style*="maxWidth: 500px"] { padding: 20px; }
          }
        `}
      </style>
    </div>
  );
}

export default Profile;
