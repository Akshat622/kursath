const express = require('express');
const router = express.Router();
const dataService = require('../config/dataService');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/permissions');

// @route   GET /api/volunteers
// @desc    Get all volunteers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const volunteers = await dataService.getVolunteers();
    res.json(volunteers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/volunteers
// @desc    Add a volunteer
// @access  Private (Admin only)
router.post('/', [auth, checkPermission('edit')], async (req, res) => {
  const { name, specialty, city, status, contact } = req.body;

  if (!name || !city) {
    return res.status(400).json({ msg: 'Please provide name and city' });
  }

  try {
    // Check if volunteer with same name and city already exists
    const volunteers = await dataService.getVolunteers();
    const isDuplicate = volunteers.some(
      v => v.name.toLowerCase().trim() === name.toLowerCase().trim() && 
           v.city.toLowerCase().trim() === city.toLowerCase().trim()
    );
    if (isDuplicate) {
      return res.status(400).json({ msg: 'Already exist' });
    }

    const newVolunteer = await dataService.createVolunteer({
      name,
      specialty,
      city,
      status,
      contact
    });
    res.json(newVolunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/volunteers/:id
// @desc    Update a volunteer
// @access  Private (Admin only)
router.put('/:id', [auth, checkPermission('edit')], async (req, res) => {
  try {
    const updatedVolunteer = await dataService.updateVolunteer(req.params.id, req.body);
    if (!updatedVolunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    res.json(updatedVolunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/volunteers/:id
// @desc    Delete a volunteer
// @access  Private (Admin only)
router.delete('/:id', [auth, checkPermission('delete')], async (req, res) => {
  try {
    const deletedVolunteer = await dataService.deleteVolunteer(req.params.id);
    if (!deletedVolunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    res.json({ msg: 'Volunteer removed successfully', deletedVolunteer });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
