// const utilities = require("../utilities")
const baseController = {}

baseController.buildLandingPage = async function (req, res) {
    try {
        res.render('index', {
            title: 'Home | Vroom Now',
        });
    } catch (error) {
        console.error('Error building home page:', error);
        res.render('errors/error', {
            title: 'Error',
            message: 'An error occurred while building the home page',
        });
    }
};

baseController.buildErrorPage = async function (req, res, next) {
    res.render("errors/error", {
        title: "Error",
        message: "An error occured"
    })
}

module.exports = baseController