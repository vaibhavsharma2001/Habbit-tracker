const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notifications');
router.get('/getTasks', notificationController.getTasks);

module.exports= router;