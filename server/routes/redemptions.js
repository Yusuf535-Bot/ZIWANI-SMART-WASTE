const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// Middleware to check authentication
router.use(authMiddleware);

// Redeem points
router.post(
  '/',
  [
    body('itemName').notEmpty().withMessage('Item name is required'),
    body('points').isInt({ min: 1 }).withMessage('Points must be at least 1'),
    body('category').notEmpty().withMessage('Category is required')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { itemName, points, category } = req.body;
    const userId = req.userId;
    const db = getDatabase();

    // Check user's current points
    db.get('SELECT total_points FROM users WHERE id = ?', [userId], (err, user) => {
      if (err || !user) {
        return res.status(500).json({ success: false, error: 'User not found' });
      }

      if (user.total_points < points) {
        return res.status(400).json({
          success: false,
          error: `Insufficient points. You have ${user.total_points} points but need ${points}.`
        });
      }

      const redemptionId = 'redemption_' + crypto.randomBytes(6).toString('hex');

      // Record redemption
      db.run(
        `INSERT INTO redemptions (id, user_id, item_name, points_spent, category)
         VALUES (?, ?, ?, ?, ?)`,
        [redemptionId, userId, itemName, points, category],
        function (err) {
          if (err) {
            return res.status(500).json({ success: false, error: 'Failed to record redemption' });
          }

          // Deduct points
          db.run(
            'UPDATE users SET total_points = total_points - ? WHERE id = ?',
            [points, userId],
            (err) => {
              if (err) {
                return res.status(500).json({ success: false, error: 'Failed to deduct points' });
              }

              // Get updated user
              db.get('SELECT * FROM users WHERE id = ?', [userId], (err, updatedUser) => {
                if (err || !updatedUser) {
                  return res.status(500).json({ success: false, error: 'Failed to fetch user' });
                }

                res.status(201).json({
                  success: true,
                  message: `Congratulations! You redeemed "${itemName}" for ${points} points!`,
                  redemption: {
                    id: redemptionId,
                    itemName,
                    pointsSpent: points,
                    category,
                    createdAt: new Date().toISOString()
                  },
                  totalPoints: updatedUser.total_points
                });
              });
            }
          );
        }
      );
    });
  }
);

// Get redemption history
router.get('/history', (req, res) => {
  const userId = req.userId;
  const db = getDatabase();

  db.all(
    'SELECT * FROM redemptions WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, redemptions) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to fetch history' });
      }

      res.json({
        success: true,
        redemptionHistory: redemptions.map(r => ({
          id: r.id,
          itemName: r.item_name,
          pointsSpent: r.points_spent,
          category: r.category,
          createdAt: r.created_at
        }))
      });
    }
  );
});

module.exports = router;
