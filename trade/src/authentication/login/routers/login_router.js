const router = require('express').Router();
const loginController = require('../controllers/login_controller');
const validatorMiddleware = require('../../middlewares/validation_middleware')

router.get('/login', loginController.showLoginPage);
router.post('/login', validatorMiddleware.validateSignIn() ,loginController.login);
router.get('/logout', loginController.logout);
//router.get('/shopcart',  TradeHomeController.showcart);

module.exports = router;