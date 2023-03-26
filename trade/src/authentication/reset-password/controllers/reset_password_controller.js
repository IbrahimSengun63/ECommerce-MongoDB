const { validationResult } = require('express-validator');
const User = require('../../config/app_trade_db').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function checkValidateError(req, res, redirect) {
    const errorsOnValidation = validationResult(req);
    if (!errorsOnValidation.isEmpty()) {
        req.flash('errors', errorsOnValidation.array());
        res.redirect(redirect);
        return false;
    }
    return true;
}

const showResetPasswordPage = async (req, res, next) => {
    const id = req.params.id;
    const token = req.params.token;

    if (id && token) {

        const user = await User.findOne({ _id: id });
        const secret = process.env.JWT_SECRET + "-" + user.password;

        try {
            jwt.verify(token, secret, async (error, decoded) => {
                if (error) {
                    req.flash('errors', [{ message: 'invalid token' }]);
                    res.redirect('/forget-password');
                } else {
                    res.render('trade/src/authentication/reset-password/views/reset-password.ejs', { layout: 'trade/src/authentication/views/layout/authentication.ejs', id, token })
                }
            });
        } catch (error) {

        }

    } else {
        req.flash('errors', [{ message: "incorrect url" }]);

        res.redirect('/forget-password');
    }
}



const resetPassword = async (req, res, next) => {

    req.flash('password', req.body.password);

    let redirectUrl = '/reset-password/' + req.body.id + "/" + req.body.token;
    const pass = checkValidateError(req, res, redirectUrl);
    if (pass) {
        const user = await User.findOne({ _id: req.body.id, mailActive: true })
        const secret = process.env.JWT_SECRET + "-" + user.password;

        try {
            jwt.verify(req.body.token, secret, async (error, decoded) => {
                if (error) {
                    req.flash('errors', [{ message: 'invalid token' }]);
                    res.redirect('/forget-password');
                } else {
                    const password = await bcrypt.hash(req.body.password, 10);
                    const result = await User.findByIdAndUpdate(req.body.id, { password })
                    if (result) {
                        req.flash('success', [{ message: 'succesfuly change password' }]);
                        res.redirect('/login');
                    } else {
                        req.flash('errors', [{ message: 'not verified' }]);
                        res.redirect('/forget-password');
                    }
                }
            });
        } catch (error) {

        }
    }

}

module.exports = {
    showResetPasswordPage,
    resetPassword


}
