// userController.js
const userModel = require('../model/userAccountModel')

const mentorship = require('../model/mentorshipModel')

const project = require('../model/projectModel')

const charts = require('../service/charts')

const userController = {};

userController.buildResumePage = async function (req, res, next) {
    try {
        // Assuming you have the user's information available in the request
        const user_id = req.user.user_id;

        const provider = req.user.provider;

        // Fetch user details from the database
        const user = await userModel.getExistingUser(provider, user_id);

        if (!user) {
            return res.redirect('/user-account/complete-account');
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

        res.render('user-account/my-account', {
            title: "My Resume",
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

userController.completeAccount = async function (req, res, next) {
    try {
        // Assuming you have the user's information available in the request
        const user_id = req.user.user_id;

        const provider = req.user.provider;

        // Fetch user details from the database
        const user = await userModel.getExistingUser(provider, user_id);

        if (user) {
            
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

        return res.render('user-account/my-account', {
            title: "My Resume",
            user,
            education,
            certificates,
            employment,
            languages,
            skills,
            profileChart
        });
        }

        res.render('user-account/complete-account', {
            title: "Complete Account Registration"
        })

    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Internal Server Error');
    }
}

userController.buildSignUpPage = async function (req, res, next) {

    try {
        // Check if req.user exists and has the expected properties
        if (req.user && req.user._raw) {
            const { _raw, _json, ...userProfile } = req.user;
            
            // Assuming you have the user's information available in the request
            const user_id = req.user.user_id;
            const provider = req.user.provider;
    
            // Fetch user details from the database
            const user = await userModel.getExistingUser(provider, user_id);
            
            if (user) {
                // If the user exists, redirect to /user-account/edit-basic-info
                res.redirect('/user-account/edit-basic-info');
            } else {
                // If the user does not exist, render the sign-up form
                res.render('user-account/sign-up', { 
                    title: "Sign Up Form",
                    userProfile
                });
            }
        } else {
            // Handle the case where req.user or req.user._raw is undefined
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error in handling user sign up or redirection:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
}

userController.registerUserDetail = async function (req, res, next) {
    try {
        const {
            provider_name,
            user_id,
            user_name,
            user_email,
            user_phone,
            user_website,
            user_linkedin,
            user_github,
            user_picture,
            user_nickname,
            user_about
        } = req.body; // Assuming the data is sent in the request body

        const contactDetails = {
            provider_name,
            user_id,
            user_name,
            user_email,
            user_phone,
            user_website,
            user_linkedin,
            user_github,
            user_picture,
            user_nickname,
            user_about
        };

        // Call the user model function to register contact details
        await userModel.registerUserContact(contactDetails);

        res.render('user-account/congratulations', { 
            title: "Congratulations",
        });

            
    } catch (error) {
        console.error('Error in registerUserDetail:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }

    

};

userController.buildEditEducation = async function (req, res, next) {

    const { provider, user_id } = req.user;

    console.log(user_id)

    const education = await userModel.getUserEducation(user_id);

    res.render('user-account/edit-education', { 
        title: "Education",
        education
    });

}

userController.registerUserEducation = async function (req, res, next) {
    const { school_name, degree_name, start_date, end_date } = req.body;
    const { user_id } = req.user; // Assuming you have user information stored in the session

    try {
        // Insert education details into the database
        await userModel.insertIntoEducation(user_id, school_name, degree_name, start_date, end_date);

        // Redirect to a success page or update the user's profile page
        res.redirect('/user-account/edit-education');
    } catch (error) {
        // Handle errors
        next(error);
    }
}

userController.buildEditCertificate = async function(req, res, next) {
    const { provider, user_id } = req.user;

    console.log(user_id)

    const certificates = await userModel.getUserCertificate(user_id);

    res.render('user-account/edit-certificate', { 
        title: "Certificate",
        certificates
    });
}

userController.registerUserCertificate = async function (req, res, next) {
    try {
        const { user_id } = req.user;
        const {
            issuer_name,
            certificate_name,
            issue_date,
            expiration_date
        } = req.body;

        const certificationDetails = {
            user_id,
            issuer_name,
            certificate_name,
            issue_date,
            expiration_date
        };

        // Call the user model function to register certification details
        await userModel.insertIntoCertificate(certificationDetails);
        
        // Redirect to the certifications page or do whatever is appropriate
        res.redirect('/user-account/edit-certificate');
    } catch (error) {
        console.error('Error in registerUserCertification:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

userController.buildEditExperience = async function(req, res, next) {
    const { provider, user_id } = req.user;

    console.log(user_id)

    const employment = await userModel.getUserEmployment(user_id);

    res.render('user-account/edit-experience', { 
        title: "Experience",
        employment,
    });
}

userController.registerUserExperience = async function (req, res, next) {
    try {
        const {
            organization_name,
            position_name,
            start_date,
            end_date,
            employment_location_city,
            employment_location_state,
            employment_location_country,
            employment_type,
            employment_status,
            employment_description,
        } = req.body; // Assuming the data is sent in the request body

        const user_id = req.user.user_id; // Assuming you have user information in the req.user object

        const employmentDetails = {
            organization_name,
            position_name,
            start_date,
            end_date,
            employment_location_city,
            employment_location_state,
            employment_location_country,
            employment_type,
            employment_status,
            employment_description,
            user_id,
        };

        // Call the user model function to insert employment details
        const employmentID = await userModel.insertIntoEmployment(employmentDetails);

        // Redirect or respond accordingly
        res.redirect('/user-account/edit-experience'); // Adjust the route accordingly
    } catch (error) {
        console.error('Error in registerUserExperience:', error);
        // Handle the error appropriately, e.g., send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

userController.buildEditSkill = async function(req, res, next) {
    const user_id = req.user.user_id;

    const skills = await userModel.getUserSkill(user_id);

    res.render('user-account/edit-skill', { 
        title: "Skill",
        skills,
    });
}

userController.registerUserSkill = async function(req, res, next) {
    try {
        const { skill_name } = req.body; // Assuming you're using body-parser or similar middleware
        const user_id = req.user.user_id; // Assuming user is authenticated and user_id is available in req.user

        const skillDetails = {
            skill_name,
            user_id,
        };

        const skillID = await userModel.insertIntoSkill(skillDetails);

        // Handle success or redirect as needed
        res.redirect('/user-account/edit-skill'); 
    } catch (error) {
        console.error('Error in registerUserSkill:', error);
        // Handle error and send appropriate response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

userController.buildEditLanguage = async function(req, res, next) {
    const { provider, user_id } = req.user;

    console.log(user_id)

    const languages = await userModel.getUserLanguage(user_id);

    res.render('user-account/edit-language', { 
        title: "Language",
        languages,
    });
}

userController.registerUserLanguage = async function(req, res, next) {
    try {
        const { language_name } = req.body; // Assuming you're using body-parser or similar middleware
        const user_id = req.user.user_id; // Assuming user is authenticated and user_id is available in req.user

        const languageDetails = {
            language_name,
            user_id,
        };

        const languageID = await userModel.insertIntoLanguage(languageDetails);

        // Handle success or redirect as needed
        res.redirect('/user-account/edit-language');
    } catch (error) {
        console.error('Error in registerUserLanguage:', error);
        // Handle error and send appropriate response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

userController.buildEditBasicInfo = async function(req, res, next) {
    const { provider, user_id } = req.user;

    console.log(user_id)

    const account = await userModel.getUserAccount(user_id);

    res.render('user-account/edit-basic-info', { 
        title: "Basic Information",
        account,
    });
}

userController.updateUserAccount = async function (req, res, next) {
    try {
        const {
            user_about,
            user_email,
            user_phone,
            user_website,
            user_linkedin,
            user_github,
        } = req.body; // Assuming you're using body-parser or similar middleware
        const user_id = req.user.user_id; // Assuming user is authenticated and user_id is available in req.user

        const basicInfo = {
            user_about,
            user_email,
            user_phone,
            user_website,
            user_linkedin,
            user_github,
            user_id,
        };

        await userModel.updateAccount(basicInfo);

        // Redirect or send a response as needed
        res.redirect('/user-account/my-account');
    } catch (error) {
        console.error('Error in updateUserAccount:', error);
        // Handle error and send appropriate response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

userController.buildUserProfile = async function (req, res, next) {
    try {
        // Assuming you have the user's information available in the request
        const user_id = req.params.user_id

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

userController.registerUser = async function (req, res, next) {
    try {
        const {
            provider_name,
            user_id,
            user_name,
            user_email,
            user_phone,
            user_website,
            user_linkedin,
            user_github,
            user_picture,
            user_nickname,
            user_about,
            // Add other fields for account information
            language_name,
            // Add other fields for language information
            skill_name,
            // Add other fields for skill information
            school_name,
            degree_name,
            start_date,
            end_date,
            // Add other fields for education information
            certificate_name,
            issuer_name,
            issue_date,
            expiration_date,
            // Add other fields for certification information
            organization_name,
            position_name,
            employment_type,
            start_date_employment,
            end_date_employment,
            employment_location_city,
            employment_location_state,
            employment_location_country,
            employment_status,
            // Add other fields for employment information
            employment_description,
            // Add other fields for employment description
        } = req.body;

        // Check if the user already exists
        const userExists = await userModel.checkForExistingUser(provider_name, user_id);

        if (userExists) {
            // Handle the case where the user already exists
            res.status(400).send('User already exists');
        } else {
            // Register the user
            const userDeatails = {
                provider_name,
                user_id,
                user_name,
                user_email,
                user_phone,
                user_website,
                user_linkedin,
                user_github,
                user_picture,
                user_nickname,
                user_about,
                // Add other fields for account information
                language_name,
                // Add other fields for language information
                skill_name,
                // Add other fields for skill information
                school_name,
                degree_name,
                start_date,
                end_date,
                // Add other fields for education information
                certificate_name,
                issuer_name,
                issue_date,
                expiration_date,
                // Add other fields for certification information
                organization_name,
                position_name,
                employment_type,
                start_date,
                end_date,
                employment_location_city,
                employment_location_state,
                employment_location_country,
                employment_status,
                // Add other fields for employment information
                employment_description,
                // Add other fields for employment description
            };

            await userModel.registerUser(userDeatails);

            // Redirect or respond accordingly after successful registration
            res.redirect("/user-account/my-account");
        }
    } catch (error) {
        console.error('Error registering user:', error);
        // Handle the error and respond accordingly
        res.status(500).send('Error registering user');
    }
}

userController.buildUpdateAccountPage = async function (req, res, next) {
    try {
        // Assuming you have the user's information available in the request
        const { provider, user_id } = req.user;

        // Fetch user details from the database
        const user = await userModel.getExistingUser(provider, user_id);

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

        res.render('user-account/update-account', {
            title: "My Resume",
            user,
            education,
            certificates,
            employment,
            languages,
            skills,
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Internal Server Error');
    }
};

userController.BuildDeleteAccount = async function (req, res, next) {
    try {
    const user_id = req.user.user_id;

    const account = await userModel.deleteUserAccount(user_id);

    res.render('user-account/delete-account', { 
        title: "Account Delete",
    });
}catch (err){
    res.status(500).send('Error registering user');
}
}

userController.deleteCertificate = async function (req, res, next) {
    const user_id = req.user.user_id;
    const certificateid = req.params.certificateid;

    try {
        const result = await userModel.deleteCertificate(user_id, certificateid);
        res.redirect('/user-account/edit-certificate'); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

userController.deleteEducation = async function (req, res, next) {
    const user_id = req.user.user_id;
    const educationid = req.params.educationid;

    try {
        const result = await userModel.deleteEducation(user_id, educationid);
        res.redirect('/user-account/edit-education'); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

userController.deleteEmployment = async function (req, res, next) {
    const user_id = req.user.user_id;
    const employmentid = req.params.employmentid;

    try {
        const result = await userModel.deleteExperience(user_id, employmentid);
        res.redirect('/user-account/edit-experience'); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

userController.deleteLanguage = async function (req, res, next) {
    const user_id = req.user.user_id;
    const languageid = req.params.languageid;

    try {
        const result = await userModel.deleteLanguage(user_id, languageid);
        res.redirect('/user-account/edit-language'); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

userController.deleteSkill = async function (req, res, next) {
    const user_id = req.user.user_id;
    const skillid = req.params.skillid;

    try {
        await userModel.deleteSkill(user_id, skillid);
        console.log("I got this far")
        res.redirect('/user-account/edit-skill'); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = userController;