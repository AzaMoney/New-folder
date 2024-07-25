const util = {};

util.header = function (req, res, next) {
//   let isAuthenticated = res.locals.isAuthenticated || false; // assuming isAuthenticated is available in res.locals

  let header = '<header>';

  if (isAuthenticated) {
    header += `
      <!-- <button class="btn btn-primary btn-block" onclick="window.location='/user-account/my-account'">My Account</button>
      <button class="btn btn-primary btn-block" onclick="window.location='/auth/logout'">Log Out</button> -->
    `;
  } else {
    header += `
      <button class="btn btn-primary btn-block" onclick="window.location='/auth/login'">Login</button>
      <button class="btn btn-primary btn-block" onclick="window.location='/auth/signup'">Sign Up</button>
    `;
  }

  header += '</header>';

  return header;
};

module.exports = util;