const { validationResult } = require('express-validator');
const passport = require('passport');



function checkValidateError(req, res, redirect) {
    const errorsOnValidation = validationResult(req);
    if (!errorsOnValidation.isEmpty()) {
        req.flash('errors', errorsOnValidation.array());
        res.redirect(redirect);
        return false;
    }
    return true;
}

const showLoginPage = (req, res, next) => {
    res.render('trade/src/authentication/login/views/login.ejs', { layout: 'trade/src/authentication/views/layout/authentication.ejs' });
    //res.render('admin/src/login/views/login.ejs', { layout: 'admin/src/login/views/layout/login_layout.ejs' });
};



const login = (req, res, next) => {
    
    req.flash('userName', req.body.userName);
    const valid = checkValidateError(req, res, '/login');
    if (valid) {
        require('../../config/trade_passport_local')(passport,req)
        passport.authenticate('local-login', {
            
            successRedirect: '/home/1',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }

};

const logout = (req, res, next) => {
    req.logout();
    req.session.destroy((error) => {
        res.clearCookie('connect.sid');
        res.render('trade/src/authentication/login/views/login.ejs', { layout: 'trade/src/authentication/views/layout/authentication.ejs', success: [{ message: 'success logout' }] });
    });

}

module.exports = {
    showLoginPage,
    login,
    logout

}
