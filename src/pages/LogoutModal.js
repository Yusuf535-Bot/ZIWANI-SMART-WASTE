import React, { useEffect } from 'react';
import './LogoutModal.css';
import { getImageUrl } from '../utils/imageAssets';

function LogoutModal({ user, onLogoutComplete }) {
  const userName = user?.preferredName || user?.fullName || 'Taka Ranger';

  useEffect(() => {
    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      onLogoutComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLogoutComplete]);

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal">
        <img src={getImageUrl('success')} alt="Goodbye" className="logout-icon" />
        <h1 className="logout-title">See you Soon!</h1>
        <p className="logout-message">
          Taka Ranger <span className="user-name">{userName}</span>
        </p>
        <p className="logout-subtitle">Thank you for keeping Kisumu clean</p>
        
        <div className="logout-actions">
          <button className="logout-btn" onClick={onLogoutComplete}>
            Return to Login
          </button>
        </div>

        <div className="logout-timer">
          <p className="timer-text">Redirecting in 3 seconds...</p>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
