const express = require('express');
const router = express.Router();
const passport  = require('passport');

const calenderController = require('../Controllers/calender')
router.get('/:userId',calenderController.serveCalendarpage);
router.get('/toggle-task/:userId/:taskId/:dateIndex/:isDone',calenderController.toggleDate);
router.get('/show-month-history/:userId/:taskId',calenderController.showMonthHistory);
router.get('/getSuggestions/:queryString',calenderController.getSuggestions);

module.exports = router;