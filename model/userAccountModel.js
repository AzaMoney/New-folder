// userAccountModel.js

const { pool } = require('../config/databaseConfig');

const user = {};

user.checkForExistingUser = async function (provider, user_id) {
    try {
        // Query to check for an existing user based on provider and user_id
        const query = {
            text: 'SELECT * FROM account WHERE provider_name = $1 AND user_id = $2',
            values: [provider, user_id],
        };

        // Execute the query
        const result = await pool.query(query);

        // Check if a user with the given provider and user_id exists
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error checking for existing user:', error);
        throw error;
    }
};

user.registerUserContact = async function (contactDetails) {
    // try {
    //     const {
    //         provider_name,
    //         user_id,
    //         user_name,
    //         user_email,
    //         user_phone,
    //         user_website,
    //         user_linkedin,
    //         user_github,
    //         user_picture,
    //         user_nickname,
    //         user_about
    //     } = contactDetails;

    //     const query = {
    //         text: `INSERT INTO account (
    //                 provider_name, user_id, user_name, user_email, user_phone,
    //                 user_website, user_linkedin, user_github, user_picture,
    //                 user_nickname, user_about
    //             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    //         values: [
    //             provider_name,
    //             user_id.toString(),
    //             user_name,
    //             user_email,
    //             user_phone,
    //             user_website,
    //             user_linkedin,
    //             user_github,
    //             user_picture,
    //             user_nickname,
    //             user_about
    //         ]
    //     };

    //     await pool.query(query);
    // } catch (error) {
    //     console.error('Error registering user contact:', error);
    //     throw error;
    // }
    try {
        const fields = [
            'provider_name',
            'user_id',
            'user_name',
            'user_email',
            'user_phone',
            'user_website',
            'user_linkedin',
            'user_github',
            'user_picture',
            'user_nickname',
            'user_about'
        ];

        const values = [];
        const placeholders = [];

        fields.forEach((field, index) => {
            if (contactDetails[field] !== undefined) {
                values.push(contactDetails[field]);
                placeholders.push(`$${index + 1}`);
            }
        });

        const query = {
            text: `INSERT INTO account (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`,
            values: values
        };

        await pool.query(query);
    } catch (error) {
        console.error('Error registering user contact:', error);
        throw error;
    }
};

user.insertIntoEducation = async function (user_id, school_name, degree_name, start_date, end_date) {
    const queryString = `
        INSERT INTO userEducation (education_user_id, school_name, degree_name, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5)
    `;

    const values = [user_id, school_name, degree_name, start_date, end_date];

    await pool.query(queryString, values);
}

user.insertIntoCertificate = async function (certificationDetails) {
    try {
        const { user_id, issuer_name, certificate_name, issue_date, expiration_date } = certificationDetails;

        const queryText = `
            INSERT INTO userCertification (certificate_user_id, issuer_name, certificate_name, issue_date, expiration_date)
            VALUES ($1, $2, $3, $4, $5)
        `;

        await pool.query(queryText, [user_id, issuer_name, certificate_name, issue_date, expiration_date]);
    } catch (error) {
        console.error('Error inserting into userCertification:', error);
        throw error;
    }
};

user.insertIntoEmployment = async function (employmentDetails) {
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
            user_id, // Assuming user_id is passed as part of the details
        } = employmentDetails;

        // Insert into userEmployment table
        const insertEmploymentQuery = {
            text: `
                INSERT INTO userEmployment (
                    employment_user_id,
                    organization_name,
                    position_name,
                    start_date,
                    end_date,
                    employment_location_city,
                    employment_location_state,
                    employment_location_country,
                    employment_type,
                    employment_status,
                    employment_description
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING employmentID
            `,
            values: [
                user_id,
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
            ],
        };

        const result = await pool.query(insertEmploymentQuery);

        return result.rows[0].employmentID; // Return the employmentID
    } catch (error) {
        console.error('Error inserting into userEmployment:', error);
        throw error;
    }
};

user.insertIntoSkill = async function (skill) {
    try {
        const { skill_name, user_id } = skill;

        const insertSkillQuery = {
            text: `
                INSERT INTO userSkill (skill_user_id, skill_name)
                VALUES ($1, $2)
                RETURNING skillID
            `,
            values: [user_id, skill_name],
        };

        const result = await pool.query(insertSkillQuery);

        return result.rows[0].skillID; // Return the inserted skillID
    } catch (error) {
        console.error('Error inserting into userSkill:', error);
        throw error;
    }
};

