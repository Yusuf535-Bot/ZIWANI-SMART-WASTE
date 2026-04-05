const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'ziwani.db');

let db;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
      } else {
        console.log('Connected to SQLite database');
        createTables();
        resolve(db);
      }
    });
  });
};

const createTables = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone_number TEXT UNIQUE NOT NULL,
        location TEXT NOT NULL,
        age INTEGER NOT NULL,
        preferred_name TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        total_points INTEGER DEFAULT 0,
        profile_picture TEXT,
        join_date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('Users table created/verified');
    });

    // Bottles table
    db.run(`
      CREATE TABLE IF NOT EXISTS bottles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        bottle_type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        points_earned INTEGER NOT NULL,
        photo_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating bottles table:', err);
      else console.log('Bottles table created/verified');
    });

    // Redemptions table
    db.run(`
      CREATE TABLE IF NOT EXISTS redemptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        item_name TEXT NOT NULL,
        points_spent INTEGER NOT NULL,
        category TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating redemptions table:', err);
      else console.log('Redemptions table created/verified');
    });

    // Sessions table for tracking login history
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating sessions table:', err);
      else console.log('Sessions table created/verified');
    });

    // Seed default users
    seedDefaultUsers();
  });
};

const seedDefaultUsers = () => {
  // Check if users already exist
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) {
      console.error('Error checking users:', err);
      return;
    }

    if (row.count === 0) {
      const defaultUsers = [
        {
          id: 'demo1',
          full_name: 'John Kipchoge',
          phone_number: '+254722123456',
          location: 'Kisumu Central',
          age: 28,
          preferred_name: 'eco_hero',
          password: 'password123',
          totalPoints: 45,
          joinDate: new Date('2025-01-15').toISOString(),
          profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=John%20Kipchoge&scale=80`
        },
        {
          id: 'demo2',
          full_name: 'Grace Achieng',
          phone_number: '+254733456789',
          location: 'Kisumu East',
          age: 32,
          preferred_name: 'green_guardian',
          password: 'demo2024',
          totalPoints: 78,
          joinDate: new Date('2024-11-20').toISOString(),
          profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=Grace%20Achieng&scale=80`
        }
      ];

      defaultUsers.forEach(user => {
        const passwordHash = bcrypt.hashSync(user.password, 10);
        db.run(
          `INSERT INTO users (id, full_name, phone_number, location, age, preferred_name, password_hash, total_points, profile_picture, join_date) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user.id,
            user.full_name,
            user.phone_number,
            user.location,
            user.age,
            user.preferred_name,
            passwordHash,
            user.totalPoints,
            user.profilePicture,
            user.joinDate
          ],
          (err) => {
            if (err) console.error('Error inserting default user:', err);
            else console.log(`Default user ${user.preferred_name} created`);
          }
        );
      });
    }
  });
};

const getDatabase = () => {
  return db;
};

const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase
};
