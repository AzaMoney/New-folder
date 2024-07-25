// Function to export the page as a PDF
async function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Add content to the PDF
  doc.text("Profile Information", 10, 10);
  
  // Add content from sections (you may want to format this better)
  doc.text(document.querySelector('.basic-info').innerText, 10, 20);
  doc.text(document.querySelector('.sixtySeconds').innerText, 10, 40);
  doc.text(document.querySelector('.contact').innerText, 10, 60);
  doc.text(document.querySelector('.education').innerText, 10, 80);
  doc.text(document.querySelector('.certificate').innerText, 10, 100);
  doc.text(document.querySelector('.experience').innerText, 10, 120);
  doc.text(document.querySelector('.skills').innerText, 10, 140);
  doc.text(document.querySelector('.languages').innerText, 10, 160);
  
  // Save the PDF
  doc.save('profile.pdf');
}

// Function to export the page as a DOC
async function exportToDOC() {
  try {
    const { PizZip, Docxtemplater, saveAs } = window;

    // Ensure that these objects are available
    if (!PizZip || !Docxtemplater || !saveAs) {
      throw new Error('Required objects not found in docx libraries');
    }

    const content = {
      basicInfo: document.querySelector('.basic-info').innerText,
      sixtySeconds: document.querySelector('.sixty-seconds').innerText,
      contact: document.querySelector('.contact').innerText,
      education: document.querySelector('.education').innerText,
      certificates: document.querySelector('.certificate').innerText,
      experience: document.querySelector('.experience').innerText,
      skills: document.querySelector('.skills').innerText,
      languages: document.querySelector('.languages').innerText
    };

    // Define the template
    const template = `
      Profile Information
      ===================
      
      Basic Info
      ----------
      {{basicInfo}}
      
      In 60 Seconds
      -------------
      {{sixtySeconds}}
      
      Contact Information
      -------------------
      {{contact}}
      
      Education
      ---------
      {{education}}
      
      Certificates
      ------------
      {{certificates}}
      
      Experience
      ----------
      {{experience}}
      
      Skills
      ------
      {{skills}}
      
      Languages
      ---------
      {{languages}}
    `;

    // Create a new PizZip instance
    const zip = new PizZip();

    // Create a file with the template content
    zip.file("template.docx", template);

    // Load the zip file into Docxtemplater
    const doc = new Docxtemplater().loadZip(zip);

    // Set the template variables
    doc.setData(content);

    // Render the document with the data
    doc.render();

    // Generate the DOCX file as a Blob
    const blob = doc.getZip().generate({ type: "blob" });

    // Save the file using FileSaver.js
    saveAs(blob, "profile.docx");

  } catch (error) {
    console.error('Error exporting to DOC:', error);
    // Handle the error as needed
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeMenuOption = document.getElementById('close-menu-option');
  const mobileNav = document.querySelector('.header-nav');

  // Function to open mobile menu
  function openMobileMenu() {
    mobileNav.style.display = 'block';
    closeMenuOption.style.display = 'block'; // Display close icon
    hamburgerIcon.style.display = 'none'; // Hide hamburger icon
  }

  // Function to close mobile menu
  function closeMobileMenu() {
    mobileNav.style.display = 'none';
    closeMenuOption.style.display = 'none'; // Hide close icon
    hamburgerIcon.style.display = 'block'; // Display hamburger icon
  }

  // Event listener for hamburger icon click
  hamburgerIcon.addEventListener('click', openMobileMenu);

  // Event listener for close menu option click
  closeMenuOption.addEventListener('click', closeMobileMenu);
});

function addRole() {
  const selectedRolesDiv = document.getElementById('selectedRoles');
  const selectedRole = document.getElementById('roles').value;
  const roleDescription = document.getElementById('roleDescription').value;

  if (selectedRole && roleDescription) {
    const newRoleElement = document.createElement('p');
    newRoleElement.textContent = `${selectedRole}: ${roleDescription}`;
    selectedRolesDiv.appendChild(newRoleElement);

    // Clear selected role and description
    document.getElementById('roles').value = '';
    document.getElementById('roleDescription').value = '';
  } else {
    alert('Please select a role and provide a description.');
  }
}

function showTeamDetailsForm() {
  // Hide the idea form
  document.getElementById('ideaForm').style.display = 'none';
  // Show the team details form
  document.getElementById('teamDetailsForm').style.display = 'block';
}

function showIdeaForm() {
  // Hide the team details form
  document.getElementById('teamDetailsForm').style.display = 'none';
  // Show the idea form
  document.getElementById('ideaForm').style.display = 'block';
}

// Functions to open and close modal boxes
function openJoinProjectModal() {
  document.getElementById('joinProjectModal').style.display = 'flex';
}

function closeJoinProjectModal() {
  document.getElementById('joinProjectModal').style.display = 'none';
}

function openContactOwnerModal() {
  document.getElementById('contactOwnerModal').style.display = 'flex';
}

function closeContactOwnerModal() {
  document.getElementById('contactOwnerModal').style.display = 'none';
}

function openReportProjectModal() {
  document.getElementById('reportProjectModal').style.display = 'flex';
}

function closeReportProjectModal() {
  document.getElementById('reportProjectModal').style.display = 'none';
}

function openEditBasicInfor() {
  document.getElementById('editBasicInfoModal').style.display = 'flex';
}

function closeEditBasicInfoModal() {
  document.getElementById('editBasicInfoModal').style.display = 'none';
}

function openEditRole() {
  document.getElementById('editRoleModal').style.display = 'flex';
}

function closeEditRoleModal() {
  document.getElementById('editRoleModal').style.display = 'none';
}

function openEditComm() {
  document.getElementById('editContactCommModal').style.display = 'flex';
}

function closeEditContactCommModal() {
  document.getElementById('editContactCommModal').style.display = 'none';
}

// Function to open the terminate role modal
function openTerminateRoleModal() {
  var modal = document.getElementById('terminateRoleModal');
  modal.style.display = 'block';
}

// Function to close the terminate role modal
function closeTerminateRoleModal() {
  var modal = document.getElementById('terminateRoleModal');
  modal.style.display = 'none';
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
  var modal = document.getElementById('terminateRoleModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Function to open the edit mentorship modal
function openEditMentorshipModal() {
  var modal = document.getElementById('editMentorshipModal');
  modal.style.display = 'block';
}

// Function to close the edit mentorship modal
function closeEditMentorshipModal() {
  var modal = document.getElementById('editMentorshipModal');
  modal.style.display = 'none';
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
  var modal = document.getElementById('editMentorshipModal');
  if (event.target == modal) {
      modal.style.display = 'none';
  }
}

function copyProfileLink(nickname) {
  const baseURL = window.location.origin;
  const profileLink = `${baseURL}/profile/individual/${nickname}`;
  const tempInput = document.createElement('input');
  tempInput.value = profileLink;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  alert(`Copied to clipboard: ${profileLink}`);
}