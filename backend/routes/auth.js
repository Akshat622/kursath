const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const auth = require('../middleware/auth');
const dataService = require('../config/dataService');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check for user
    const user = await dataService.getUser(username);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Sign JWT token
    const payload = {
      user: {
        id: user._id,
        username: user.username,
        role: user.role || 'sub-admin',
        permissions: user.permissions || { view: true, edit: false, delete: false }
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'kursath_jwt_secret_token',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            role: user.role || 'sub-admin',
            permissions: user.permissions || { view: true, edit: false, delete: false }
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await dataService.getUser(req.user.username);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    res.json({
      id: user._id,
      username: user.username,
      role: user.role || 'sub-admin',
      permissions: user.permissions || { view: true, edit: false, delete: false }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private
router.get('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Admin only' });
  }
  try {
    const users = await dataService.getUsers();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/users
// @desc    Create a new sub-admin user (Admin only)
// @access  Private
router.post('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Admin only' });
  }
  const { username, password, permissions } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: 'Please enter username and password' });
  }
  try {
    const existing = await dataService.getUser(username);
    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = await dataService.createUser({
      username,
      password: hashedPassword,
      role: 'sub-admin',
      permissions: permissions || { view: true, edit: false, delete: false }
    });
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/auth/users/:id
// @desc    Update a sub-admin's permissions or password (Admin only)
// @access  Private
router.put('/users/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Admin only' });
  }
  const { username, permissions, password } = req.body;
  const updates = {};
  if (username) updates.username = username;
  if (permissions) updates.permissions = permissions;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(password, salt);
  }
  try {
    const updated = await dataService.updateUser(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/auth/users/:id
// @desc    Delete a sub-admin (Admin only)
// @access  Private
router.delete('/users/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Admin only' });
  }
  if (req.params.id === req.user.id) {
    return res.status(400).json({ msg: 'Cannot delete yourself' });
  }
  try {
    const deleted = await dataService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Generate password reset token and send email (Admin only)
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ msg: 'Please enter your username/email' });
  }

  // Restrict to the main admin username/email only
  if (username.toLowerCase() !== 'info@kursathfoundation.org') {
    return res.status(403).json({ msg: 'Access denied: Password resets via email are restricted to the main admin only.' });
  }

  try {
    const user = await dataService.getUser(username);
    if (!user) {
      return res.status(400).json({ msg: 'Admin user not found' });
    }

    // Generate token
    const token = crypto.randomBytes(20).toString('hex');
    
    // Set token expiration (1 hour)
    const expires = new Date(Date.now() + 3600000);

    // Save token to user
    await dataService.updateUser(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires
    });

    // Determine the host URL dynamically from origin header
    const origin = req.headers.origin || `http://${req.headers.host}`;
    const resetUrl = `${origin}/login?token=${token}`;

    console.log(`\n======================================================`);
    console.log(`PASSWORD RESET LINK FOR ADMIN:\n${resetUrl}`);
    console.log(`======================================================\n`);

    // Setup nodemailer
    const smtpConfig = {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    };

    let emailSent = false;
    let emailMessage = 'Password reset instructions have been logged to the server console.';

    if (smtpConfig.host && smtpConfig.auth.user) {
      try {
        const transporter = nodemailer.createTransport(smtpConfig);
        await transporter.sendMail({
          from: `"Kursath Foundation Admin" <${smtpConfig.auth.user}>`,
          to: username,
          subject: 'Kursath Foundation - Password Reset Request',
          text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process within one hour:\n\n` +
                `${resetUrl}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        });
        emailSent = true;
        emailMessage = 'Password reset instructions have been sent to your email.';
      } catch (mailErr) {
        console.error('Mail transmission error:', mailErr.message);
        emailMessage = 'Password reset link generated, but email delivery failed. Link has been logged to the server console.';
      }
    }

    res.json({
      msg: emailMessage,
      devResetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using token
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ msg: 'Token and new password are required' });
  }

  try {
    const user = await dataService.getUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ msg: 'Password reset token is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dataService.updateUser(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({ msg: 'Password has been reset successfully! You can now log in.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/google-login
// @desc    Authenticate or register user via Google Sign-In
// @access  Public
router.post('/google-login', async (req, res) => {
  const { credential, isMock, mockEmail } = req.body;

  if (!credential && !(isMock && mockEmail)) {
    return res.status(400).json({ msg: 'Google credential or mock email is required' });
  }

  let email = null;

  try {
    // 1. Resolve email from Google token or mock
    if (isMock && process.env.NODE_ENV !== 'production') {
      email = mockEmail;
      console.log(`[Google Auth Mock] Bypassing verification for mock email: ${email}`);
    } else {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        return res.status(400).json({ msg: 'Google Client ID is not configured on the backend.' });
      }
      
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId
      });
      const payload = ticket.getPayload();
      email = payload['email'];
    }

    if (!email) {
      return res.status(400).json({ msg: 'Google authentication failed: Email could not be verified.' });
    }

    email = email.toLowerCase();

    // 2. Check if user exists
    let user = await dataService.getUser(email);

    if (!user) {
      console.log(`Google user not found. Registering new standard public user: ${email}`);
      
      // Auto-register a new standard public user (not admin/sub-admin)
      const salt = await bcrypt.genSalt(10);
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      
      user = await dataService.createUser({
        username: email,
        password: hashedPassword,
        role: 'user',
        permissions: {
          view: false,
          edit: false,
          delete: false
        }
      });
    }

    // 3. Sign JWT token
    const tokenPayload = {
      user: {
        id: user._id,
        username: user.username,
        role: user.role || 'user',
        permissions: user.permissions || { view: false, edit: false, delete: false }
      }
    };

    jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'kursath_jwt_secret_token',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            role: user.role || 'user',
            permissions: user.permissions || { view: false, edit: false, delete: false }
          }
        });
      }
    );

  } catch (err) {
    console.error('Google Sign-In error:', err.message);
    res.status(500).send('Google Authentication failed');
  }
});

module.exports = router;
