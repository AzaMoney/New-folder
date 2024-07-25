const { pool } = require('../config/databaseConfig');

const admin = {};

admin.getAllAdmin = async function () {
    try {
        const getAllAdminQuery = `
            SELECT admin.*, account.user_name, account.user_email
            FROM admin
            INNER JOIN account ON admin.admin_userID = account.user_id
        `;
        const result = await pool.query(getAllAdminQuery);
        return result.rows; // Return the list of admin users with their details
    } catch (error) {
        console.error('Error fetching all admin users:', error);
        throw error;
    }
}

admin.insertIntoAdmin = async function (admin_userID, admin_role) {
    try {
        const insertAdminQuery = {
            text: `
                INSERT INTO admin (admin_userID, admin_role)
                VALUES ($1, $2)
                RETURNING *
            `,
            values: [admin_userID, admin_role],
        };

        const result = await pool.query(insertAdminQuery);
        return result.rows[0]; // Return the newly inserted admin data
    } catch (error) {
        console.error('Error inserting into admin table:', error);
        throw error;
    }
}

admin.updateAdminRole = async function (adminId, newRole) {
    try {
        // Perform the update query to change the admin's role
        const updateAdminRoleQuery = {
            text: `
                UPDATE admin
                SET admin_role = $1
                WHERE adminID = $2
            `,
            values: [newRole, adminId],
        };

        await pool.query(updateAdminRoleQuery);
    } catch (error) {
        console.error('Error updating admin role in the database:', error);
        throw error;
    }
}

admin.deleteAdmin = async function (adminId) {
    try {
        // Perform the delete query to remove the admin from the database
        const deleteAdminQuery = {
            text: `
                DELETE FROM admin
                WHERE adminID = $1
            `,
            values: [adminId],
        };

        await pool.query(deleteAdminQuery);
    } catch (error) {
        console.error('Error deleting admin from the database:', error);
        throw error;
    }
}



module.exports = admin;