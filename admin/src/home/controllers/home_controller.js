const User = require('../../common/config/app_admin_db').User;
const LocalStrategy = require('passport-local').Strategy;

const showAdminPanel = function (req, res, next) {
    res.render('admin/src/home/views/index.ejs', { layout: 'admin/src/home/views/layout/home_layout.ejs', title: "home-admin" });
}

module.exports = {
    showAdminPanel
}
