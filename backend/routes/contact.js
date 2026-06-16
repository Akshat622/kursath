const express = require('express');
const router = express.Router();
const dataService = require('../config/dataService');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/permissions');

// @route   POST /api/contact
// @desc    Submit a contact form message
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: 'Please enter all fields (name, email, message)' });
  }

  try {
    const newMessage = await dataService.createMessage({
      name,
      email,
      message
    });
    res.json({ msg: 'Message sent successfully!', newMessage });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/contact
// @desc    Get all messages (for admin review)
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await dataService.getMessages();
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/contact/:id
// @desc    Update a message status (e.g., fixed/resolved)
// @access  Private (Admin only)
router.put('/:id', [auth, checkPermission('edit')], async (req, res) => {
  const { fixed } = req.body;

  if (fixed === undefined) {
    return res.status(400).json({ msg: 'Please specify the fixed status' });
  }

  try {
    const updated = await dataService.updateMessage(req.params.id, { fixed });
    if (!updated) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
