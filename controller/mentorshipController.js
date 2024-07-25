// projectController.js

const mentorshipModel = require('../model/mentorshipModel')

const user = require('../model/userAccountModel')

const mentorshipController = {};

mentorshipController.buildMenteesList = async function (req, res, next) {
    try {
        // Call the mentorship model function to get all mentorship records
        const menteesList = await mentorshipModel.getAllMentorship();

        // Create an array to store details of each mentee with user details
        const menteesWithDetails = [];

        // Iterate over the menteesList and fetch user details for each mentee
        for (const mentee of menteesList) {
            const userDetail = await user.getUserAccount(mentee.menteeid);

            // Combine user details with mentorship details
            const menteeWithDetail = {
                user_name: userDetail.user_name,
                user_picture: userDetail.user_picture,
                mentorshipid: mentee.mentorshipid,
                menteeid: mentee.menteeid,
                mentorship_industry: mentee.mentorship_industry,
                mentorship_topic: mentee.mentorship_topic,
                mentorship_goal: mentee.mentorship_goal,
                action_on_goal: mentee.action_on_goal,
                why_a_mentor: mentee.why_a_mentor,
            };

            // Add to the array
            menteesWithDetails.push(menteeWithDetail);
        }

        res.render('mentorship/find-mentee', {
            title: 'List of Mentees',
            menteesList: menteesWithDetails,
        });
    } catch (error) {
        console.error('Error in buildMenteesList:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

mentorshipController.buildMenteeDetail = async function (req, res, next) {
    try {

        const menteeid = req.params.menteeid;

        const mentorshipid = req.params.mentorshipid;

        const mentorship = await mentorshipModel.getMentorshipByID(mentorshipid);
    
        const userinfo = await user.getUserAccount(menteeid);

        res.render('mentorship/mentee-details', {
            title: "Mentee Detail",
            mentorship,
            userinfo
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

mentorshipController.buildRequestForMentor = async function (req, res, next) {
    res.render('mentorship/request-for-mentor', {
        title: "Apply for a mentor"
    })
}

mentorshipController.registerMentorship = async function (req, res, next) {
    try {
        const {
            mentorship_industry,
            mentorship_topic,
            mentorship_goal,
            action_on_goal,
            why_a_mentor
        } = req.body;

        // Assuming you have user information in the req.user object
        const menteeID = req.user.user_id;

        const mentorshipDetail = {
            menteeID,
            mentorship_industry,
            mentorship_topic,
            mentorship_goal,
            action_on_goal,
            why_a_mentor
        };

        // Call the mentorship model function to insert into the mentorship table
        await mentorshipModel.insertIntoMentorship(mentorshipDetail);

        // Redirect or respond accordingly
        res.redirect('/mentorship/request-for-mentor'); // Replace with your success page or handle the response accordingly
    } catch (error) {
        console.error('Error in registerMentorship:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

mentorshipController.buildApplicationSubmitted = async function (req, res, next) {
    try {
        const mentorshipareaid = req.params.mentorshipid;
        const mentorid = req.user.user_id;

        // Assuming you have user information in the req.user object
        const user_id = req.user.user_id;

        const mentorDetail = {
            mentorshipareaid,
            mentorid,
            why_good_fit: req.body.why_good_fit,
        };

        // Call the mentorship model function to insert into the mentorArea table
        await mentorshipModel.insertIntoMentorArea(mentorDetail);

        // Redirect or respond accordingly
        res.redirect(`/mentorship/application-submitted`);
        // ${mentorshipid}
    } catch (error) {
        console.error('Error in buildApplicationSubmitted:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

mentorshipController.buildSubmitted = async function (req, res, next) {
    res.render('mentorship/application-submitted', {
        title: "Application Submitted"
    })
}

mentorshipController.buildMyMentorship = async function (req, res, next) {
    try {

        const userid = req.user.user_id
        const allMentorships = await mentorshipModel.getAllMentorshipAndMentorArea();

        // Filter mentorships based on the user's role (mentee or mentor)
        const menteeMentorships = allMentorships.filter(mentorship => mentorship.menteeid === req.user.user_id);
        const mentorMentorships = allMentorships.filter(mentorship => mentorship.mentorid === req.user.user_id);

        // Get mentor/mentee details for the respective lists
        const menteeList = await Promise.all(menteeMentorships.map(async mentorship => {
            const mentorProfile = await user.getUserAccount(mentorship.mentorid);
            if (mentorProfile) {
                return {
                    user_id: mentorProfile.user_id,
                    user_picture: mentorProfile.user_picture,
                    user_name: mentorProfile.user_name,
                    mentorship_goal: mentorship.mentorship_goal,
                    mentorarea_status: mentorship.mentorarea_status,
                    why_good_fit: mentorship.why_good_fit,
                    menteeid: mentorship.menteeid,
                    mentorship_industry: mentorship.mentorship_industry,
                    mentorship_topic: mentorship.mentorship_topic,
                    action_on_goal: mentorship.action_on_goal,
                    why_a_mentor: mentorship.why_a_mentor,
                    mentorshipid: mentorship.mentorshipid,
                    mentorareaid: mentorship.mentorareaid,
                    mentorid: mentorship.mentorid
                };
            }
            return null; // Handle case where mentorProfile is undefined
        }));

        const mentorList = await Promise.all(mentorMentorships.map(async mentorship => {
            const menteeProfile = await user.getUserAccount(mentorship.menteeid);
            if (menteeProfile) {
                return {
                    user_id: menteeProfile.user_id,
                    user_picture: menteeProfile.user_picture,
                    user_name: menteeProfile.user_name,
                    mentorship_goal: mentorship.mentorship_goal,
                    mentorarea_status: mentorship.mentorarea_status,
                    why_good_fit: mentorship.why_good_fit,
                    menteeid: mentorship.menteeid,
                    mentorshipid: mentorship.mentorshipid,
                    mentorid: mentorship.mentorid,
                    mentorareaid: mentorship.mentorareaid,
                };
            }
            return null; // Handle case where menteeProfile is undefined
        }));

        // Filter out null values from the lists
        const filteredMenteeList = menteeList.filter(item => item !== null);
        const filteredMentorList = mentorList.filter(item => item !== null);

        res.render('mentorship/my-mentorship', {
            title: 'My Mentorship',
            menteeList: filteredMenteeList,
            mentorList: filteredMentorList,
            userid
        });
    } catch (error) {
        console.error('Error building my mentorship:', error);
        res.status(500).render('errors/error', {
            title: 'Error',
            message: 'Internal Server Error',
        });
    }
};

mentorshipController.editMentorship = async function (req, res, next) {
    try {

        const menteeid = req.user.user_id

        const mentorshipid = req.params.mentorshipid

        const {mentorship_industry, mentorship_topic, mentorship_goal, action_on_goal, why_a_mentor } = req.body;

        // Call the model function to update mentorship information
        await mentorshipModel.updateMentorshipByID(mentorshipid, mentorship_industry, mentorship_topic, mentorship_goal, action_on_goal, why_a_mentor);

        // Redirect or respond as needed
        res.redirect(`/mentorship/mentee-details/${menteeid}/${mentorshipid}`)
    } catch (error) {
        console.error('Error editing mentorship:', error);
        res.status(500).send("Internal Server Error");
    }
}

mentorshipController.acceptOffer = async function (req, res, next) {
    try {
        const mentorareaid = req.params.mentorareaid; // Assuming you're passing mentor_area_id in the request body
        const newStatus = "In progress"; // Set the new status to "In progress"

        // Call the mentorship model function to update the mentor area status
        await mentorshipModel.updateMentorAreaStatusByID(mentorareaid, newStatus);

        res.redirect('/mentorship/my-mentorship');
    } catch (error) {
        console.error('Error accepting offer:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

mentorshipController.endMentorship = async function (req, res, next) {
    try {
        const mentorareaid = req.params.mentorareaid; // Assuming you're passing mentor_area_id in the request body
        const newStatus = "Completed"; // Set the new status to "In progress"

        // Call the mentorship model function to update the mentor area status
        await mentorshipModel.updateMentorAreaStatusByID(mentorareaid, newStatus);

        res.redirect('/mentorship/my-mentorship');
    } catch (error) {
        console.error('Error accepting offer:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = mentorshipController;