// projectModel.js

const { pool } = require('../config/databaseConfig');

const projectModel = {};

// projectModel.js
projectModel.registerProject = async function (projectDetails) {
    try {
        const {
            project_name,
            project_description,
            project_mission,
            project_vision,
            project_worthy_of_note,
            project_status,
            project_city,
            project_state,
            project_country,
            project_ownerID,
        } = projectDetails;

        // Set default value for project_status to "initiated"
        const status = project_status || "initiated";

        // Insert into project table
        const insertProjectQuery = {
            text: `
                INSERT INTO project (
                    project_ownerID,
                    project_name,
                    project_description,
                    project_mission,
                    project_vision,
                    project_worthy_of_note,
                    project_status,
                    project_city,
                    project_state,
                    project_country
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING projectID
            `,
            values: [
                project_ownerID,
                project_name,
                project_description,
                project_mission,
                project_vision,
                project_worthy_of_note,
                status,
                project_city,
                project_state,
                project_country,
            ],
        };

        const result = await pool.query(insertProjectQuery);

        console.log('Result:', result.rows[0]); // Log the result

        if (result.rows.length > 0 && result.rows[0].projectid !== undefined) {
            return result.rows[0].projectid; // Return the projectID
        } else {
            throw new Error('ProjectID is undefined or not found in the result.');
        }
    } catch (error) {
        console.error('Error inserting into project table:', error);
        throw error;
    }
};

projectModel.instertIntoProjectRole = async function (roleDetails) {
    try {
        const {
            project_ownerID,
            project_role_name,
            project_role_description,
        } = roleDetails;

        // Insert into projectRole table
        const insertRoleQuery = {
            text: `
                INSERT INTO projectRole (
                    project_role_projectID,
                    project_role_name,
                    project_role_description
                )
                SELECT projectID, $1, $2
                FROM project
                WHERE project_ownerID = $3
                    AND project_status = 'initiated'
            `,
            values: [project_role_name, project_role_description, project_ownerID],
        };

        await pool.query(insertRoleQuery);
    } catch (error) {
        console.error('Error inserting into projectRole table:', error);
        throw error;
    }
};

projectModel.getProjectByOwner = async function (user_id, project_id) {
    try {
        const query = {
            text: `
                SELECT *
                FROM project
                WHERE project_ownerID = $1 AND projectID = $2
            `,
            values: [user_id, project_id],
        };

        const result = await pool.query(query);

        return result.rows[0]; // Return the project or null if not found
    } catch (error) {
        console.error('Error retrieving project by owner:', error);
        throw error;
    }
};


projectModel.getInitiatedProject = async function (user_id) {
    try {
        const query = {
            text: `
                SELECT *
                FROM project
                WHERE project_ownerID = $1
                AND project_status = 'initiated'
            `,
            values: [user_id],
        };

        const result = await pool.query(query);

        return result.rows;
    } catch (error) {
        console.error('Error retrieving initiated projects:', error);
        throw error;
    }
};

projectModel.getInitiatedProjectRoles = async function (user_id) {
    try {
        // Retrieve initiated project roles for the specified user
        const getRolesQuery = {
            text: `
                SELECT pr.project_roleID, pr.project_role_name, pr.project_role_description
                FROM projectRole pr
                JOIN project p ON pr.project_role_projectID = p.projectID
                WHERE p.project_ownerID = $1
                    AND p.project_status = 'initiated'
            `,
            values: [user_id],
        };

        const result = await pool.query(getRolesQuery);

        return result.rows;
    } catch (error) {
        console.error('Error fetching initiated project roles:', error);
        throw error;
    }
};

projectModel.insertIntoProjectComm = async function (projectCommDetails) {
    try {
        const {
            project_ownerID,
            project_comm_website,
            project_comm_fb,
            project_comm_insta,
            project_comm_linkedin,
            project_comm_collablink,
        } = projectCommDetails;

        // Insert into projectComm table
        const insertProjectCommQuery = {
            text: `
                INSERT INTO projectComm (
                    project_comm_projectID,
                    project_comm_website,
                    project_comm_fb,
                    project_comm_insta,
                    project_comm_linkedin,
                    project_comm_collablink
                )
                SELECT projectID, $1, $2, $3, $4, $5
                FROM project
                WHERE project_ownerID = $6
            `,
            values: [
                project_comm_website,
                project_comm_fb,
                project_comm_insta,
                project_comm_linkedin,
                project_comm_collablink,
                project_ownerID,
            ],
        };

        await pool.query(insertProjectCommQuery);
    } catch (error) {
        console.error('Error inserting into projectComm table:', error);
        throw error;
    }
};

