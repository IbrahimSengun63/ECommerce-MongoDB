const { validationResult } = require('express-validator');
const User = require('../../common/config/app_admin_db').User;
const passport = require('passport');
require('../config/admin_pasaport_local')(passport)
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

function checkValidateError(req, res, redirect) {
    const errorsOnValidation = validationResult(req);
    if (!errorsOnValidation.isEmpty()) {
        req.flash('validation_errors', errorsOnValidation.array());
        res.redirect(redirect);
        return false;
    }
    return true;
}

async function findUser(filter) {
    return await User.findOne(filter);
}

async function deleteUser(filter) {
    return await User.findByIdAndRemove(filter);
}

async function createUser(filter) {
    const user = new User(filter);
    await user.save();
    return user;
}
async function updateUser(filter, data) {
    return await User.findByIdAndUpdate(filter, data);
}

function createJwtToken(id, email, secret) {
    const key = secret ? process.env.JWT_SECRET + "-" + secret : process.env.JWT_SECRET;
    const jwtInfo = { id: id, email: email }
    return jwt.sign(jwtInfo, key, { expiresIn: '1d' });
}

const showLoginPage = (req, res, next) => {
    res.render('admin/src/login/views/login.ejs', { layout: 'admin/src/login/views/layout/login_layout.ejs' });
};




const login = (req, res, next) => {
    
    req.flash('email', req.body.email);
    const pass = checkValidateError(req, res, '/login');
    if (pass) {
        
        passport.authenticate('local', {
            
            successRedirect: '/admin/panel',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }

};





const showForgetPasswordPage = (req, res, next) => {
    res.render('admin/src/login/views/forget-password.ejs', { layout: 'admin/src/login/views/layout/login_layout.ejs' });
};

const forgetPassword = async (req, res, next) => {

    req.flash('email', req.body.email);
    const pass = checkValidateError(req, res, '/admin/forget-password');
    if (pass) {
        try {
            const _user = findUser({ email: req.body.email, mailActive: true });
            if (_user) {

                const jwtToken = createJwtToken(_user._id, _user._email, _user.password)


                const url = process.env.WEB_SITE_URL + 'admin/reset-password/' + _user._id + "/" + jwtToken;
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASS
                    }
                });
                await transporter.sendMail({
                    from: 'app <info@app.com>',
                    to: _user.email,
                    subject: 'reset password',
                    text: 'click the link:' + url,
                }, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        transporter.close();
                    }

                });
                req.flash('success_message', [{ msg: 'check mail' }]);
                res.redirect('/admin/login');


            } else {
                req.flash('validation_errors', [{ msg: "email is not avaiable" }]);
                req.flash('email', req.body.email);
                res.redirect('/admin/forget-password');
            }

            //send mail


        } catch (error) {

        }
    }
}


const showRegisterPage = (req, res, next) => {
    res.render('admin/src/login/views/register.ejs', { layout: 'admin/src/login/views/layout/login_layout.ejs' });
};

const register = async (req, res, next) => {

    req.flash('firstName', req.body.firstName);
    req.flash('lastName', req.body.lastName);
    req.flash('email', req.body.email);

    const pass = checkValidateError(req, res, '/admin/register');
    if (pass) {
        try {
            const _user = findUser({ email: req.body.email })
            if (_user && _user.mailActive == true) {
                req.flash('validation_errors', [{ msg: "email is not avaiable" }]);
                res.redirect('/admin/register');
            } else if ((_user && _user.mailActive == false) || _user == null) {

                if (_user) {
                    deleteUser({ _id: _user._id })
                }

                const newUser = createUser({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: await bcrypt.hash(req.body.password, 10)
                });

                const jwtToken = createJwtToken(newUser.id, newUser.email)

                //send mail

                const url = process.env.WEB_SITE_URL + 'verify?id=' + jwtToken;
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASS
                    }
                });
                await transporter.sendMail({
                    from: 'app <info@app.com>',
                    to: newUser.email,
                    subject: 'verify email',
                    text: 'click the link:' + url,
                }, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        transporter.close();
                    }

                });
                req.flash('success_message', [{ msg: 'check mail' }]);
                res.redirect('/admin/login');
            }
        } catch (error) {

        }
    }
};

const logout = (req, res, next) => {
    req.logout();
    req.session.destroy((error) => {
        res.clearCookie('connect.sid');
        res.render('admin/src/login/views/login.ejs', { layout: 'admin/src/login/views/layout/login_layout.ejs', success_message: [{ msg: 'success logout' }] });
    });

}

const verifyMail = (req, res, next) => {

    const token = req.query.id;
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
                if (error) {
                    req.flash('verify_errors', [{ msg: 'not verified' }]);
                    res.redirect('/admin/login');
                } else {
                    const tokenId = decoded.id;
                    const result = updateUser(tokenId, { mailActive: true })
                    if (result) {
                        req.flash('success_message', [{ msg: 'succesfuly verified' }]);
                        res.redirect('/admin/login');
                    } else {
                        req.flash('verify_errors', [{ msg: 'not verified' }]);
                        res.redirect('/admin/login');
                    }
                }
            });
        } catch (error) {

        }
    } else {
        req.flash('verify_errors', [{ msg: 'not verified' }]);
        res.redirect('/admin/login');
    }
}


const showResetPasswordPage = async (req, res, next) => {
    const id = req.params.id;
    const token = req.params.token;

    if (id && token) {

        const user = findUser({ _id: id });
        const secret = process.env.JWT_SECRET + "-" + user.password;

        try {
            jwt.verify(token, secret, async (error, decoded) => {
                if (error) {
                    req.flash('verify_errors', [{ msg: 'invalid token' }]);
                    res.redirect('/admin/forget-password');
                } else {
                    res.render('admin/src/login/views/reset-password.ejs', { id: id, token: token, layout: 'admin/src/login/views/layout/login_layout.ejs' })
                }
            });
        } catch (error) {

        }

    } else {
        req.flash('validation_errors', [{ msg: "incorrect url" }]);

        res.redirect('/admin/forget-password');
    }
}



const resetPassword = async (req, res, next) => {

    req.flash('password', req.body.password);
    let redirectUrl = '/admin/reset-password/' + req.body.id + "/" + req.body.token;
    const pass = checkValidateError(req, res, redirectUrl);
    if (pass) {
        const user = findUser({ _id: req.body.id, mailActive: true });
        const secret = process.env.JWT_SECRET + "-" + user.password;

        try {
            jwt.verify(req.body.token, secret, async (error, decoded) => {
                if (error) {
                    req.flash('verify_errors', [{ msg: 'invalid token' }]);
                    res.redirect('/admin/forget-password');
                } else {
                    const password = await bcrypt.hash(req.body.password, 10);
                    const result = updateUser(req.body.id, { password })
                    if (result) {
                        req.flash('success_message', [{ msg: 'succesfuly change password' }]);
                        res.redirect('/admin/login');
                    } else {
                        req.flash('verify_errors', [{ msg: 'not verified' }]);
                        res.redirect('/admin/forget-password');
                    }
                }
            });
        } catch (error) {

        }
    }




}

module.exports = {
    showLoginPage,
    showForgetPasswordPage,
    showRegisterPage,
    register,
    verifyMail,
    login,
    forgetPassword,
    showResetPasswordPage,
    resetPassword,
    logout
}