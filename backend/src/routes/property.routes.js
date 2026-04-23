const express = require('express');
const router = express.Router();
const { getAllProperties, getPropertyById, createProperty, updateProperty, deleteProperty } = require('../controllers/property.controller');
const { protect, restrict } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/',       getAllProperties);
router.get('/:id',    getPropertyById);
router.post('/',      createProperty);
router.put('/:id',    updateProperty);
router.delete('/:id', restrict('admin', 'manager'), deleteProperty);

module.exports = router;