user.insertIntoLanguage = async function (language) {
    try {
        const { language_name, user_id } = language;

        const insertLanguageQuery = {
            text: `
                INSERT INTO userLanguage (language_user_id, language_name)
                VALUES ($1, $2)
                RETURNING languageID
            `,
            values: [user_id, language_name],
        };

        const result = await pool.query(insertLanguageQuery);

        return result.rows[0].languageID; // Return the inserted languageID
    } catch (error) {
        console.error('Error inserting into userLanguage:', error);
        throw error;
    }
};

user.updateAccount = async function (basicInfo) {
    try {
        const {
            user_about,
            user_email,
            user_phone,
            user_website,
            user_linkedin,
            user_github,
            user_id, // Assuming user_id is passed as part of basicInfo
        } = basicInfo;

        const updateAccountQuery = {
            text: `
                UPDATE account
                SET user_about = $1,
                    user_email = $2,
                    user_phone = $3,
                    user_website = $4,
                    user_linkedin = $5,
                    user_github = $6
                WHERE user_id = $7
            `,
            values: [
                user_about,
                user_email,
                user_phone,
                user_website,
                user_linkedin,
                user_github,
                user_id,
            ],
        };

        await pool.query(updateAccountQuery);

        // Update was successful
        return true;
    } catch (error) {
        console.error('Error updating user account:', error);
        throw error;
    }
};

