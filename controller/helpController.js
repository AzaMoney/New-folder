

const helpController = {};

helpController.buildContactUsPage = async function (req, res, next) {
    res.render('help/contact-us', {
        title: "Contact Us"
    })
}

module.exports = helpController;