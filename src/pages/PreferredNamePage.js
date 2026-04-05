import React, { useState } from 'react';
import './PreferredNamePage.css';
import { generateAvatarUrl, getImageUrl } from '../utils/imageAssets';

function PreferredNamePage({ user, onPreferredNameSet }) {
  const [preferredName, setPreferredName] = useState('');
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!preferredName.trim()) {
      setError('Please enter a preferred name');
      return;
    }

    if (preferredName.trim().length < 2) {
      setError('Preferred name must be at least 2 characters');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      onPreferredNameSet(preferredName.trim(), profilePicture);
      setLoading(false);
    }, 500);
  };

  const handleSuggestion = (suggestion) => {
    setPreferredName(suggestion);
    setError('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setUploadedFile(file);
        setShowAvatarOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAvatar = () => {
    if (preferredName.trim()) {
      const newAvatar = generateAvatarUrl(preferredName);
      setProfilePicture(newAvatar);
      setShowAvatarOptions(false);
    } else {
      setError('Please enter a preferred name first to generate avatar');
    }
  };

  const handleRegenerateDefault = () => {
    setProfilePicture(generateAvatarUrl(user.fullName));
    setShowAvatarOptions(false);
  };

  const suggestions = [
    'Taka Champion',
    'Green Guardian',
    'Waste Warrior',
    'Eco Hero',
    'Ranger Elite'
  ];

  return (
    <div className="preferred-name-container">
      <div className="preferred-name-card">
        <div className="pn-header">
          <img src={getImageUrl('success')} alt="Welcome" className="pn-header-icon" />
          <h1 className="pn-title">Welcome On Board Taka Ranger!</h1>
          <p className="pn-subtitle">Let's personalize your profile</p>
        </div>

        <div className="pn-content">
          <div className="user-info">
            <p className="info-label">Account registered as:</p>
            <p className="info-value">{user.fullName}</p>
            <p className="info-detail">{user.phoneNumber}</p>
          </div>

          <form onSubmit={handleSubmit} className="pn-form">
            {/* Avatar Section */}
            <div className="avatar-section">
              <p className="avatar-label">Your Profile Picture</p>
              <div className="avatar-container">
                <img src={profilePicture} alt="Profile" className="avatar-preview" />
              </div>
              
              <div className="avatar-buttons">
                <button
                  type="button"
                  className="avatar-btn"
                  onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                >
                  Change Avatar
                </button>
              </div>

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

            {/* Preferred Name Section */}
            <div className="form-group">
              <label htmlFor="preferredName">Your Preferred Name</label>
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
              />
              <p className="char-count">{preferredName.length}/30 characters</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </form>

          <div className="suggestions-section">
            <p className="suggestions-label">Quick Suggestions:</p>
            <div className="suggestions">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="suggestion-btn"
                  onClick={() => handleSuggestion(suggestion)}
                  type="button"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreferredNamePage;
