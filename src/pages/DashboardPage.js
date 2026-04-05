import React, { useState } from 'react';
import './DashboardPage.css';
import { getImageUrl } from '../utils/imageAssets';

function DashboardPage({ user, onNavigate, onLogout }) {
  const [showNavMenu, setShowNavMenu] = useState(false);

  const totalPoints = user.totalPoints || 0;
  const pointsLevel = Math.floor(totalPoints / 10) + 1;
  const isFirstTime = user.isFirstTime !== false; // True if first time ever logged in

  // Personalized welcome message
  const getWelcomeMessage = () => {
    if (isFirstTime) {
      return `Welcome On Board Taka Ranger ${user.preferredName}!`;
    } else {
      return `Welcome Back Taka Ranger ${user.preferredName}!`;
    }
  };

  const getWelcomeSubtitle = () => {
    if (isFirstTime) {
      return 'You\'re now part of the Ziwani community. Start collecting bottles today!';
    } else {
      return 'You\'re doing an amazing job keeping Kisumu clean!';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <img src={getImageUrl('logo')} alt="Ziwani" className="header-logo-img" />
          <div className="header-info">
            <h1 className="header-title">Ziwani</h1>
            <p className="header-subtitle">Taka Rangers</p>
          </div>
        </div>
        <div className="header-right">
          <button 
            className="profile-btn"
            onClick={() => onNavigate('profile')}
            title="View Profile"
          >
            <img src={user.profilePicture} alt="Profile" className="profile-pic-small" />
          </button>
          <div className="points-badge">
            <span className="points-label">Points</span>
            <span className="points-value">{totalPoints}</span>
          </div>
          <button 
            className="logout-btn-header"
            onClick={onLogout}
            title="Sign Out"
          >
            🚪 Sign Out
          </button>
          <button 
            className="menu-btn" 
            onClick={() => setShowNavMenu(!showNavMenu)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Welcome Card */}
        <div className="welcome-card">
          <div className="welcome-header">
            <img src={user.profilePicture} alt="Your Profile" className="welcome-avatar" />
            <div className="welcome-text">
              <h2 className="welcome-title">{getWelcomeMessage()}</h2>
              <p className="welcome-subtitle">{getWelcomeSubtitle()}</p>
            </div>
          </div>
          <div className="welcome-stats">
            <div className="stat-box">
              <img src={getImageUrl('star')} alt="Level" className="stat-icon" />
              <span className="stat-title">Level</span>
              <span className="stat-value">{pointsLevel}</span>
            </div>
            <div className="stat-box">
              <img src={getImageUrl('target')} alt="Points" className="stat-icon" />
              <span className="stat-title">Points</span>
              <span className="stat-value">{totalPoints}</span>
            </div>
            <div className="stat-box">
              <img src={getImageUrl('calendar')} alt="Member" className="stat-icon" />
              <span className="stat-title">Member</span>
              <span className="stat-value">Since {new Date(user.joinDate).getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="actions-grid">
          <div 
            className="action-card add-bottle-card"
            onClick={() => onNavigate('addBottle')}
          >
            <img src={getImageUrl('addBottle')} alt="Add Bottles" className="action-icon" />
            <h3>Add Bottles</h3>
            <p>Scan or upload bottles to earn points</p>
            <span className="action-arrow">→</span>
          </div>

          <div 
            className="action-card redeem-card"
            onClick={() => onNavigate('redeem')}
          >
            <img src={getImageUrl('redeemPoints')} alt="Redeem Points" className="action-icon" />
            <h3>Redeem Points</h3>
            <p>Exchange for food, dignity packs, or skills</p>
            <span className="action-arrow">→</span>
          </div>

          <div 
            className="action-card history-card"
            onClick={() => onNavigate('history')}
          >
            <img src={getImageUrl('history')} alt="History" className="action-icon" />
            <h3>Points History</h3>
            <p>View your redemption records</p>
            <span className="action-arrow">→</span>
          </div>
        </div>

        {/* User Info Card */}
        <div className="user-info-card">
          <h3>Your Profile</h3>
          <button className="edit-profile-btn" onClick={() => onNavigate('profile')}>
            Edit Profile
          </button>
          <div className="user-details">
            <div className="detail-row">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{user.fullName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{user.phoneNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{user.location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Age:</span>
              <span className="detail-value">{user.age} years</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Preferred Name:</span>
              <span className="detail-value">{user.preferredName}</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h3>How It Works</h3>
          <div className="info-items">
            <div className="info-item">
              <span className="info-number">1</span>
              <p><strong>Collect Bottles:</strong> Each bottle = 1 point</p>
            </div>
            <div className="info-item">
              <span className="info-number">2</span>
              <p><strong>Earn Points:</strong> Upload and verify your bottles</p>
            </div>
            <div className="info-item">
              <span className="info-number">3</span>
              <p><strong>Redeem Rewards:</strong> Choose from food, dignity packs, or skills</p>
            </div>
            <div className="info-item">
              <span className="info-number">4</span>
              <p><strong>Track Progress:</strong> Monitor your redemptions in history</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Mobile */}
      {showNavMenu && (
        <div className="mobile-nav">
          <button 
            className="nav-item"
            onClick={() => {
              onNavigate('dashboard');
              setShowNavMenu(false);
            }}
          >
            <img src={getImageUrl('target')} alt="Dashboard" className="nav-icon" />
            Dashboard
          </button>
          <button 
            className="nav-item"
            onClick={() => {
              onNavigate('addBottle');
              setShowNavMenu(false);
            }}
          >
            <img src={getImageUrl('addBottle')} alt="Add Bottles" className="nav-icon" />
            Add Bottles
          </button>
          <button 
            className="nav-item"
            onClick={() => {
              onNavigate('redeem');
              setShowNavMenu(false);
            }}
          >
            <img src={getImageUrl('redeemPoints')} alt="Redeem" className="nav-icon" />
            Redeem
          </button>
          <button 
            className="nav-item"
            onClick={() => {
              onNavigate('history');
              setShowNavMenu(false);
            }}
          >
            <img src={getImageUrl('history')} alt="History" className="nav-icon" />
            History
          </button>
          <button 
            className="nav-item"
            onClick={() => {
              onNavigate('profile');
              setShowNavMenu(false);
            }}
          >
            <img src={getImageUrl('profile')} alt="Profile" className="nav-icon" />
            Profile
          </button>
          <button 
            className="nav-item logout-item"
            onClick={() => {
              onLogout();
              setShowNavMenu(false);
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}

      {/* Floating Action Button - Mobile */}
      <div className="fab-container">
        <button 
          className="fab logout-fab"
          onClick={onLogout}
          title="Logout"
        >
          🚪
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
