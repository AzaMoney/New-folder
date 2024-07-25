// helpRoute.js
const express = require('express');
const router = express.Router();
const helpController = require('../controller/helpController')


router.get('/contact-us', helpController.buildContactUsPage)


module.exports = router;