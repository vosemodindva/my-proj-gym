import { useNavigate } from 'react-router-dom'
export default function Home() {
  const navigate = useNavigate();
  return (
    <div style={{
      backgroundImage: `url('/images/glav.jpg')`,
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
      }}>Добро пожаловать в тренажёрный зал "Омежка"</h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginTop: '50px',
        perspective: '1000px',
      }}>
        <div style={{
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
          animation: 'rotateIn 1.2s ease-out',
        }}
        onMouseOver={(e) => e.target.style.transform = 'rotateY(10deg) scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'rotateY(0) scale(1)'}>
          <h2 style={{ 
            color: '#ffeb3b', 
            marginBottom: '15px', 
            fontWeight: 700, 
            fontFamily: '"Montserrat", sans-serif' 
          }}>О нас</h2>
          <p style={{ 
            lineHeight: '1.6', 
            color: '#e0e0e0', 
            fontFamily: '"Montserrat", sans-serif' 
          }}>Самый лучший тренажёрный зал города. Новейшие тренажёры и лучшие тренеры.</p>
        </div>
        <div style={{
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
          animation: 'slideUp 1.4s ease-out',
        }}
        onMouseOver={(e) => e.target.style.transform = 'translateY(-10px) scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'translateY(0) scale(1)'}>
          <h2 style={{ 
            color: '#ffeb3b', 
            marginBottom: '15px', 
            fontWeight: 700, 
            fontFamily: '"Montserrat", sans-serif' 
          }}>Тренировки</h2>
          <p style={{ 
            lineHeight: '1.6', 
            color: '#e0e0e0', 
            fontFamily: '"Montserrat", sans-serif' 
          }}>Подберите себе тренера, на ваше предпочтение.</p>
            <button
              onClick={() => navigate('/trainers')}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#ffeb3b',
                border: 'none',
                borderRadius: '10px',
                color: '#000',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#fff176'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ffeb3b'}
            >
              Выбрать тренера
            </button>
        </div>
        <div style={{
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
          animation: 'zoomIn 1.6s ease-out',
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
          <h2 style={{ 
            color: '#ffeb3b', 
            marginBottom: '15px', 
            fontWeight: 700, 
            fontFamily: '"Montserrat", sans-serif' 
          }}>Расписание</h2>
          <p style={{ 
            lineHeight: '1.6', 
            color: '#e0e0e0', 
            fontFamily: '"Montserrat", sans-serif' 
          }}>Проверьте расписание групповых занятий.</p>
          <button
            onClick={() => navigate('/events')}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#ffeb3b',
              border: 'none',
              borderRadius: '10px',
              color: '#000',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#fff176'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffeb3b'}
          >
            Ознакомиться
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes rotateIn {
            from { transform: rotateY(90deg) scale(0.5); opacity: 0; }
            to { transform: rotateY(0) scale(1); opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @media (max-width: 768px) {
            h1 { font-size: 24px; padding: 15px; }
            div[style*="width: 280px"] { width: 100%; }
          }
        `}
      </style>
    </div>
  );
}