user.registerUser = async function (userDetails) {
    try {
        // Query to insert the new user into the 'account' table
        const accountQuery = {
            text: `INSERT INTO account (
                    provider_name, user_id, user_name, user_email, user_phone,
                    user_website, user_linkedin, user_github, user_picture,
                    user_nickname, user_about
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
                ) RETURNING user_id`,
            values: [
                userDetails.provider_name,
                userDetails.user_id.toString(),
                userDetails.user_name,
                userDetails.user_email,
                userDetails.user_phone,
                userDetails.user_website,
                userDetails.user_linkedin,
                userDetails.user_github,
                userDetails.user_picture,
                userDetails.user_nickname,
                userDetails.user_about,
            ],
        };

        // Execute the query and get the user_id
        const accountResult = await pool.query(accountQuery);
        const userId = accountResult.rows[0].user_id;

        // Query to insert language data into 'userLanguage' table
        const languageQuery = {
            text: `INSERT INTO userLanguage (language_user_id, language_name) VALUES ($1, $2)`,
            values: [userId, userDetails.language_name],
        };

        // Execute the language query
        await pool.query(languageQuery);

        // Query to insert skill data into 'userSkill' table
        const skillQuery = {
            text: `INSERT INTO userSkill (skill_user_id, skill_name) VALUES ($1, $2)`,
            values: [userId, userDetails.skill_name],
        };

        // Execute the skill query
        await pool.query(skillQuery);

        // Query to insert education data into 'userEducation' table
        const educationQuery = {
            text: `INSERT INTO userEducation (education_user_id, school_name, degree_name, start_date, end_date) VALUES ($1, $2, $3, $4, $5)`,
            values: [userId, userDetails.school_name, userDetails.degree_name, userDetails.start_date, userDetails.end_date],
        };

        // Execute the education query
        await pool.query(educationQuery);

        // Query to insert certification data into 'userCertification' table
        const certificationQuery = {
            text: `INSERT INTO userCertification (certificate_user_id, issuer_name, certificate_name, issue_date, expiration_date) VALUES ($1, $2, $3, $4, $5)`,
            values: [userId, userDetails.issuer_name, userDetails.certificate_name, userDetails.issue_date, userDetails.expiration_date],
        };

        // Execute the certification query
        await pool.query(certificationQuery);

        // Query to insert employment data into 'userEmployment' table
        const employmentQuery = {
            text: `INSERT INTO userEmployment (
                employment_user_id, organization_name, position_name, start_date, end_date, 
                employment_location_city, employment_location_state, employment_location_country, 
                employment_type, employment_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            values: [
                userId,
                userDetails.organization_name,
                userDetails.position_name,
                userDetails.start_date_employment,
                userDetails.end_date_employment,
                userDetails.employment_location_city,
                userDetails.employment_location_state,
                userDetails.employment_location_country,
                userDetails.employment_type,
                userDetails.employment_status,
            ],
        };

        // Execute the employment query
        await pool.query(employmentQuery);

        // Query to insert employment description data into 'employmentDescription' table
        const employmentDescriptionQuery = {
            text: `INSERT INTO employmentDescription (emploment_des_id, employment_description) VALUES ($1, $2)`,
            values: [userId, userDetails.employment_description],
        };

        // Execute the employment description query
        await pool.query(employmentDescriptionQuery);

    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

user.getExistingUser = async function (provider, user_id) {
    try {
        // Query to check for an existing user based on provider and user_id
        const query = {
            text: 'SELECT * FROM account WHERE provider_name = $1 AND user_id = $2',
            values: [provider, user_id],
        };

        // Execute the query
        const result = await pool.query(query);

        // Return the user data if a user with the given provider and user_id exists
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error checking for existing user:', error);
        throw error;
    }
};

user.getUserEducation = async function (user_id) {
    try {
        // Query to retrieve user education information
        const queryText = 'SELECT * FROM userEducation WHERE education_user_id = $1';

        // Execute the query
        const result = await pool.query(queryText, [user_id]);

        // Return the user education data
        return result.rows;
    } catch (error) {
        console.error('Error retrieving user education:', error);
        throw error;
    }
};

user.getUserCertificate = async function (user_id) {
    try {
        // Query to retrieve user certificate information
        const query = {
            text: 'SELECT * FROM userCertification WHERE certificate_user_id = $1',
            values: [user_id],
        };

        // Execute the query
        const result = await pool.query(query);

        // Return the user certificate data
        return result.rows;
    } catch (error) {
        console.error('Error retrieving user certificates:', error);
        throw error;
    }
};

user.getUserEmployment = async function (user_id) {
    try {
        const getUserEmploymentQuery = {
            text: `
                SELECT *
                FROM userEmployment
                WHERE employment_user_id = $1
            `,
            values: [user_id],
        };

        const result = await pool.query(getUserEmploymentQuery);

        return result.rows; // Return an array of user employment records
    } catch (error) {
        console.error('Error fetching user employment:', error);
        throw error;
    }
};

user.getUserEmploymentDescription = async function (user_id, employmentID) {
    try {
        const queryText = `
            SELECT employment_description
            FROM employmentDescription
            WHERE emploment_des_id = $1
            AND EXISTS (
                SELECT 1
                FROM userEmployment
                WHERE employmentID = $2
                AND employment_user_id = $3
            )
        `;

        const result = await pool.query(queryText, [employmentID, employmentID, user_id]);

        return result.rows[0]?.employment_description || null;
    } catch (error) {
        console.error('Error retrieving employment description:', error);
        throw error;
    }
};

user.getUserLanguage = async function (user_id) {
    try {
        // Query to retrieve user language information
        const query = {
            text: 'SELECT * FROM userLanguage WHERE language_user_id = $1',
            values: [user_id],
        };

        // Execute the query
        const result = await pool.query(query);

        // Return the user language data
        return result.rows;
    } catch (error) {
        console.error('Error retrieving user languages:', error);
        throw error;
    }
};

user.getUserSkill = async function (user_id) {
    try {
        // Query to retrieve user skills information
        const query = {
            text: 'SELECT * FROM userSkill WHERE skill_user_id = $1',
            values: [user_id],
        };

        // Execute the query
        const result = await pool.query(query);

        // Return the user skills data
        return result.rows;
    } catch (error) {
        console.error('Error retrieving user skills:', error);
        throw error;
    }
};

user.getUserAccount = async function (user_id) {
    try {
        const getUserAccountQuery = {
            text: `
                SELECT * FROM account
                WHERE user_id = $1
            `,
            values: [user_id],
        };

        const result = await pool.query(getUserAccountQuery);

        return result.rows[0]; // Return the user account details
    } catch (error) {
        console.error('Error fetching user account:', error);
        throw error;
    }
};

user.deleteUserAccount = async function (user_id) {
    try {

        // Delete user's project team memberships from 'projectTeamMember' table
        await pool.query('DELETE FROM projectTeamMember WHERE project_memberID = $1', [user_id]);

        // Delete user's project roles from 'projectRole' table
        await pool.query('DELETE FROM projectRole WHERE project_role_projectID IN (SELECT projectID FROM project WHERE project_ownerID = $1)', [user_id]);

        // Delete user's project communications from 'projectComm' table
        await pool.query('DELETE FROM projectComm WHERE project_comm_projectID IN (SELECT projectID FROM project WHERE project_ownerID = $1)', [user_id]);

        // Delete user's projects from 'project' table
        await pool.query('DELETE FROM project WHERE project_ownerID = $1', [user_id]);

        // Delete user from 'mentorArea' table
        await pool.query('DELETE FROM mentorArea WHERE mentorID = $1', [user_id]);

        // Delete user's mentorship records from 'mentorship' table
        await pool.query('DELETE FROM mentorship WHERE menteeid = $1', [user_id]);

        // Delete user's employment history from 'userEmployment' table
        await pool.query('DELETE FROM userEmployment WHERE employment_user_id = $1', [user_id]);

        // Delete user's certifications from 'userCertification' table
        await pool.query('DELETE FROM userCertification WHERE certificate_user_id = $1', [user_id]);

        // Delete user's education from 'userEducation' table
        await pool.query('DELETE FROM userEducation WHERE education_user_id = $1', [user_id]);

        // Delete user's skills from 'userSkill' table
        await pool.query('DELETE FROM userSkill WHERE skill_user_id = $1', [user_id]);

        // Delete user's languages from 'userLanguage' table
        await pool.query('DELETE FROM userLanguage WHERE language_user_id = $1', [user_id]);

        // Delete user from 'account' table
        await pool.query('DELETE FROM account WHERE user_id = $1', [user_id]);

        // Return success message or handle as needed
        return { success: true, message: 'User account and associated information deleted successfully.' };
    } catch (error) {
        console.error('Error in userModel.deleteUserAccount:', error);
        throw error;
    }
};

user.deleteCertificate = async function (user_id, certificateid) {
    try {
        // Delete certificate from 'userCertification' table
        await pool.query('DELETE FROM userCertification WHERE certificateID = $1 AND certificate_user_id = $2', [certificateid, user_id]);
        return { success: true, message: 'Certificate deleted successfully.' };
    } catch (error) {
        console.error('Error in user.deleteCertificate:', error);
        throw error;
    }
};

user.deleteEducation = async function (user_id, educationid) {
    try {
        // Delete education from 'userEducation' table
        await pool.query('DELETE FROM userEducation WHERE educationID = $1 AND education_user_id = $2', [educationid, user_id]);
        return { success: true, message: 'Education deleted successfully.' };
    } catch (error) {
        console.error('Error in user.deleteEducation:', error);
        throw error;
    }
};

user.deleteExperience = async function (user_id, employmentid) {
    try {
        // Delete employment and associated description from 'userEmployment' and 'employmentDescription' tables
        // await pool.query('DELETE FROM employmentDescription WHERE emploment_des_id IN (SELECT descriptionID FROM userEmployment WHERE employmentID = $1 AND employment_user_id = $2)', [employmentid, user_id]);
        await pool.query('DELETE FROM userEmployment WHERE employmentID = $1 AND employment_user_id = $2', [employmentid, user_id]);
        return { success: true, message: 'Employment history deleted successfully.' };
    } catch (error) {
        console.error('Error in user.deleteExperience:', error);
        throw error;
    }
};

user.deleteLanguage = async function (user_id, languageid) {
    try {
        // Delete language from 'userLanguage' table
        await pool.query('DELETE FROM userLanguage WHERE languageID = $1 AND language_user_id = $2', [languageid, user_id]);
        return { success: true, message: 'Language deleted successfully.' };
    } catch (error) {
        console.error('Error in user.deleteLanguage:', error);
        throw error;
    }
};

user.deleteSkill = async function (user_id, skillid) {
    try {
        // Delete skill from 'userSkill' table
        await pool.query('DELETE FROM userSkill WHERE skillID = $1 AND skill_user_id = $2', [skillid, user_id]);
        return { success: true, message: 'Skill deleted successfully.' };
    } catch (error) {
        console.error('Error in user.deleteSkill:', error);
        throw error;
    }
};

user.getAllUsers = async function () {
    try {
        // Query to fetch all users' names and user IDs
        const getAllUsersQuery = {
            text: `
                SELECT user_name, user_id
                FROM account;
            `,
        };

        // Execute the query
        const result = await pool.query(getAllUsersQuery);

        // Return the fetched rows (names and user IDs)
        return result.rows;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};

user.getUserID = async function (userName) {
    try {
        // Query to get the user ID based on the username
        const query = {
            text: 'SELECT user_id FROM account WHERE user_nickname = $1',
            values: [userName],
        };

        // Execute the query
        const result = await pool.query(query);

        // Check if the user exists and return the user ID
        return result.rows.length > 0 ? result.rows[0].user_id : null;
    } catch (error) {
        console.error('Error fetching user ID:', error);
        throw error;
    }
};

module.exports = user;