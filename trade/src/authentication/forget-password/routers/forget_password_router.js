const router = require('express').Router();
const forgetPasswordController = require('../controllers/forget_password_controller');
const validatorMiddleware = require('../../middlewares/validation_middleware');

router.get('/forget-password', forgetPasswordController.showForgetPasswordPage);
router.post('/forget-password', validatorMiddleware.validateEmail(), forgetPasswordController.forgetPassword);

module.exports = router;