const express = require('express');
const router = express.Router();
const { getAllDeals, getDealById, createDeal, updateDealStage, getDealSummary } = require('../controllers/deal.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/reports/summary', getDealSummary);
router.get('/',                getAllDeals);
router.get('/:id',             getDealById);
router.post('/',               createDeal);
router.put('/:id/stage',       updateDealStage);

module.exports = router;
