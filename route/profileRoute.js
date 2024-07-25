// helpRoute.js
const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController')


router.get('/individual/:userName', profileController.buildUserProfile)


module.exports = router;