const express = require('express');
const router = express.Router();
const dataService = require('../config/dataService');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/permissions');

// @route   GET /api/opportunities
// @desc    Get all opportunities or filter by category
// @access  Public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const opportunities = await dataService.getOpportunities(filter);
    res.json(opportunities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/opportunities
// @desc    Create a new opportunity
// @access  Private (Admin only)
router.post('/', [auth, checkPermission('edit')], async (req, res) => {
  const { title, provider, category, type, deadline, amount, eligibility, description, link } = req.body;

  if (!title || !provider || !category) {
    return res.status(400).json({ msg: 'Please enter all required fields (title, provider, category)' });
  }

  try {
    const newOpportunity = await dataService.createOpportunity({
      title,
      provider,
      category,
      type,
      deadline,
      amount,
      eligibility,
      description,
      link
    });
    res.json(newOpportunity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/opportunities/:id
// @desc    Update an opportunity
// @access  Private (Admin only)
router.put('/:id', [auth, checkPermission('edit')], async (req, res) => {
  try {
    const updatedOpportunity = await dataService.updateOpportunity(req.params.id, req.body);
    if (!updatedOpportunity) {
      return res.status(404).json({ msg: 'Opportunity not found' });
    }
    res.json(updatedOpportunity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/opportunities/:id
// @desc    Delete an opportunity
// @access  Private (Admin only)
router.delete('/:id', [auth, checkPermission('delete')], async (req, res) => {
  try {
    const deletedOpportunity = await dataService.deleteOpportunity(req.params.id);
    if (!deletedOpportunity) {
      return res.status(404).json({ msg: 'Opportunity not found' });
    }
    res.json({ msg: 'Opportunity removed successfully', deletedOpportunity });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
