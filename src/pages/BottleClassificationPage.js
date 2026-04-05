import React, { useState, useRef } from 'react';
import './BottleClassificationPage.css';
import { bottleAPI } from '../utils/apiClient';

function BottleClassificationPage({ user, onNavigate, onBottleAdded }) {
  const [bottleType, setBottleType] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUnsure, setIsUnsure] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const bottleTypes = [
    { name: 'Drinking Water', emoji: '💧' },
    { name: 'Soda Water', emoji: '🥤' },
    { name: 'Beer Bottle', emoji: '🍺' },
    { name: 'Wine Bottle', emoji: '🍷' },
    { name: 'Other', emoji: '🍾' }
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setPhotoFile(file);
        setIsUnsure(false);
        // Simulate AI classification
        simulateBottleClassification();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateBottleClassification = () => {
    // Simulate AI classification - in real app, would call backend
    const types = ['Drinking Water', 'Soda Water', 'Beer Bottle'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setBottleType(randomType);
    setIsUnsure(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bottleType) {
      setMessage('Please select a bottle type or upload a photo');
      return;
    }

    if (!quantity || quantity < 1) {
      setMessage('Please enter a valid quantity');
      return;
    }

    setLoading(true);
    setMessage('');

    const result = await bottleAPI.addBottle({
      bottleType,
      quantity: parseInt(quantity),
      photoUrl: photoPreview || null
    });

    if (!result.success) {
      setMessage(`❌ Error: ${result.error}`);
      setLoading(false);
      return;
    }

    setMessage(`✅ ${result.message}`);
    onBottleAdded(result.pointsEarned);
    
    // Reset form
    setBottleType('');
    setQuantity('1');
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsUnsure(false);
    setLoading(false);

    // Redirect after 2 seconds
    setTimeout(() => {
      onNavigate('dashboard');
    }, 2000);
  };

  return (
    <div className="bottle-classification-container">
      <div className="bottle-header">
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>← Back</button>
        <h1>Add Bottles 🍾</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="bottle-content">
        <div className="bottle-card">
          <form onSubmit={handleSubmit}>
            {/* Photo Upload Section */}
            <div className="form-section">
              <h3>Step 1: Upload or Take Photo</h3>
              
              <div className="photo-upload-area">
                {photoPreview ? (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Bottle preview" />
                    <button
                      type="button"
                      className="clear-photo-btn"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoFile(null);
                      }}
                    >
                      ✕ Remove Photo
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <p className="upload-icon">📸</p>
                    <p className="upload-text">Click to upload or take photo</p>
                  </div>
                )}
              </div>

              <div className="upload-buttons">
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📁 Choose from Gallery
                </button>
                <button
                  type="button"
                  className="upload-btn camera-btn"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  📷 Take Photo
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <input
                type="file"
                ref={cameraInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
              />
            </div>

            {/* Bottle Type Selection */}
            <div className="form-section">
              <h3>Step 2: Select or Classify Bottle Type</h3>

              {photoPreview && !isUnsure && (
                <div className="auto-detection">
                  <p className="detection-label">✨ Auto-detected type:</p>
                  {bottleType && (
                    <div className="detected-type">
                      <strong>{bottleType}</strong>
                      <p className="detection-hint">Not correct? Mark as unsure and select manually</p>
                    </div>
                  )}
                </div>
              )}

              <div className="bottle-types">
                {bottleTypes.map((type) => (
                  <button
                    key={type.name}
                    type="button"
                    className={`bottle-type-btn ${bottleType === type.name ? 'selected' : ''}`}
                    onClick={() => setBottleType(type.name)}
                  >
                    <span className="type-emoji">{type.emoji}</span>
                    <span className="type-name">{type.name}</span>
                  </button>
                ))}
              </div>

              {photoPreview && (
                <label className="unsure-checkbox">
                  <input
                    type="checkbox"
                    checked={isUnsure}
                    onChange={(e) => setIsUnsure(e.target.checked)}
                  />
                  <span>I'm unsure about the classification</span>
                </label>
              )}
            </div>

            {/* Quantity */}
            <div className="form-section">
              <h3>Step 3: Quantity</h3>
              <div className="quantity-input">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, parseInt(quantity) - 1).toString())}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max="100"
                />
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((parseInt(quantity) + 1).toString())}
                >
                  +
                </button>
              </div>
              <p className="quantity-hint">Each bottle = 1 point</p>
              <p className="points-earned">
                You will earn <strong>{quantity}</strong> point(s) 🎯
              </p>
            </div>

            {message && (
              <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Bottles ✓'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BottleClassificationPage;
