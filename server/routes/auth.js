const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../db/init');
const { generateToken } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// Helper function to get user by ID
const getUserById = (db, userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE id = ?',
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
};

// Helper function to format user response
const formatUserResponse = (dbUser) => {
  return {
    id: dbUser.id,
    fullName: dbUser.full_name,
    phoneNumber: dbUser.phone_number,
    location: dbUser.location,
    age: dbUser.age,
    preferredName: dbUser.preferred_name,
    totalPoints: dbUser.total_points,
    profilePicture: dbUser.profile_picture,
    joinDate: dbUser.join_date,
    isFirstTime: false
  };
};

// Login endpoint
router.post(
  '/login',
  [
    body('preferredName').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { preferredName, password } = req.body;
    const db = getDatabase();

    db.get(
      'SELECT * FROM users WHERE preferred_name = ?',
      [preferredName.toLowerCase()],
      (err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: 'Database error'
          });
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'Incorrect username'
          });
        }

        // Verify password
        if (!bcrypt.compareSync(password, user.password_hash)) {
          return res.status(401).json({
            success: false,
            error: 'Incorrect password'
          });
        }

        const token = generateToken(user.id);
        const userData = formatUserResponse(user);

        res.json({
          success: true,
          token,
          user: userData
        });
      }
    );
  }
);

// Signup endpoint
router.post(
  '/signup',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('age').isInt({ min: 8, max: 120 }).withMessage('Age must be between 8 and 120'),
    body('preferredName').trim().notEmpty().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { fullName, phoneNumber, location, age, preferredName, password } = req.body;
    const db = getDatabase();

    // Check if preferred name exists
    db.get(
      'SELECT id FROM users WHERE preferred_name = ?',
      [preferredName.toLowerCase()],
      (err, existingUser) => {
        if (err) {
          return res.status(500).json({ success: false, error: 'Database error' });
        }

        if (existingUser) {
          return res.status(400).json({
            success: false,
            error: 'Taka Ranger already exists'
          });
        }

        // Check if phone exists
        db.get(
          'SELECT id FROM users WHERE phone_number = ?',
          [phoneNumber],
          (err, existingPhone) => {
            if (err) {
              return res.status(500).json({ success: false, error: 'Database error' });
            }

            if (existingPhone) {
              return res.status(400).json({
                success: false,
                error: 'This phone number is already registered'
              });
            }

            // Create new user
            const userId = 'user_' + crypto.randomBytes(6).toString('hex');
            const passwordHash = bcrypt.hashSync(password, 10);
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}&scale=80`;

            db.run(
              `INSERT INTO users (id, full_name, phone_number, location, age, preferred_name, password_hash, total_points, profile_picture, join_date)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                userId,
                fullName,
                phoneNumber,
                location,
                parseInt(age),
                preferredName.toLowerCase(),
                passwordHash,
                0,
                avatarUrl,
                new Date().toISOString()
              ],
              (err) => {
                if (err) {
                  return res.status(500).json({ success: false, error: 'Failed to create user' });
                }

                const token = generateToken(userId);
                const userData = {
                  id: userId,
                  fullName,
                  phoneNumber,
                  location,
                  age: parseInt(age),
                  preferredName,
                  totalPoints: 0,
                  profilePicture: avatarUrl,
                  joinDate: new Date().toISOString(),
                  isFirstTime: true
                };

                res.status(201).json({
                  success: true,
                  token,
                  user: userData
                });
              }
            );
          }
        );
      }
    );
  }
);

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }

  const { verifyToken } = require('../middleware/auth');
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  const db = getDatabase();
  db.get(
    'SELECT * FROM users WHERE id = ?',
    [decoded.userId],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        user: formatUserResponse(user)
      });
    }
  );
});

// Update profile
router.put(
  '/profile',
  [
    body('preferredName').trim().notEmpty().withMessage('Username is required'),
    body('profilePicture').optional()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const { verifyToken } = require('../middleware/auth');
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { preferredName, profilePicture } = req.body;
    const db = getDatabase();

    // Check if new preferred name is unique
    db.get(
      'SELECT id FROM users WHERE preferred_name = ? AND id != ?',
      [preferredName.toLowerCase(), decoded.userId],
      (err, existingUser) => {
        if (existingUser) {
          return res.status(400).json({
            success: false,
            error: 'Username already taken'
          });
        }

        const updates = [];
        const values = [];

        if (preferredName) {
          updates.push('preferred_name = ?');
          values.push(preferredName.toLowerCase());
        }

        if (profilePicture) {
          updates.push('profile_picture = ?');
          values.push(profilePicture);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(decoded.userId);

        db.run(
          `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
          values,
          function (err) {
            if (err) {
              return res.status(500).json({ success: false, error: 'Failed to update profile' });
            }

            db.get('SELECT * FROM users WHERE id = ?', [decoded.userId], (err, user) => {
              if (err || !user) {
                return res.status(500).json({ success: false, error: 'Failed to fetch updated user' });
              }

              res.json({
                success: true,
                user: formatUserResponse(user)
              });
            });
          }
        );
      }
    );
  }
);

module.exports = router;
