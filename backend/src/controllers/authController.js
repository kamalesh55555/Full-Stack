const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const prisma = require('../utils/db');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Email/Password Signup
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    const token = generateToken(user.id);
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Email/Password Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      // If user exists but has no password, they signed up with Google
      return res.status(400).json({ message: 'Invalid credentials or user signed up with Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.suspended) {
      return res.status(403).json({ message: 'Account is suspended' });
    }

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Google Sign-In logic
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body; // The token sent from React
    
    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Create new user (no password)
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId
        }
      });
    } else {
      // If user exists but doesn't have a googleId linked, we could update it
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId }
        });
      }
    }

    if (user.suspended) {
      return res.status(403).json({ message: 'Account is suspended' });
    }

    // Generate our app's JWT
    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(401).json({ message: 'Google authentication failed', error: error.message });
  }
};
