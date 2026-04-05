const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// Middleware to check authentication
router.use(authMiddleware);

// Add bottle
router.post(
  '/',
  [
    body('bottleType').notEmpty().withMessage('Bottle type is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { bottleType, quantity, photoUrl } = req.body;
    const userId = req.userId;
    const db = getDatabase();

    const bottleId = 'bottle_' + crypto.randomBytes(6).toString('hex');
    const pointsEarned = parseInt(quantity);

    db.run(
      `INSERT INTO bottles (id, user_id, bottle_type, quantity, points_earned, photo_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bottleId, userId, bottleType, parseInt(quantity), pointsEarned, photoUrl || null],
      function (err) {
        if (err) {
          return res.status(500).json({ success: false, error: 'Failed to add bottle' });
        }

        // Update user's total points
        db.run(
          'UPDATE users SET total_points = total_points + ? WHERE id = ?',
          [pointsEarned, userId],
          (err) => {
            if (err) {
              return res.status(500).json({ success: false, error: 'Failed to update points' });
            }

            // Get updated user
            db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
              if (err || !user) {
                return res.status(500).json({ success: false, error: 'Failed to fetch user' });
              }

              res.status(201).json({
                success: true,
                message: `Successfully added ${quantity} bottle(s)! You earned ${pointsEarned} point(s)`,
                pointsEarned,
                totalPoints: user.total_points,
                bottle: {
                  id: bottleId,
                  bottleType,
                  quantity,
                  pointsEarned,
                  createdAt: new Date().toISOString()
                }
              });
            });
          }
        );
      }
    );
  }
);

// Get bottle history
router.get('/history', (req, res) => {
  const userId = req.userId;
  const db = getDatabase();

  db.all(
    'SELECT * FROM bottles WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, bottles) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to fetch history' });
      }

      res.json({
        success: true,
        bottleHistory: bottles.map(b => ({
          id: b.id,
          bottleType: b.bottle_type,
          quantity: b.quantity,
          pointsEarned: b.points_earned,
          photoUrl: b.photo_url,
          createdAt: b.created_at
        }))
      });
    }
  );
});

// Get bottle statistics
router.get('/stats', (req, res) => {
  const userId = req.userId;
  const db = getDatabase();

  db.get(
    `SELECT 
      COUNT(*) as totalBottles,
      SUM(quantity) as totalQuantity,
      SUM(points_earned) as totalPointsEarned
     FROM bottles WHERE user_id = ?`,
    [userId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
      }

      res.json({
        success: true,
        stats: {
          totalBottles: stats.totalBottles || 0,
          totalQuantity: stats.totalQuantity || 0,
          totalPointsEarned: stats.totalPointsEarned || 0
        }
      });
    }
  );
});

module.exports = router;
