// mentorshipModel.js

const { pool } = require('../config/databaseConfig');

const mentorshipModel = {};

mentorshipModel.getAllMentorship = async function () {
    try {
        // Query to get all mentorship records
        const getAllMentorshipQuery = {
            text: 'SELECT * FROM mentorship',
        };

        // Execute the query
        const result = await pool.query(getAllMentorshipQuery);

        // Return the rows (mentorship records)
        return result.rows;
    } catch (error) {
        console.error('Error getting all mentorship records:', error);
        throw error;
    }
};

mentorshipModel.getAllMentorshipAndMentorArea = async function () {
    try {
        // Query to get all mentorship records along with mentor area details
        const getAllMentorshipQuery = {
            text: `
                SELECT mentorship.*, mentorarea.*
                FROM mentorship
                LEFT JOIN mentorarea ON mentorship.mentorshipid = mentorarea.mentorshipareaid
            `,
        };

        // Execute the query
        const result = await pool.query(getAllMentorshipQuery);

        // Return the rows (mentorship records along with mentor area details)
        return result.rows;
    } catch (error) {
        console.error('Error getting all mentorship records with mentor area details:', error);
        throw error;
    }
};

mentorshipModel.getMentorshipByMenteedid = async function (menteeid) {
    try {
        // Query to get mentorship records for a specific mentee
        const getMentorshipByMenteedidQuery = {
            text: `
                SELECT * FROM mentorship
                WHERE menteeid = $1
            `,
            values: [menteeid],
        };

        // Execute the query
        const result = await pool.query(getMentorshipByMenteedidQuery);

        // Return the rows (mentorship records for the specified mentee)
        return result.rows;
    } catch (error) {
        console.error('Error getting mentorship records by menteeid:', error);
        throw error;
    }
};

mentorshipModel.getMentorshipByID = async function (mentorshipid) {
    try {
        const getMentorshipByIDQuery = {
            text: `
                SELECT * FROM mentorship
                WHERE mentorshipID = $1
            `,
            values: [mentorshipid],
        };

        const result = await pool.query(getMentorshipByIDQuery);

        return result.rows[0]; // Return the mentorship details
    } catch (error) {
        console.error('Error fetching mentorship details by ID:', error);
        throw error;
    }
};

mentorshipModel.insertIntoMentorship = async function (mentorshipDetail) {
    try {
        const {
            menteeID,
            mentorship_industry,
            mentorship_topic,
            mentorship_goal,
            action_on_goal,
            why_a_mentor
        } = mentorshipDetail;

        // Insert into mentorship table
        const insertMentorshipQuery = {
            text: `
                INSERT INTO mentorship (
                    menteeID,
                    mentorship_industry,
                    mentorship_topic,
                    mentorship_goal,
                    action_on_goal,
                    why_a_mentor
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `,
            values: [
                menteeID,
                mentorship_industry,
                mentorship_topic,
                mentorship_goal,
                action_on_goal,
                why_a_mentor
            ],
        };

        await pool.query(insertMentorshipQuery);
    } catch (error) {
        console.error('Error inserting into mentorship table:', error);
        throw error;
    }
}; // Corrected the comma to a semicolon here

mentorshipModel.insertIntoMentorArea = async function (mentorDetail) {
    try {
        const {
            mentorshipareaid,
            mentorid,
            why_good_fit
        } = mentorDetail;

        // Insert into mentorArea table
        const insertMentorAreaQuery = {
            text: `
                INSERT INTO mentorArea (
                    mentorshipareaid,
                    mentorid,
                    why_good_fit,
                    mentorArea_status
                ) VALUES ($1, $2, $3, $4)
            `,
            values: [
                mentorshipareaid,
                mentorid,
                why_good_fit,
                'applied',
            ],
        };

        await pool.query(insertMentorAreaQuery);
    } catch (error) {
        console.error('Error inserting into mentorArea table:', error);
        throw error;
    }
};

mentorshipModel.getMentorshipOffered = async function (mentorID) {
    try {
        // Execute the query to get the count of mentorArea with "In progress" and "Completed" status
        const queryText = `
            SELECT COUNT(*) as total_mentorship_offered
            FROM mentorArea
            WHERE mentorID = $1
            AND mentorArea_status IN ('In progress', 'Completed');
        `;
        const queryParams = [mentorID];

        const result = await pool.query(queryText, queryParams);

        // Return the total count
        return result.rows[0].total_mentorship_offered;
    } catch (error) {
        console.error('Error in mentorshipModel.getMentorshipOffered:', error);
        throw error;
    }
};

mentorshipModel.updateMentorshipByID = async function (mentorshipid, mentorship_industry, mentorship_topic, mentorship_goal, action_on_goal, why_a_mentor) {
    try {
        const queryText = `
            UPDATE mentorship
            SET mentorship_industry = $1, mentorship_topic = $2, mentorship_goal = $3, action_on_goal = $4, why_a_mentor = $5
            WHERE mentorshipID = $6;
        `;
        const queryParams = [mentorship_industry, mentorship_topic, mentorship_goal, action_on_goal, why_a_mentor, mentorshipid];

        // Execute the SQL query to update mentorship information
        await pool.query(queryText, queryParams);
    } catch (error) {
        console.error('Error updating mentorship:', error);
        throw error;
    }
}

mentorshipModel.updateMentorAreaStatusByID = async function (mentorareaid, newStatus) {
    try {
        const queryText = `
            UPDATE mentorArea
            SET mentorArea_status = $1
            WHERE mentorAreaID = $2;
        `;
        const queryParams = [newStatus, mentorareaid];

        // Execute the SQL query to update the mentor area status
        await pool.query(queryText, queryParams);
    } catch (error) {
        console.error('Error updating mentor area status:', error);
        throw error;
    }
}

module.exports = mentorshipModel;