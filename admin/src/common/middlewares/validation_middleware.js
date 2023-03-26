const { body } = require('express-validator');


const validateNewUser = () => {
    return [
        body('email').trim().isEmail().withMessage('use valid email!'),
        body('password').trim().isLength({ min: 2 }).withMessage('at least 2 character'),
        body('firstName').trim().isLength({ min: 2 }).withMessage('at least 2 character'),
        body('lastName').trim().isLength({ min: 2 }).withMessage('at least 2 character'),
        body('re-password').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('not match password');
            } else {
                return true;
            }
        })
    ];
}

const validateSignIn = () => {
    return [
        body('email').trim().isEmail().withMessage('use valid email!'),
    ];
}

const validateEmail = () => {
    return [
        body('email').trim().isEmail().withMessage('use valid email!'),
        
    ];
}

const validateNewPassword = () => {
    return [
        body('password').trim().isLength({ min: 2 }).withMessage('at least 2 character'),
        body('re-password').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('not match password');
            } else {
                return true;
            }
        })
    ];
}


module.exports = {
    validateNewUser,
    validateSignIn,
    validateEmail,
    validateNewPassword
};