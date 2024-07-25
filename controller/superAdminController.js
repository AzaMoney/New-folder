// superAdminController.js
const userModel = require('../model/userAccountModel')

const mentorship = require('../model/mentorshipModel')

const project = require('../model/projectModel')

const admin = require('../model/superAdminModel');

const adminController = {};

adminController.buildAdminPage = async function (req, res, next) {
    try {
        // Fetch all admin data
        const allAdmins = await admin.getAllAdmin();

        // Render the admin page with the retrieved admin data
        res.render('hewhoshallnotbenamed/admin', {
            title: 'Admin',
            admins: allAdmins // Pass the retrieved admins to the view
        });
    } catch (error) {
        console.error('Error building admin page:', error);
        next(error); // Pass the error to the error handling middleware
    }
}

adminController.createNewAdmin = async function (req, res, next) {
    try {
        const { admin_userID, admin_role } = req.body;

        // Insert the new admin into the database
        const newAdmin = await admin.insertIntoAdmin(admin_userID, admin_role);

        // Redirect to the admin page after successfully creating the new admin
        res.redirect('/hewhoshallnotbenamed/admin');
    } catch (error) {
        console.error('Error creating new admin:', error);
        next(error); // Pass the error to the error handling middleware
    }
}

adminController.updateRole = async function (req, res, next) {
    try {
        const { adminId, newRole } = req.body;

        // Update the admin role in the database
        await admin.updateAdminRole(adminId, newRole);

        // Redirect to the admin page after successfully updating the admin role
        res.redirect('/hewhoshallnotbenamed/admin');
    } catch (error) {
        console.error('Error updating admin role:', error);
        next(error); // Pass the error to the error handling middleware
    }
}

adminController.deleteAdmin = async function (req, res, next) {
    try {
        const adminId = req.body.adminId;

        // Delete the admin from the database
        await admin.deleteAdmin(adminId);

        // Redirect to the admin page after successfully deleting the admin
        res.redirect('/hewhoshallnotbenamed/admin');
    } catch (error) {
        console.error('Error deleting admin:', error);
        next(error); // Pass the error to the error handling middleware
    }
}

adminController.buildUserPage = async function (req, res, next) {
    try {
        // Fetch all users
        const allUsers = await userModel.getAllUsers();

        // Render the user page with the retrieved user data
        res.render('hewhoshallnotbenamed/user', {
            title: 'Users',
            users: allUsers
        });
    } catch (error) {
        console.error('Error building user page:', error);
        next(error); // Pass the error to the error handling middleware
    }
};

adminController.buildProjectPage = async function (req, res, next) {
    try {
        // Fetch all projects
        const allProjects = await project.getAllProjects();

        // Render the project page with the retrieved project data
        res.render('hewhoshallnotbenamed/project', {
            title: 'Projects',
            projects: allProjects
        });
    } catch (error) {
        console.error('Error building project page:', error);
        next(error); // Pass the error to the error handling middleware
    }
};

adminController.buildProjectDeatil = async function (req, res, next) {
    try {
        const projectid = req.params.projectid;

        // Retrieve project details
        const projectDetails = await project.getProjectByID(projectid);

        const projectRoles = await project.getAllProjectRoleByID(projectid);

        const teamMembers = await project.getProjectTeamMembersByProjectID(projectid);

        if (projectDetails) {
            res.render('hewhoshallnotbenamed/project-details', {
                title: 'Project Detail',
                projectDetails,
                projectRoles,
                teamMembers
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

adminController.approveproject = async function (req, res, next) {
    try {

        const projectid = req.params.projectid;

        await project.updateProjectStatusByID(projectid, 'In progress');

        // Fetch all projects
        const allProjects = await project.getAllProjects();

        // Render the project page with the retrieved project data
        res.render('hewhoshallnotbenamed/project', {
            title: 'Projects',
            projects: allProjects
        });
    } catch (error) {
        console.error('Error Approving Project:', error);
        res.status(500).render('errors/error', {
            title: 'Error',
            message: 'Internal Server Error',
        });
    }
}

adminController.buildMentorshipPage = async function (req, res, next) {
    try {
        // Fetch all mentorship records with mentor area details
        const mentorships = await mentorship.getAllMentorshipAndMentorArea();

        // Fetch user account details for mentors and mentees concurrently
        const userPromises = mentorships.map(async (mentorship) => {
            const mentorPromise = userModel.getUserAccount(mentorship.mentorid);
            const menteePromise = userModel.getUserAccount(mentorship.menteeid);
            const [mentor, mentee] = await Promise.all([mentorPromise, menteePromise]);
            return { mentor, mentee };
        });

        // Resolve all promises
        const users = await Promise.all(userPromises);

        // Render the mentorship page with mentorship records and user account details
        res.render('hewhoshallnotbenamed/mentorship', { 
            title: "Admin - Mentorship",
            mentorships,
            users
        });
    } catch (error) {
        console.error('Error building mentorship page:', error);
        next(error);
    }
};

module.exports = adminController;