projectModel.updateProjectStatus = async function (user_id, newStatus) {
    try {
        const updateStatusQuery = {
            text: `
                UPDATE project
                SET project_status = $1
                WHERE project_ownerID = $2
            `,
            values: [newStatus, user_id],
        };

        await pool.query(updateStatusQuery);
    } catch (error) {
        console.error('Error updating project status:', error);
        throw error;
    }
};

projectModel.updateProjectStatusByID = async function (projectid, newStatus) {
    try {
        const updateStatusQuery = {
            text: `
                UPDATE project
                SET project_status = $1
                WHERE projectid = $2
            `,
            values: [newStatus, projectid],
        };

        await pool.query(updateStatusQuery);
    } catch (error) {
        console.error('Error updating project status:', error);
        throw error;
    }
};

projectModel.getAllProjects = async function () {
    try {
        const getAllProjectsQuery = {
            text: `
                SELECT *
                FROM project
            `,
        };

        const result = await pool.query(getAllProjectsQuery);

        return result.rows;
    } catch (error) {
        console.error('Error retrieving all projects:', error);
        throw error;
    }
};


projectModel.getProjectByID = async function (project_id) {
    try {
        const query = {
            text: `
                SELECT *
                FROM project
                WHERE projectID = $1
            `,
            values: [project_id],
        };

        const result = await pool.query(query);

        return result.rows[0]; // Return the project details or null if not found
    } catch (error) {
        console.error('Error retrieving project by ID:', error);
        throw error;
    }
};

projectModel.getAllProjectRoleByID = async function (projectID) {
    try {
        const query = {
            text: `
                SELECT *
                FROM projectRole
                WHERE project_role_projectID = $1
            `,
            values: [projectID],
        };

        const result = await pool.query(query);

        return result.rows; // Return the project roles or an empty array if none found
    } catch (error) {
        console.error('Error retrieving project roles by projectID:', error);
        throw error;
    }
};

projectModel.insertTeamMember = async function (memberDetail) {
    try {
        const {
            project_team_projectID,
            project_memberID,
            project_role,
            project_role_why,
            project_time_commitment
        } = memberDetail;

        // Insert into projectTeamMember table
        const insertTeamMemberQuery = {
            text: `
                INSERT INTO projectTeamMember (
                    project_team_projectID,
                    project_memberID,
                    project_role,
                    project_role_why,
                    project_time_commitment,
                    project_member_status
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `,
            values: [
                project_team_projectID,
                project_memberID,
                project_role,
                project_role_why,
                project_time_commitment,
                'applied'
            ],
        };

        await pool.query(insertTeamMemberQuery);
    } catch (error) {
        console.error('Error inserting into projectTeamMember table:', error);
        throw error;
    }
};

projectModel.getProjectWorkedOn = async function (projectMemberID) {
    try {
        // Execute the query to get the count of projectTeamMember with "In progress" and "Completed" status
        const queryText = `
            SELECT COUNT(*) as total_projects_worked_on
            FROM projectTeamMember
            WHERE project_memberID = $1
            AND project_member_status IN ('In progress', 'Completed');
        `;
        const queryParams = [projectMemberID];

        const result = await pool.query(queryText, queryParams);

        // Return the total count
        return result.rows[0].total_projects_worked_on;
    } catch (error) {
        console.error('Error in projectModel.getProjectWorkedOn:', error);
        throw error;
    }
};

