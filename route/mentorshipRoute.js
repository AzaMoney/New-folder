// projectRoute.js
const express = require('express');
const router = express.Router();
const mentorshipController = require('../controller/mentorshipController');
const mentorshipModel = require('../model/mentorshipModel');
const userModel = require('../model/userAccountModel')

const secured = async (req, res, next) => {
  if (req.user) {
    const user_id = req.user.user_id;

    const provider = req.user.provider;

    // Fetch user details from the database
    const user = await userModel.getExistingUser(provider, user_id);

    if (!user) {
      return res.redirect('/user-account/complete-account');
    } else {
      return next();
    }
    
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/auth/login");
};

  router.get('/find-mentee', secured, mentorshipController.buildMenteesList)

  router.get('/mentee-details/:menteeid/:mentorshipid', secured, mentorshipController.buildMenteeDetail);

  router.get('/request-for-mentor', secured, mentorshipController.buildRequestForMentor)

  router.post('/request-for-mentor', secured, mentorshipController.registerMentorship)

  router.get('/application-submitted',secured, mentorshipController.buildSubmitted)

  router.post('/application-submitted/:mentorshipid', secured, mentorshipController.buildApplicationSubmitted)

  router.get('/my-mentorship', secured, mentorshipController.buildMyMentorship)

  router.post('/edit-mentorship/:mentorshipid', secured, mentorshipController.editMentorship)

  router.post('/accept-offer/:mentorareaid', secured, mentorshipController.acceptOffer)

  router.post('/end-mentorship/:mentorareaid', secured, mentorshipController.endMentorship)

module.exports = router;