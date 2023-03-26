const router = require('express').Router();
const loginController = require('../controllers/login_controller')
const validatorMiddleware = require('../../common/middlewares/validation_middleware');
const authMiddleware = require('../../common/middlewares/auth_middleware');


router.get('/login', loginController.showLoginPage);
router.post('/login', loginController.login);

router.get('/forget-password', loginController.showForgetPasswordPage);
router.post('/forget-password', validatorMiddleware.validateEmail(), loginController.forgetPassword);

router.get('/reset-password/:id/:token', loginController.showResetPasswordPage);
router.get('/reset-password', loginController.showResetPasswordPage);
router.post('/reset-password', validatorMiddleware.validateNewPassword(), loginController.resetPassword);

router.get('/register', loginController.showRegisterPage);
router.post('/register', validatorMiddleware.validateNewUser(), loginController.register);
router.get('/verify', loginController.verifyMail)


router.get('/logout', authMiddleware.checkSignIn, loginController.logout);

module.exports = router;