projectModel.getTotallProjectCreated = async function (ownerID) {
    try {
        // Execute the query to get the count of projects with "In progress" and "Completed" status
        const queryText = `
            SELECT COUNT(*) as total_projects_created
            FROM project
            WHERE project_ownerID = $1
            AND project_status IN ('In progress', 'Completed');
        `;
        const queryParams = [ownerID];

        const result = await pool.query(queryText, queryParams);

        // Return the total count
        return result.rows[0].total_projects_created;
    } catch (error) {
        console.error('Error in projectModel.getTotallProjectCreated:', error);
        throw error;
    }
};

projectModel.getMyProjects = async function (ownerID) {
    try {
        const queryText = `
            SELECT *
            FROM project
            WHERE project_ownerID = $1;
        `;
        const queryParams = [ownerID];

        const result = await pool.query(queryText, queryParams);

        return result.rows; // Return an array of projects
    } catch (error) {
        console.error('Error in projectModel.getMyProjects:', error);
        throw error;
    }
};

projectModel.getMyTeamProjects = async function (memberID) {
    try {
        const queryText = `
            SELECT p.*
            FROM project p
            JOIN projectTeamMember ptm ON p.projectID = ptm.project_team_projectID
            WHERE ptm.project_memberID = $1;
        `;
        const queryParams = [memberID];

        const result = await pool.query(queryText, queryParams);

        return result.rows; // Return an array of projects
    } catch (error) {
        console.error('Error in projectModel.getMyTeamProjects:', error);
        throw error;
    }
};


projectModel.getProjectTeamMembersByProjectID = async function (projectID) {
  try {
    // Query to get project team members' information
    const result = await pool.query(
      `SELECT account.user_id, account.user_picture, account.user_name, projectTeamMember.project_role, projectTeamMember.project_member_status, projectTeamMember.project_teamid
       FROM account
       INNER JOIN projectTeamMember ON account.user_id = projectTeamMember.project_memberID
       WHERE projectTeamMember.project_team_projectID = $1`,
      [projectID]
    );

    // Check if there are team members
    if (result.rows.length > 0) {
      // Return an array of team members
      return result.rows.map((member) => ({
        user_id: member.user_id,
        user_picture: member.user_picture,
        user_name: member.user_name,
        project_role: member.project_role,
        project_member_status: member.project_member_status,
        project_teamid: member.project_teamid
      }));
    } else {
      // Return an empty array if no team members
      return [];
    }
  } catch (error) {
    console.error('Error in projectModel.getProjectTeamMembersByProjectID:', error);
    throw error;
  }
};

projectModel.getProjectCommByID = async function (projectid) {
    try {
        const getProjectCommQuery = {
            text: `
                SELECT *
                FROM projectComm
                WHERE project_comm_projectID = $1
            `,
            values: [projectid],
        };

        const result = await pool.query(getProjectCommQuery);

        return result.rows[0]; // Return the project communication details
    } catch (error) {
        console.error('Error fetching project communication details:', error);
        throw error;
    }
};

projectModel.editBasicInfoByID = async function (projectid, projectDetails) {
    try {
        const editProjectQuery = {
            text: `
                UPDATE project
                SET 
                    project_name = $1,
                    project_description = $2,
                    project_mission = $3,
                    project_vision = $4,
                    project_worthy_of_note = $5,
                    project_status = $6,
                    project_city = $7,
                    project_state = $8,
                    project_country = $9
                WHERE
                    projectID = $10
            `,
            values: [
                projectDetails.project_name,
                projectDetails.project_description,
                projectDetails.project_mission,
                projectDetails.project_vision,
                projectDetails.project_worthy_of_note,
                projectDetails.project_status,
                projectDetails.project_city,
                projectDetails.project_state,
                projectDetails.project_country,
                projectid
            ],
        };

        await pool.query(editProjectQuery);
    } catch (error) {
        console.error('Error editing project basic info:', error);
        throw error;
    }
};

