// userController.js
const userModel = require('../model/userAccountModel')

const mentorship = require('../model/mentorshipModel')

const project = require('../model/projectModel')

const charts = require('../service/charts')

const userController = {};

userController.buildUserProfile = async function (req, res, next) {
    try {

        const user_name = req.params.userName
        // Assuming you have the user's information available in the request
        const user_id = await userModel.getUserID(user_name);

        // Fetch user details from the database
        const user = await userModel.getUserAccount(user_id);

        if (!user) {
            return res.status(404).send('User not found');
        }


        // Fetch user education details from the database
        const education = await userModel.getUserEducation(user_id);

        // Fetch user certificate details from the database
        const certificates = await userModel.getUserCertificate(user_id);

        // Fetch user employment details from the database
        const employment = await userModel.getUserEmployment(user_id);

        // Fetch user language details from the database
        const languages = await userModel.getUserLanguage(user_id);

        // Fetch user language details from the database
        const skills = await userModel.getUserSkill(user_id);

        // Use Promise.all to wait for all promises to resolve
        const [mf, pw, pc] = await Promise.all([
            mentorship.getMentorshipOffered(user_id),
            project.getProjectWorkedOn(user_id),
            project.getTotallProjectCreated(user_id)
        ]);

        const profileChart = await charts.generatePieChart(mf, pw, pc);

        res.render('user-account/user-profile', {
            title: "User Resume",
            user,
            education,
            certificates,
            employment,
            languages,
            skills,
            profileChart
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = userController;