import React, { useMemo } from 'react';
import './PointsHistoryPage.css';

function PointsHistoryPage({ user, onNavigate }) {
  const bottleHistory = user.bottleHistory || [];
  const redemptionHistory = user.redemptionHistory || [];

  const combinedHistory = useMemo(() => {
    const combined = [];

    // Add bottle collections
    bottleHistory.forEach(bottle => {
      combined.push({
        type: 'earned',
        date: new Date(bottle.date),
        details: `${bottle.type} bottle`,
        points: 1,
        category: 'Collection'
      });
    });

    // Add redemptions
    redemptionHistory.forEach(redemption => {
      combined.push({
        type: 'redeemed',
        date: new Date(redemption.date),
        details: redemption.reason,
        points: redemption.points,
        category: 'Redemption'
      });
    });

    // Sort by date (newest first)
    return combined.sort((a, b) => b.date - a.date);
  }, [bottleHistory, redemptionHistory]);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Collection':
        return '🍾';
      case 'Redemption':
        return '🎁';
      default:
        return '📝';
    }
  };

  return (
    <div className="points-history-page">
      <header className="history-header">
        <button className="back-button" onClick={() => onNavigate('dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Points History</h1>
        <p className="subtitle">Track your bottle collections and redemptions</p>
      </header>

      <div className="history-container">
        {combinedHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h2>No Activity Yet</h2>
            <p>Start collecting bottles to see your history here</p>
            <button className="primary-button" onClick={() => onNavigate('dashboard')}>
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="history-list">
            {combinedHistory.map((entry, index) => (
              <div key={index} className={`history-item ${entry.type}`}>
                <div className="history-badge">
                  <span className="badge-icon">{getCategoryBadge(entry.category)}</span>
                </div>
                <div className="history-details">
                  <div className="history-title">
                    <span className="action-type">
                      {entry.type === 'earned' ? 'Points Earned' : 'Points Redeemed'}
                    </span>
                    <span className="points-value" style={{ color: entry.type === 'earned' ? '#2E7D32' : '#D32F2F' }}>
                      {entry.type === 'earned' ? '+' : '-'}{entry.points}
                    </span>
                  </div>
                  <p className="history-detail">{entry.details}</p>
                  <span className="history-date">{formatDate(entry.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="history-summary">
        <div className="summary-card">
          <h3>Total Bottles Collected</h3>
          <p className="summary-value">{bottleHistory.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Points Redeemed</h3>
          <p className="summary-value">{redemptionHistory.reduce((sum, r) => sum + r.points, 0)}</p>
        </div>
      </div>
    </div>
  );
}

export default PointsHistoryPage;
