// projectRoute.js
const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');
const projectModel = require('../model/projectModel');
const middleware = require('../middleware/project')
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

router.get('/create-project', secured, projectController.buildCreateProjectPage);

router.post('/create-project', secured, projectController.registerProject);

router.get('/create-project-roles', secured, middleware.checkForInitiatedProject, projectController.buildCreateProjectRoles)

router.post('/create-project-roles', secured, middleware.checkForInitiatedProject, projectController.registerProjectRole)

router.get('/create-project-communication', secured, middleware.checkForInitiatedProject, projectController.buildCreateProjectComm)

router.post('/create-project-communication', secured, middleware.checkForInitiatedProject, projectController.registerProjectComm)

router.get('/submitted', secured, projectController.buildSubmitted)

router.get('/find-project', projectController.buildProjectListPage)

router.get('/project-detail/:projectid', secured, projectController.buildProjectDetail);

router.post('/add-team-member/:projectid', secured, projectController.registerTeamMember);

router.get('/my-projects', secured, projectController.buildMyProjects)

router.get('/edit-project/:projectid', secured, projectController.buildProjectEditPage)

router.post('/edit-basic-info/:projectid', secured, projectController.editBasicInfo)

router.post('/edit-roles/:projectid', secured, projectController.addRoles)

router.get('/delete-role/:project_roleid/:projectid', secured, projectController.deleteRole)

router.post('/edit-project-comm/:projectid', secured, projectController.editProjectComm)

router.get('/submit-for-approval/:projectid', secured, projectController.submitForApproval)

router.get('/view-application/:project_teamid', secured, projectController.buildApplicationView)

router.get('/approve-team-member/:project_teamid', secured, projectController.approveTeamMember)

router.post('/end-role/:project_teamid/:projectid', secured, projectController.endProjectRole)

module.exports = router;