const User = require('../../common/config/app_admin_db').User;
const LocalStrategy = require('passport-local').Strategy;

const showProfilePage = function (req, res, next) {

    res.render('admin/src/profile/views/profile.ejs', { user: req.user, layout: 'admin/src/home/views/layout/home_layout.ejs', title: "profile" });
}

const updateProfile = async function (req, res, next) {
    
    const values = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: (req.file != undefined ? req.file.filename : req.user.avatar)
    }
    try {
        const done = await User.findByIdAndUpdate(req.user._id,values);
        res.redirect('/admin/profile')
    } catch (error) {
        
    }


}

module.exports = {
    showProfilePage,
    updateProfile
}
