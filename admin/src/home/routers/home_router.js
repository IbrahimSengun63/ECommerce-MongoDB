const router = require('express').Router();
const homeController = require('../controllers/home_controller');
const authMiddleware = require('../../common/middlewares/auth_middleware');

router.get('/', authMiddleware.checkSignIn, homeController.showAdminPanel);

module.exports = router;