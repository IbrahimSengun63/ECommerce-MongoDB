const { body } = require('express-validator');


const validateNewUser = () => {
    return [
        body('email').trim().isEmail(),
        body('userName').trim(),
        body('password').trim().isLength({ min: 2 }),
        body('firstName').trim().isLength({ min: 2 }),
        body('lastName').trim().isLength({ min: 2 }),
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
        body('userName').trim(),
    ];
}

const validateEmail = () => {
    return [
        body('email').trim().isEmail(),
        
    ];
}

const validateNewPassword = () => {
    return [
        body('password').trim().isLength({ min: 2 }),
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