import React, { useState } from 'react';
import './RedemptionPage.css';
import { redemptionAPI } from '../utils/apiClient';

function RedemptionPage({ user, onNavigate, onRedemption }) {
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const items = {
    food: [
      { id: 1, name: 'Bread Pack', points: 10, icon: '🍞' },
      { id: 2, name: 'Flour Bag', points: 15, icon: '🌾' },
      { id: 3, name: 'Rice Sack (1kg)', points: 20, icon: '🍚' },
      { id: 4, name: 'Beans Pack', points: 15, icon: '🫘' },
      { id: 5, name: 'Oil Bottle', points: 12, icon: '🫗' },
      { id: 6, name: 'Sugar Pack', points: 10, icon: '🍯' },
      { id: 7, name: 'Milk Carton', points: 8, icon: '🥛' },
      { id: 8, name: 'Eggs (1 dozen)', points: 18, icon: '🥚' }
    ],
    dignity: [
      { id: 1, name: 'Tissue Pack', points: 5, icon: '🧻' },
      { id: 2, name: 'Pants (M/L/XL)', points: 25, icon: '👖' },
      { id: 3, name: 'Sanitary Pads Box', points: 15, icon: '🌙' },
      { id: 4, name: 'Soap Bars (3pc)', points: 8, icon: '🧼' },
      { id: 5, name: 'Toothbrush', points: 5, icon: '🪥' },
      { id: 6, name: 'Toothpaste Tube', points: 5, icon: '😁' },
      { id: 7, name: 'Underwear Pack', points: 20, icon: '🩱' },
      { id: 8, name: 'Blanket', points: 50, icon: '🛏️' },
      { id: 9, name: 'T-Shirt', points: 15, icon: '👕' },
      { id: 10, name: 'Shoes', points: 40, icon: '👟' }
    ],
    skills: [
      { id: 1, name: 'Catering Level 1', points: 30, icon: '🍳', description: 'Basic cooking & food preparation' },
      { id: 2, name: 'Catering Level 2', points: 50, icon: '👨‍🍳', description: 'Advanced catering skills' },
      { id: 3, name: 'Sign Language Basics', points: 25, icon: '🤟', description: 'Intro to sign language' },
      { id: 4, name: 'ICT Skills - Computer Basics', points: 35, icon: '💻', description: 'Microsoft Office & basics' },
      { id: 5, name: 'ICT Skills - Digital Marketing', points: 45, icon: '📱', description: 'Social media & online marketing' },
      { id: 6, name: 'Entrepreneurship 101', points: 40, icon: '💼', description: 'Start your own business' },
      { id: 7, name: 'Financial Literacy', points: 30, icon: '💰', description: 'Money management skills' },
      { id: 8, name: 'Health & Wellness', points: 25, icon: '💪', description: 'Health awareness training' }
    ]
  };

  const categories = [
    { id: 'food', name: 'Food Items', icon: '🍽️' },
    { id: 'dignity', name: 'Dignity Packs', icon: '💝' },
    { id: 'skills', name: 'Learn Skills', icon: '📚' }
  ];

  const handleRedeem = async (item) => {
    if (user.totalPoints < item.points) {
      setMessage(`⚠️ You need ${item.points} points. You have ${user.totalPoints} points.`);
      return;
    }

    setLoading(true);
    setMessage('');

    const result = await redemptionAPI.redeem({
      itemName: item.name,
      points: item.points,
      category: selectedCategory
    });

    if (!result.success) {
      setMessage(`❌ Error: ${result.error}`);
      setLoading(false);
      return;
    }

    setMessage(`✅ ${result.message}`);
    onRedemption(
      `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}: ${item.name}`,
      item.points
    );
    setSelectedItem(null);
    setLoading(false);

    // Redirect after 2 seconds
    setTimeout(() => {
      onNavigate('dashboard');
    }, 2000);
  };

  const currentItems = items[selectedCategory];
  const availablePoints = user.totalPoints || 0;

  return (
    <div className="redemption-container">
      <div className="redemption-header">
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>← Back</button>
        <h1>Redeem Points 🎁</h1>
        <div className="points-display">
          <span className="points-label">Available</span>
          <span className="points-value">{availablePoints}</span>
        </div>
      </div>

      <div className="redemption-content">
        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category.id);
                setSelectedItem(null);
              }}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="items-grid">
          {currentItems.map(item => (
            <div
              key={item.id}
              className={`item-card ${item.points > availablePoints ? 'disabled' : ''} ${selectedItem?.id === item.id ? 'selected' : ''}`}
              onClick={() => item.points <= availablePoints && setSelectedItem(item)}
            >
              <div className="item-icon">{item.icon}</div>
              <h4 className="item-name">{item.name}</h4>
              {item.description && <p className="item-description">{item.description}</p>}
              <div className="item-points">
                <span className="points-badge">{item.points} pts</span>
              </div>
              {item.points > availablePoints && (
                <div className="insufficient-label">Insufficient Points</div>
              )}
              {selectedItem?.id === item.id && (
                <div className="selected-checkmark">✓</div>
              )}
            </div>
          ))}
        </div>

        {/* Details Panel */}
        {selectedItem && (
          <div className="details-panel">
            <div className="details-header">
              <h2>Confirm Redemption</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
            </div>

            <div className="details-body">
              <div className="item-display">
                <div className="item-big-icon">{selectedItem.icon}</div>
                <h3>{selectedItem.name}</h3>
                {selectedItem.description && (
                  <p className="item-full-description">{selectedItem.description}</p>
                )}
              </div>

              <div className="redemption-info">
                <div className="info-row">
                  <span className="info-label">Points Required:</span>
                  <span className="info-value">{selectedItem.points}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Your Points:</span>
                  <span className="info-value">{availablePoints}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Points After:</span>
                  <span className="info-value">{availablePoints - selectedItem.points}</span>
                </div>
              </div>

              {message && (
                <div className={`message ${message.includes('✅') ? 'success' : 'warning'}`}>
                  {message}
                </div>
              )}

              <button
                className="redeem-btn"
                onClick={() => handleRedeem(selectedItem)}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Redeem for ${selectedItem.points} Points`}
              </button>
            </div>
          </div>
        )}

        {/* No Selection */}
        {!selectedItem && (
          <div className="empty-state">
            <p className="empty-icon">👆</p>
            <p className="empty-text">Select an item to redeem</p>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="redemption-footer">
        <h4>📋 Redemption Guide</h4>
        <ul>
          <li>Each bottle collected = 1 point</li>
          <li>Point values vary by item</li>
          <li>Redeemed items will be logged in your history</li>
          <li>Items can be claimed at our distribution centers</li>
        </ul>
      </div>
    </div>
  );
}

export default RedemptionPage;
