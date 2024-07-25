const express = require('express');
const router = express.Router();
const userAccountController = require('../controller/userAccountController');
const userModel = require('../model/userAccountModel')

const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/auth/login");
};

router.get('/sign-up', secured, userAccountController.buildSignUpPage);

router.post('/congratulations', secured, userAccountController.registerUserDetail)

router.get('/edit-education', secured, userAccountController.buildEditEducation);

router.post('/edit-education', secured, userAccountController.registerUserEducation);

router.get('/edit-certificate', secured, userAccountController.buildEditCertificate);

router.post('/edit-certificate', secured, userAccountController.registerUserCertificate);

router.get('/edit-experience', secured, userAccountController.buildEditExperience);

router.post('/edit-experience', secured, userAccountController.registerUserExperience);

router.get('/edit-skill', secured, userAccountController.buildEditSkill);

router.post('/edit-skill', secured, userAccountController.registerUserSkill);

router.get('/edit-language', secured, userAccountController.buildEditLanguage);

router.post('/edit-language', secured, userAccountController.registerUserLanguage);

router.get('/edit-basic-info', secured, userAccountController.buildEditBasicInfo);

router.post('/edit-basic-info', secured, userAccountController.updateUserAccount);

router.get('/user-profile/:user_id', secured, userAccountController.buildUserProfile);

// Add ensureLoggedIn middleware to only allow authenticated users
// router.get('/my-account', ensureLoggedIn('/auth/login'), userAccountController.buildResumePage);

router.get('/my-account', secured, userAccountController.buildResumePage);

router.get('/update-account', secured, userAccountController.buildUpdateAccountPage);

router.get('/delete-certificate/:certificateid', secured, userAccountController.deleteCertificate)

router.get('/delete-education/:educationid', secured, userAccountController.deleteEducation)

router.get('/delete-experience/:employmentid', secured, userAccountController.deleteEmployment)

router.get('/delete-language/:languageid', secured, userAccountController.deleteLanguage)

router.get('/delete-skill/:skillid', secured, userAccountController.deleteSkill)

router.post('/delete-account', secured, userAccountController.BuildDeleteAccount)

router.get('/complete-account', secured, userAccountController.completeAccount)

module.exports = router;