const router = require('express').Router();
const reset_password_controller = require('../controllers/reset_password_controller');
const validatorMiddleware = require('../../middlewares/validation_middleware');


router.get('/reset-password/:id/:token', reset_password_controller.showResetPasswordPage);
router.get('/reset-password', reset_password_controller.showResetPasswordPage);
router.post('/reset-password',validatorMiddleware.validateNewPassword(), reset_password_controller.resetPassword);

module.exports = router;