projectModel.editProjectRolesByID = async function (projectid, roleDetails) {
    try {
        // Check if project role exists
        const existingRoleQuery = {
            text: 'SELECT * FROM projectRole WHERE project_role_projectID = $1 AND project_role_name = $2',
            values: [projectid, roleDetails.project_role_name],
        };
        const { rowCount } = await pool.query(existingRoleQuery);

        if (rowCount > 0) {
            // If role exists, update its description
            const updateRoleQuery = {
                text: `
                    UPDATE projectRole
                    SET project_role_description = $1
                    WHERE project_role_projectID = $2 AND project_role_name = $3
                `,
                values: [roleDetails.project_role_description, projectid, roleDetails.project_role_name],
            };
            await pool.query(updateRoleQuery);
        } else {
            // If role doesn't exist, insert it
            const insertRoleQuery = {
                text: `
                    INSERT INTO projectRole (project_role_projectID, project_role_name, project_role_description)
                    VALUES ($1, $2, $3)
                `,
                values: [projectid, roleDetails.project_role_name, roleDetails.project_role_description],
            };
            await pool.query(insertRoleQuery);
        }
    } catch (error) {
        console.error('Error editing project roles:', error);
        throw error;
    }
};

projectModel.deleteRoleByOwnerID = async function (roleid, project_ownerid) {
    try {
        const deleteRoleQuery = {
            text: `
                DELETE FROM projectRole
                WHERE project_roleID = $1
                    AND project_role_projectID IN (
                        SELECT projectID
                        FROM project
                        WHERE project_ownerID = $2
                    )
            `,
            values: [roleid, project_ownerid],
        };
        await pool.query(deleteRoleQuery);
    } catch (error) {
        console.error('Error deleting project role:', error);
        throw error;
    }
};

projectModel.insertIntoProjectCommByProjectid = async function (projectCommDetails) {
    try {
        const { projectid, project_comm_website, project_comm_fb, project_comm_insta, project_comm_linkedin, project_comm_collablink } = projectCommDetails;

        // Check if a record with project_comm_projectID equal to projectid exists
        const existingRecordQuery = {
            text: `SELECT project_commID FROM projectComm WHERE project_comm_projectID = $1`,
            values: [projectid],
        };

        const { rowCount } = await pool.query(existingRecordQuery);

        if (rowCount > 0) {
            // Record exists, perform update
            const updateCommQuery = {
                text: `
                    UPDATE projectComm
                    SET 
                        project_comm_website = $1,
                        project_comm_fb = $2,
                        project_comm_insta = $3,
                        project_comm_linkedin = $4,
                        project_comm_collablink = $5
                    WHERE project_comm_projectID = $6
                `,
                values: [project_comm_website, project_comm_fb, project_comm_insta, project_comm_linkedin, project_comm_collablink, projectid],
            };

            await pool.query(updateCommQuery);
        } else {
            // Record does not exist, perform insert
            const insertCommQuery = {
                text: `
                    INSERT INTO projectComm (project_comm_projectID, project_comm_website, project_comm_fb, project_comm_insta, project_comm_linkedin, project_comm_collablink)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `,
                values: [projectid, project_comm_website, project_comm_fb, project_comm_insta, project_comm_linkedin, project_comm_collablink],
            };

            await pool.query(insertCommQuery);
        }
    } catch (error) {
        console.error('Error inserting or updating project communication:', error);
        throw error;
    }
};

// In the project model (projectModel.js)
projectModel.getTeamMemberByteamID = async function (project_teamid) {
    try {
      const result = await pool.query(
        `SELECT account.user_id, account.user_picture, account.user_name, projectTeamMember.project_time_commitment, projectTeamMember.project_role, projectTeamMember.project_role_why, projectTeamMember.project_member_status, projectTeamMember.project_memberID, projectTeamMember.project_teamID
         FROM account
         INNER JOIN projectTeamMember ON account.user_id = projectTeamMember.project_memberID
         WHERE projectTeamMember.project_teamID = $1`,
        [project_teamid]
      );
  
      return result.rows;
    } catch (error) {
      console.error('Error in projectModel.getTeamMemberByteamID:', error);
      throw error;
    }
};

projectModel.updateTeamMemberStatusByID = async function (project_teamid, new_status) {
    try {
        const queryText = `
            UPDATE projectTeamMember
            SET project_member_status = $1
            WHERE project_teamID = $2;
        `;
        const queryParams = [new_status, project_teamid];

        await pool.query(queryText, queryParams);
    } catch (error) {
        console.error('Error in projectModel.updateTeamMemberStatusByID:', error);
        throw error;
    }
};

module.exports = projectModel;