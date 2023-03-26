const router = require('express').Router();
const profileController = require('../controllers/profile_controller');
const authMiddleware = require('../../common/middlewares/auth_middleware');
const multerProfileConfig = require('../config/multer_profile_config');

router.get('/', authMiddleware.checkSignIn, profileController.showProfilePage);
router.post('/update-profile', authMiddleware.checkSignIn, multerProfileConfig.single('avatar'), profileController.updateProfile);


module.exports = router;
