const { validationResult } = require('express-validator');
const User = require('../../config/app_trade_db').User;
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


async function sendValitadionMail(user) {

    const key = process.env.JWT_SECRET;
    const jwtInfo = { id: user._id, email: user.email }
    const jwtToken = jwt.sign(jwtInfo, key, { expiresIn: '1d' });

    const url = process.env.WEB_SITE_URL + 'verify?token=' + jwtToken;
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
        subject: 'verify email',
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

const showRegisterPage = (req, res, next) => {
    res.render('trade/src/authentication/register/views/register.ejs', { layout: 'trade/src/authentication/views/layout/authentication.ejs' });
};

const register = async (req, res, next) => {

    req.flash('firstName', req.body.firstName);
    req.flash('userName', req.body.userName);
    req.flash('lastName', req.body.lastName);
    req.flash('email', req.body.email);

    const valid = checkValidateError(req, res, '/register');

    if (valid) {
        try {

            const _user = await User.findOne({ email: req.body.email }) || await User.findOne({ userName: req.body.userName })
            
            if (_user && _user.mailActive == true) {
                if (_user.userName == req.body.userName) {
                    req.flash('errors', [{ message: "username is not avaiable" }]);
                    res.redirect('/register');
                } else {
                    req.flash('errors', [{ message: "email is not avaiable" }]);
                    res.redirect('/register');
                }


            } else if ((_user && _user.mailActive == false) || _user == null) {

                if (_user) {
                    await User.findByIdAndRemove({ _id: _user._id });
                }

                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    userName: req.body.userName,
                    password: await bcrypt.hash(req.body.password, 10)
                });
                await newUser.save()

                await sendValitadionMail(newUser);

                req.flash('success', [{ message: 'check mail' }]);
                res.redirect('/login');
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const verifyMail = (req, res, next) => {

    const token = req.query.token;
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
                if (error) {
                    req.flash('errors', [{ message: 'decode error' }]);
                    res.redirect('/login');
                } else {
                    const tokenId = decoded.id;

                    const result = await User.findByIdAndUpdate(tokenId, { mailActive: true })
                    if (result) {
                        req.flash('success', [{ message: 'succesfuly verified' }]);
                        res.redirect('/login');
                    } else {
                        req.flash('errors', [{ message: 'not verified' }]);
                        res.redirect('/login');
                    }
                }
            });
        } catch (error) {

        }
    } else {
        req.flash('errors', [{ msg: 'not verified' }]);
        res.redirect('/login');
    }
}

module.exports = {
    showRegisterPage,
    register,
    verifyMail
}