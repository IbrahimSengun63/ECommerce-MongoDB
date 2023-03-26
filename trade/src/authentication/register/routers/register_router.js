const router = require('express').Router();
const registerController = require('../controllers/register_controller');
const validatorMiddleware = require('../../middlewares/validation_middleware');

router.get('/register',  registerController.showRegisterPage);
router.post('/register', validatorMiddleware.validateNewUser()  ,registerController.register);

router.get('/verify', registerController.verifyMail)

module.exports = router;