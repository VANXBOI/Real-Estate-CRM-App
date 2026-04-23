const express = require('express');
const router = express.Router();
const { getAllLeads, getLeadById, createLead, updateLead, deleteLead } = require('../controllers/lead.controller');
const { protect } = require('../middleware/auth.middleware');

// All lead routes require login
router.use(protect);

router.get('/', getAllLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
