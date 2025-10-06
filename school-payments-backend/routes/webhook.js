const express = require('express');
const router = express.Router();
const WebhookLog = require('../models/WebhookLog');

router.post('/', async (req, res) => {
  try {
    const log = await WebhookLog.create({ event: req.body.event, payload: req.body });
    res.status(200).json({ message: 'Webhook received', log });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
});

// Get webhook logs
const { protect, admin } = require('../middleware/auth');
router.get('/', protect, admin, async (req,res)=>{
  const logs = await WebhookLog.find().sort({createdAt:-1});
  res.json(logs);
});

module.exports = router;
