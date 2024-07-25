-- Create the 'account' table
CREATE TABLE account (
    provider_name VARCHAR(255),
    user_id VARCHAR(255),
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_phone VARCHAR(20),
    user_website VARCHAR(255),
    user_linkedin VARCHAR(255),
    user_github VARCHAR(255),
    user_picture VARCHAR(255),
    user_nickname VARCHAR(255),
    user_about TEXT,
    PRIMARY KEY (user_id)
);

-- Create the 'userLanguage' table with references
CREATE TABLE userLanguage (
    languageID SERIAL PRIMARY KEY,
    language_user_id VARCHAR(255) REFERENCES account(user_id) ON DELETE SET NULL,
    language_name VARCHAR(255)
);

-- Create the 'userSkill' table with references
CREATE TABLE userSkill (
    skillID SERIAL PRIMARY KEY,
    skill_user_id VARCHAR(255) REFERENCES account(user_id) ON DELETE SET NULL,
    skill_name VARCHAR(255)
);

-- Create the 'userEducation' table with references
CREATE TABLE userEducation (
    educationID SERIAL PRIMARY KEY,
    education_user_id VARCHAR(255) REFERENCES account(user_id) ON DELETE SET NULL,
    school_name VARCHAR(255),
    degree_name VARCHAR(255),
    start_date DATE,
    end_date DATE
);

-- Create the 'userCertification' table with references
CREATE TABLE userCertification (
    certificateID SERIAL PRIMARY KEY,
    certificate_user_id VARCHAR(255) REFERENCES account(user_id) ON DELETE SET NULL,
    issuer_name VARCHAR(255),
    certificate_name VARCHAR(255),
    issue_date DATE,
    expiration_date DATE
);

-- Create the 'userEmployment' table with references
CREATE TABLE userEmployment (
    employmentID SERIAL PRIMARY KEY,
    employment_user_id VARCHAR(255) REFERENCES account(user_id) ON DELETE SET NULL,
    organization_name VARCHAR(255),
    position_name VARCHAR(255),
    start_date DATE,
    end_date DATE,
    employment_location_city VARCHAR(255),
    employment_location_state VARCHAR(255),
    employment_location_country VARCHAR(255),
    employment_type VARCHAR(255),
    employment_status VARCHAR(255),
    employment_description TEXT
);

-- Create the 'employmentDescription' table with references
CREATE TABLE employmentDescription (
    descriptionID SERIAL PRIMARY KEY,
    emploment_des_id INTEGER REFERENCES userEmployment(employmentID) ON DELETE SET NULL,
    employment_description TEXT
);

-- Create the 'project' table with references
CREATE TABLE project (
    projectID SERIAL PRIMARY KEY,
    project_ownerID VARCHAR(255) REFERENCES account(user_id) ON DELETE SET NULL,
    project_name VARCHAR(255),
    project_description TEXT,
    project_mission TEXT,
    project_vision TEXT,
    project_worthy_of_note TEXT,
    project_status VARCHAR(255),
    project_city VARCHAR(255),
    project_state VARCHAR(255),
    project_country VARCHAR(255)
);

-- Create the 'projectRole' table with references
CREATE TABLE projectRole (
    project_roleID SERIAL PRIMARY KEY,
    project_role_projectID INTEGER REFERENCES project(projectID) ON DELETE SET NULL,
    project_role_name VARCHAR(255),
    project_role_description TEXT
);

-- Create the 'projectTeamMember' table with references
CREATE TABLE projectTeamMember (
    project_teamID SERIAL PRIMARY KEY,
    project_team_projectID INTEGER REFERENCES project(projectID) ON DELETE SET NULL,
    project_memberID VARCHAR(255) REFERENCES account(user_id) ON DELETE SET NULL,
    project_time_commitment VARCHAR(255),
    project_role VARCHAR(255),
    project_role_why TEXT,
    project_member_status VARCHAR(255)
);

-- Create the 'projectComm' table with references
CREATE TABLE projectComm (
    project_commID SERIAL PRIMARY KEY,
    project_comm_projectID INTEGER REFERENCES project(projectID) ON DELETE SET NULL,
    project_comm_website VARCHAR(255),
    project_comm_fb VARCHAR(255),
    project_comm_insta VARCHAR(255),
    project_comm_linkedin VARCHAR(255),
    project_comm_collablink VARCHAR(255)
);

-- Create the 'mentorship' table with references
CREATE TABLE mentorship (
    mentorshipID SERIAL PRIMARY KEY,
    menteeID VARCHAR(255) REFERENCES account(user_id) ON DELETE SET NULL,
    mentorship_industry VARCHAR(255),
    mentorship_topic VARCHAR(255),
    mentorship_goal TEXT,
    action_on_goal TEXT,
    why_a_mentor TEXT
);

-- Create the 'mentorArea' table with references
CREATE TABLE mentorArea (
    mentorAreaID SERIAL PRIMARY KEY,
    mentorshipAreaID INTEGER REFERENCES mentorship(mentorshipID) ON DELETE SET NULL,
    mentorID VARCHAR(255) REFERENCES account(user_id) ON DELETE SET NULL,
    why_good_fit TEXT,
    mentorArea_status VARCHAR(255)
);

CREATE TABLE admin (
    adminID SERIAL PRIMARY KEY,
    admin_userID VARCHAR REFERENCES account(user_id) on DELETE SET NULL,
    admin_role VARCHAR(255) NOT NULL
);