const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const academyRoutes = require('./routes/academyRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/sessions', sessionRoutes);

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PeerLearn API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
