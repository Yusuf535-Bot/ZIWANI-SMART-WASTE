import React, { useState } from 'react';
import './ProfilePage.css';
import { generateAvatarUrl, getImageUrl } from '../utils/imageAssets';
import { updateUserProfile } from '../utils/authUtils';

function ProfilePage({ user, onNavigate, onProfileUpdate }) {
  const [preferredName, setPreferredName] = useState(user.preferredName);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!preferredName.trim()) {
      setError('Please enter a preferred name');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const result = await updateUserProfile({
      preferredName: preferredName.trim(),
      profilePicture
    });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setMessage('Profile updated successfully!');
    onProfileUpdate(result.user);
    setLoading(false);

    setTimeout(() => {
      onNavigate('dashboard');
    }, 1500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setShowAvatarOptions(false);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAvatar = () => {
    if (preferredName.trim()) {
      const newAvatar = generateAvatarUrl(preferredName);
      setProfilePicture(newAvatar);
      setShowAvatarOptions(false);
      setError('');
    } else {
      setError('Please enter a preferred name first to generate avatar');
    }
  };

  const handleRegenerateDefault = () => {
    setProfilePicture(generateAvatarUrl(user.fullName));
    setShowAvatarOptions(false);
    setError('');
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="back-button" onClick={() => onNavigate('dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Your Profile</h1>
        <p className="subtitle">Manage your Taka Ranger information</p>
      </header>

      <div className="profile-container">
        <div className="profile-card">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <div className="avatar-display">
              <img src={profilePicture} alt="Profile" className="profile-avatar" />
            </div>
            
            <button
              type="button"
              className="change-avatar-btn"
              onClick={() => setShowAvatarOptions(!showAvatarOptions)}
            >
              Change Avatar
            </button>

            {showAvatarOptions && (
              <div className="avatar-options">
                <label className="upload-label">
                  <span className="upload-text">Upload Custom Picture</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
                
                <button
                  type="button"
                  className="generate-btn"
                  onClick={handleGenerateAvatar}
                >
                  Generate AI Avatar
                </button>
                
                <button
                  type="button"
                  className="regenerate-btn"
                  onClick={handleRegenerateDefault}
                >
                  Use Default Avatar
                </button>
              </div>
            )}
          </div>

          {/* Form Section */}
          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-section">
              <h2>Account Information</h2>
              
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={user.fullName}
                  disabled
                  className="form-input disabled"
                />
                <p className="form-hint">Cannot be changed</p>
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={user.phoneNumber}
                  disabled
                  className="form-input disabled"
                />
                <p className="form-hint">Cannot be changed</p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={user.location}
                    disabled
                    className="form-input disabled"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    value={user.age}
                    disabled
                    className="form-input disabled"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="joinDate">Member Since</label>
                <input
                  type="text"
                  id="joinDate"
                  value={new Date(user.joinDate).toLocaleDateString()}
                  disabled
                  className="form-input disabled"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Customize Your Profile</h2>

              <div className="form-group">
                <label htmlFor="preferredName">Preferred Name</label>
                <input
                  type="text"
                  id="preferredName"
                  value={preferredName}
                  onChange={(e) => {
                    setPreferredName(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., Taka Champion, Eco Hero..."
                  maxLength="30"
                  className="form-input"
                />
                <p className="char-count">{preferredName.length}/30 characters</p>
              </div>

              <div className="stats-section">
                <h3>Your Stats</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <img src={getImageUrl('bottle')} alt="Total Bottles" className="stat-img" />
                    <span className="stat-label">Bottles Collected</span>
                    <span className="stat-value">{(user.bottleHistory || []).length}</span>
                  </div>
                  <div className="stat-item">
                    <img src={getImageUrl('target')} alt="Points" className="stat-img" />
                    <span className="stat-label">Total Points</span>
                    <span className="stat-value">{user.totalPoints || 0}</span>
                  </div>
                  <div className="stat-item">
                    <img src={getImageUrl('redeemPoints')} alt="Redeemed" className="stat-img" />
                    <span className="stat-label">Times Redeemed</span>
                    <span className="stat-value">{(user.redemptionHistory || []).length}</span>
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
