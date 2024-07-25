const projectModel = require('../model/projectModel');

const ProjectMiddleWare = {};

ProjectMiddleWare.checkForInitiatedProject = async function (req, res, next) {
    try {
        const user_id = req.user.user_id; // Assuming you have user information in the req.user object

        // Check if the user has an initiated project
        const initiatedProjects = await projectModel.getInitiatedProject(user_id);

        if (initiatedProjects.length > 0) {
            // User has an initiated project, redirect to My Projects page
            next();
        } else {
            // No initiated project, proceed to the next middleware or route handler
            res.redirect('/project/my-projects');
        }
    } catch (error) {
        console.error('Error in checkForInitiatedProject middleware:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = ProjectMiddleWare;