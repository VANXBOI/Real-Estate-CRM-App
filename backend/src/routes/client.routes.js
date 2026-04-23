const express = require('express');
const router = express.Router();
const { getAllClients, getClientById, createClient, updateClient, logInteraction } = require('../controllers/client.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/',                  getAllClients);
router.get('/:id',               getClientById);
router.post('/',                 createClient);
router.put('/:id',               updateClient);
router.post('/:id/interactions', logInteraction);

module.exports = router;
