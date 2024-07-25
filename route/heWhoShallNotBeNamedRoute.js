const express = require('express');
const router = express.Router();
const projectModel = require('../model/projectModel');
const mentorshipModel = require('../model/mentorshipModel');
const superAdminController = require('../controller/superAdminController')

const secured = (req, res, next) => {
    if (req.user) {
      return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/auth/login");
  };

  router.get('/admin', secured, superAdminController.buildAdminPage);

  router.post('/create-admin', secured, superAdminController.createNewAdmin)

  router.post('/update-role', secured, superAdminController.updateRole)

  router.post('/delete-admin', secured, superAdminController.deleteAdmin)

  router.get('/user', secured, superAdminController.buildUserPage)
  
  router.get('/project', secured, superAdminController.buildProjectPage)

  router.get('/project-details/:projectid', secured, superAdminController.buildProjectDeatil)

  router.post('/approve-project/:projectid', secured, superAdminController.approveproject)

  router.get('/mentorship', secured, superAdminController.buildMentorshipPage)

  module.exports = router;