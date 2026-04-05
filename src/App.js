import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BottleClassificationPage from './pages/BottleClassificationPage';
import RedemptionPage from './pages/RedemptionPage';
import PointsHistoryPage from './pages/PointsHistoryPage';
import ProfilePage from './pages/ProfilePage';
import LogoutModal from './pages/LogoutModal';
import { getStoredUser, logout } from './utils/authUtils';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = getStoredUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutComplete = () => {
    logout();
    setShowLogoutModal(false);
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      {currentPage === 'login' && !currentUser && (
        <LoginPage onLoginSuccess={handleLogin} />
      )}

      {currentPage === 'dashboard' && currentUser && (
        <DashboardPage 
          user={currentUser} 
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'addBottle' && currentUser && (
        <BottleClassificationPage 
          user={currentUser} 
          onNavigate={navigateTo}
          onBottleAdded={(points) => {
            const updatedUser = { ...currentUser, totalPoints: (currentUser.totalPoints || 0) + points };
            setCurrentUser(updatedUser);
          }}
        />
      )}

      {currentPage === 'redeem' && currentUser && (
        <RedemptionPage 
          user={currentUser} 
          onNavigate={navigateTo}
          onRedemption={(reason, points) => {
            const updatedUser = { ...currentUser, totalPoints: currentUser.totalPoints - points };
            setCurrentUser(updatedUser);
          }}
        />
      )}

      {currentPage === 'history' && currentUser && (
        <PointsHistoryPage 
          user={currentUser} 
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'profile' && currentUser && (
        <ProfilePage 
          user={currentUser}
          onNavigate={navigateTo}
          onProfileUpdate={(updatedUser) => {
            setCurrentUser(updatedUser);
          }}
        />
      )}

      {showLogoutModal && currentUser && (
        <LogoutModal 
          user={currentUser}
          onLogoutComplete={handleLogoutComplete}
        />
      )}
    </div>
  );
}

export default App;
