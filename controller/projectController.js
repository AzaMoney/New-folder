// projectController.js

const projectModel = require('../model/projectModel')

const projectController = {};

projectController.buildCreateProjectPage = async function (req, res, next) {
    try {
        const user_id = req.user.user_id; // Assuming you have user information in the req.user object

        // Check if the user has an initiated project
        const initiatedProjects = await projectModel.getInitiatedProject(user_id);

        if (initiatedProjects.length > 0) {
            // User has an initiated project, redirect to My Projects page
            res.redirect('/project/my-projects');
        } else {
            // No initiated project, render the Create Project page
            res.render('project/create-project', {
                title: 'Create Project'
            });
        }
    } catch (error) {
        console.error('Error in buildCreateProjectPage:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

projectController.registerProject = async function (req, res, next) {
    try {
        const {
            project_name,
            project_description,
            project_mission,
            project_vision,
            project_worthy_of_note,
            project_city,
            project_state,
            project_country,
        } = req.body; // Assuming the data is sent in the request body

        const project_ownerID = req.user.user_id; // Assuming you have user information in the req.user object

        const projectDetails = {
            project_ownerID,
            project_name,
            project_description,
            project_mission,
            project_vision,
            project_worthy_of_note,
            project_status: "initiated",
            project_city,
            project_state,
            project_country,
        };

        // Call the project model function to insert project details
        const projectID = await projectModel.registerProject(projectDetails);

        

        // Redirect or respond accordingly
        res.redirect(`/project/create-project-roles`);
    } catch (error) {
        console.error('Error in registerProject:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

projectController.buildCreateProjectRoles = async function (req, res, next) {
    const user_id = req.user.user_id; // Assuming you have user information in the req.user object

        // Check if the user has an initiated project
        const initiatedProjectsRoles = await projectModel.getInitiatedProjectRoles(user_id);
    res.render('project/create-project-roles', {
        title: "Project Roles",
        initiatedProjectsRoles
    })
}

projectController.registerProjectRole = async function (req, res, next) {
    try {
        const {
            project_role_name,
            project_role_description,
        } = req.body;

        const project_ownerID = req.user.user_id;

        const roleDetails = {
            project_ownerID,
            project_role_name,
            project_role_description,
        };

        // Call the project model function to insert project role
        await projectModel.instertIntoProjectRole(roleDetails);

        // Redirect or respond accordingly
        res.redirect(`/project/create-project-roles`); // Adjust the route accordingly
    } catch (error) {
        console.error('Error in registerProjectRole:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

projectController.buildCreateProjectComm = async function (req, res, next) {
    res.render('project/create-project-communication', {
        title: "Project Communication",
    })
}

projectController.registerProjectComm = async function (req, res, next) {
    try {
        const {
            project_comm_website,
            project_comm_fb,
            project_comm_insta,
            project_comm_linkedin,
            project_comm_collablink,
        } = req.body;

        const project_ownerID = req.user.user_id; // Assuming you have user information in the req.user object

        const projectCommDetails = {
            project_ownerID,
            project_comm_website,
            project_comm_fb,
            project_comm_insta,
            project_comm_linkedin,
            project_comm_collablink,
        };

        // Call the project model function to insert project communication details
        await projectModel.insertIntoProjectComm(projectCommDetails);

        // Update project_status to "submitted"
        await projectModel.updateProjectStatus(project_ownerID, 'submitted');

        // Redirect or respond accordingly
        res.redirect(`/project/submitted`); // Adjust the route accordingly
    } catch (error) {
        console.error('Error in registerProjectComm:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

projectController.buildSubmitted = async function (req, res, next) {
    res.render('project/submitted', {
        title: "Project Submitted"
    })
}

projectController.buildProjectListPage = async function (req, res, next) {
    const allProjects = await projectModel.getAllProjects();
    res.render('project/find-project', {
        title: "Find Project",
        allProjects
    })
}

projectController.buildProjectDetail = async function (req, res, next) {
    try {
        const projectOwner = req.user.user_id;
        const projectid = req.params.projectid;

        // Retrieve project details
        const projectDetails = await projectModel.getProjectByID(projectid);
        const projectRoles = await projectModel.getAllProjectRoleByID(projectid);
        const teamMembers = await projectModel.getProjectTeamMembersByProjectID(projectid);
        const projectComm = await projectModel.getProjectCommByID(projectid);

        console.log(teamMembers.project_member_status)

        if (projectDetails) {
            res.render('project/project-detail', {
                title: 'Project Detail',
                projectDetails,
                projectRoles,
                teamMembers,
                projectOwner,
                projectComm
            });
        } else {
            res.status(404).render('errors/not-found', { title: 'Not Found' });
        }
    } catch (error) {
        console.error('Error in buildProjectDetail:', error);
        res.status(500).render('errors/error', {
            title: 'Error',
            message: 'Internal Server Error',
        });
    }
};


projectController.registerTeamMember = async function (req, res, next) {
    try {
        const projectID = req.params.projectid;
        const {
            project_role,
            project_role_why,
            project_time_commitment
        } = req.body;

        // Assuming you have user information in the req.user object
        const user_id = req.user.user_id;

        const memberDetail = {
            project_team_projectID: projectID,
            project_memberID: user_id,
            project_role,
            project_role_why,
            project_time_commitment
        };

        // Call the project model function to insert team member
        await projectModel.insertTeamMember(memberDetail);

        // Redirect or respond accordingly
        res.redirect(`/project/project-detail/${projectID}`);
    } catch (error) {
        console.error('Error in registerTeamMember:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

projectController.buildMyProjects = async function (req, res, next) {
    
    const user_id = req.user.user_id

    const myProjects = await projectModel.getMyProjects(user_id);
    const myTeam = await projectModel.getMyTeamProjects(user_id);

    res.render('project/my-projects', {
        title: "My Projects",
        myProjects,
        myTeam
    })
}

projectController.buildProjectEditPage = async function (req, res, next) {

    try {

        const projectOwner = req.user.user_id;

        const projectid = req.params.projectid;

        // Retrieve project details
        const projectDetails = await projectModel.getProjectByID(projectid);

        const projectRoles = await projectModel.getAllProjectRoleByID(projectid);

        const teamMembers = await projectModel.getProjectTeamMembersByProjectID(projectid);

        const projectComm = await projectModel.getProjectCommByID(projectid)

        if (projectDetails) {
            res.render('project/edit-project', {
                title: 'Edit Project',
                projectDetails,
                projectRoles,
                teamMembers,
                projectOwner,
                projectComm
            });
        } else {
            res.status(404).render('errors/not-found', { title: 'Not Found' });
        }
    } catch (error) {
        console.error('Error in buildProjectDetail:', error);
        res.status(500).render('errors/error', {
            title: 'Error',
            message: 'Internal Server Error',
        });
    }
}

projectController.editBasicInfo = async function (req, res, next) {
    try {
        const {
            project_name,
            project_description,
            project_mission,
            project_vision,
            project_worthy_of_note,
            project_city,
            project_state,
            project_country,
        } = req.body;

        const projectid = req.params.projectid;

        const projectDetails = {
            project_name,
            project_description,
            project_mission,
            project_vision,
            project_worthy_of_note,
            project_status: "initiated",
            project_city,
            project_state,
            project_country,
        };

        await projectModel.editBasicInfoByID(projectid, projectDetails);

        // Redirect or respond accordingly
        res.redirect(`/project/edit-project/${projectid}`);
    } catch (error) {
        console.error('Error editing basic project info:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

projectController.addRoles = async function (req, res, next) {
    try {
        const { project_role_name, project_role_description } = req.body;
        const projectid = req.params.projectid;

        const roleDetails = {
            projectid,
            project_role_name,
            project_role_description,
        };

        await projectModel.editProjectRolesByID(projectid, roleDetails);

        // Redirect or respond accordingly
        res.redirect(`/project/edit-project/${projectid}`); // Adjust the route accordingly
    } catch (error) {
        console.error('Error adding project role:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

projectController.deleteRole = async function (req, res, next) {
    try {
        const roleid = req.params.project_roleid; // Assuming the role ID is passed in the URL parameters
        const project_ownerid = req.user.user_id; // Assuming you can access the owner ID from the request object
        const projectid = req.params.projectid;

        await projectModel.deleteRoleByOwnerID(roleid, project_ownerid);

        // Redirect or respond accordingly
        res.redirect(`/project/edit-project/${projectid}`); // Adjust the route accordingly
    } catch (error) {
        console.error('Error deleting project role:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

projectController.editProjectComm = async function (req, res, next) {
    try {
        const {
            project_comm_website,
            project_comm_fb,
            project_comm_insta,
            project_comm_linkedin,
            project_comm_collablink,
        } = req.body;

        const projectid = req.params.projectid;

        const projectCommDetails = {
            projectid,
            project_comm_website,
            project_comm_fb,
            project_comm_insta,
            project_comm_linkedin,
            project_comm_collablink,
        };

        // Call the project model function to insert project communication details
        await projectModel.insertIntoProjectCommByProjectid(projectCommDetails);

        // Update project_status to "submitted"
        await projectModel.updateProjectStatusByID(projectid, 'initiated');

        // Redirect or respond accordingly
        res.redirect(`/project/edit-project/${projectid}`); // Adjust the route accordingly
    } catch (error) {
        console.error('Error editing project communication:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

projectController.submitForApproval = async function (req, res, next) {
    const projectid = req.params.projectid;

    await projectModel.updateProjectStatusByID(projectid, 'submitted');

    res.redirect(`/project/submitted`); // Adjust the route accordingly
}

// In the project controller (projectController.js)
projectController.buildApplicationView = async function (req, res, next) {
    try {
      const project_teamid = req.params.project_teamid; // Assuming the team ID is passed as a request parameter
      const teamMembers = await projectModel.getTeamMemberByteamID(project_teamid);
  
      res.render('project/view-application', { 
        title: "Applicant",
        teamMembers }); // Render the view with team members data
    } catch (error) {
      console.error('Error in buildApplicationView:', error);
      res.status(500).render('errors/error', {
        title: 'Error',
        message: 'Internal Server Error',
      });
    }
};

projectController.approveTeamMember = async function (req, res, next) {
    try {
        const project_teamid = req.params.project_teamid;
        const new_status = 'In progress'; // Update the status to "In progress"

        // Call the model function to update the team member status
        await projectModel.updateTeamMemberStatusByID(project_teamid, new_status);

        // Redirect or respond accordingly
        res.redirect(`/project/view-application/${project_teamid}`); // Adjust the route accordingly
    } catch (error) {
        console.error('Error in approveTeamMember:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

projectController.endProjectRole = async function (req, res, next) {
    try {

        const projectid = req.params.projectid

        const project_teamid = req.params.project_teamid; // Assuming the project_teamid is passed as a parameter in the route

        // Update the project member status to "Completed"
        await projectModel.updateTeamMemberStatusByID(project_teamid, 'Completed');

        // Redirect or respond accordingly
        res.redirect(`/project/project-detail/${projectid}`); // Adjust the route accordingly
    } catch (error) {
        console.error('Error in projectController.endProjectRole:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = projectController;