import React from 'react';
import { useNavigate } from 'react-router-dom';
import './404.css'; // We'll create this CSS file

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="stars">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="star" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}></div>
        ))}
      </div>
      
      <div className="content">
        <div className="astronaut">
          <div className="helmet">
            <div className="visor"></div>
          </div>
          <div className="body">
            <div className="arm left"></div>
            <div className="arm right"></div>
          </div>
          <div className="legs">
            <div className="leg left"></div>
            <div className="leg right"></div>
          </div>
        </div>
        
        <div className="message">
          <h1 className="glitch" data-text="404">404</h1>
          <h2>Lost in Space</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <button 
            onClick={() => navigate('/')}
            className="home-button"
          >
            Return to Earth
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;