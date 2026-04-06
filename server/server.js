const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');

dotenv.config();

const { initializeDatabase, closeDatabase } = require('./db/init');
const authRoutes = require('./routes/auth');
const bottleRoutes = require('./routes/bottles');
const redemptionRoutes = require('./routes/redemptions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins for testing
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ziwani backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bottles', bottleRoutes);
app.use('/api/redemptions', redemptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    // Check if HTTPS is enabled
    const useHTTPS = process.env.HTTPS === 'true';
    
    if (useHTTPS) {
      // For development, create self-signed certificate
      const options = {
        key: fs.readFileSync(path.join(__dirname, 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
      };
      
      https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Ziwani backend server running on https://0.0.0.0:${PORT}`);
        console.log(`API endpoints available at https://0.0.0.0:${PORT}/api`);
      });
    } else {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Ziwani backend server running on http://0.0.0.0:${PORT}`);
        console.log(`API endpoints available at http://0.0.0.0:${PORT}/api`);
      });
    }
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await closeDatabase();
  process.exit(0);
});
