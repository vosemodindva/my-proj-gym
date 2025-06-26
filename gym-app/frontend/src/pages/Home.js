import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: `url('/media/images/glav.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        fontFamily: 'Montserrat, sans-serif',
        color: '#fff',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#ffeb3b',
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
          padding: '25px',
          background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))',
          borderRadius: '15px',
          animation: 'slideIn 1.5s ease-out',
        }}
      >
        Добро пожаловать в тренажёрный зал "Омежка"
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginTop: '50px',
          perspective: '1000px',
        }}
      >
        {[
          {
            title: "Абонемент",
            description: "Здесь вы можете приобрести абонемент на удобный срок по выгодной цене.",
            key: "abonement",
            button: {
              text: "Купить абонемент",
              onClick: () => navigate('/memberships') 
            },
          },
          {
            title: "Тренировки",
            description: "Выбирайте индивидуальные или групповые тренировки под руководством профессиональных тренеров.",
            key: "trainings",
            button: {
              text: "Выбрать тренера",
              onClick: () => navigate('/trainers'),
            },
          },
          {
            title: "Расписание",
            description: "Следите за актуальным расписанием тренировок и мероприятий нашего зала.",
            key: "schedule",
            button: {
              text: "Ознакомиться",
              onClick: () => navigate('/events'),
            },
          },
        ].map((section) => (
          <div
            key={section.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '25px',
                  width: '280px',
                  margin: '10px',
                  height: '360px', 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  transition: 'transform 0.4s ease',
                  transformStyle: 'preserve-3d',
                  animation: 'zoomIn 1s ease-out',
                }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <h2 style={{ color: '#ffeb3b', marginBottom: '15px', fontWeight: 700 }}>{section.title}</h2>
            <p style={{ lineHeight: '1.6', color: '#e0e0e0' }}>{section.description}</p>
            {section.button && (
              <button
                onClick={section.button.onClick}
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
                {section.button.text}
              </button>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '25px',
          width: '100%',
          margin: '40px auto 0',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          textAlign: 'center',
          animation: 'fadeIn 2s ease-out',
        }}
      >
        <h2
          style={{
            color: '#ffeb3b',
            fontSize: '28px',
            fontWeight: 700,
            fontFamily: '"Montserrat", sans-serif',
            margin: 0,
          }}
        >
          Наш наипрекраснейший, большой, удобный, новый зал находится по адресу Республика Чечня, г. Грозный, район Кадырова, микрорайон Доновская, ул. Великого Адама Рамзановича, дом 777 (вход с улицы Ахмат сила). Приходите и получайте не только физическое развитие, но и моральное самоудовлетворение!
        </h2>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
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