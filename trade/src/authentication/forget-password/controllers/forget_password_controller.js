const { validationResult } = require('express-validator');
const User = require('../../config/app_trade_db').User;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


async function sendResetPasswordMail(user) {

    const key = process.env.JWT_SECRET + "-" + user.password;
    const jwtInfo = { id: user._id, email: user.email }
    const jwtToken = jwt.sign(jwtInfo, key, { expiresIn: '1d' });

    const url = process.env.WEB_SITE_URL + 'reset-password/' + user._id + "/" + jwtToken;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    await transporter.sendMail({
        from: 'app <info@app.com>',
        to: user.email,
        subject: 'reset password',
        text: 'click the link:' + url,
    }, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            transporter.close();
        }

    });

}




function checkValidateError(req, res, redirect) {
    const errorsOnValidation = validationResult(req);
    if (!errorsOnValidation.isEmpty()) {
        req.flash('errors', errorsOnValidation.array());
        res.redirect(redirect);
        return false;
    }
    return true;
}

const showForgetPasswordPage = (req, res, next) => {
    res.render('trade/src/authentication/forget-password/views/forget-password.ejs', { layout: 'trade/src/authentication/views/layout/authentication.ejs' });
};

const forgetPassword = async (req, res, next) => {

    req.flash('email', req.body.email);
    const pass = checkValidateError(req, res, '/forget-password');
    if (pass) {
        try {
            const _user = await User.findOne({ email: req.body.email, mailActive: true })
            if (_user) {

                await sendResetPasswordMail(_user)

                req.flash('success', [{ message: 'check mail' }]);
                res.redirect('/login');

            } else {
                req.flash('errors', [{ message: "email is not avaiable" }]);
                req.flash('email', req.body.email);
                res.redirect('/forget-password');
            }



        } catch (error) {
            console.log(error);
        }
    }
}



module.exports = {
    showForgetPasswordPage,
    forgetPassword,


}
