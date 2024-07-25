const userModel = require('../model/userAccountModel')

const util = {}

util.buildEditEducationPage = async function (req, res, next) {

      // Check if the user is authenticated
      if (!req.isAuthenticated()) {
        // Handle the case where the user is not authenticated, e.g., redirect to the login page
        res.redirect('/auth/login');
        return;
    }

    const { user_id } = req.user;
    // Fetch user education details from the database
    const education = await userModel.getUserEducation(user_id);


    let editEducation = '<h2>Education</h2>';

    editEducation += '<form action="../user-account/edit-education" method="post">';
    editEducation += '<fieldset>';
    // Education Information
    editEducation += '<label for="school_name">School Name:</label>';
    editEducation += '<input type="text" id="school_name" name="school_name" required>';
    
    editEducation += '<label for="degree_name">Degree Name:</label>';
    editEducation += '<input type="text" id="degree_name" name="degree_name" required>';
    
    editEducation += '<label for="start_date">Start Date:</label>';
    editEducation += '<input type="date" id="start_date" name="start_date">';
    
    editEducation += '<label for="end_date">End Date:</label>';
    editEducation += '<input type="date" id="end_date" name="end_date">';
    
    editEducation += '<button type="submit">Add School</button>';
    editEducation += '</fieldset>';
    
    editEducation += '<section class="education">';
    editEducation += '<h2>Education</h2>';
    editEducation += '<% if (education && education.length > 0) { %>';
    editEducation += '<% education.forEach(edu => { %>';
    editEducation += '<h3>School: </h3><p><%= edu.school_name %></p>';
    editEducation += '<h3>Degree/Diploma: </h3> <p><%= edu.degree_name %></p>';
    editEducation += '<h3>Start Date:</h3><p><%= edu.start_date.toISOString().split("T")[0] %></p>';
    editEducation += '<h3>End Date:</h3><p><%= edu.end_date.toISOString().split("T")[0] %></p>';
    editEducation += '<% }); %>';
    editEducation += '<% } else { %>';
    editEducation += '<p>No education information available.</p>';
    editEducation += '<% } %>';
    // Add more education details as needed
    editEducation += '</section>';
    editEducation += '</form>';
    
    return editEducation;
}

module.exports = util;