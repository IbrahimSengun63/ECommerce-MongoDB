const router = require('express').Router();
const productController = require('../controllers/product_controller')
const validatorMiddleware = require('../../common/middlewares/validation_middleware');
const authMiddleware = require('../../common/middlewares/auth_middleware');
const multerProductConfig = require('../config/multer_product_config');

router.get('/add', productController.showProductAddPage);
//router.post('/add', authMiddleware.isNotSignIn, validatorMiddleware.validateProductAdd(), productController.productAdd);
router.post('/add', multerProductConfig.single('image'), productController.productAdd);

router.get('/list',productController.showProductListPage);


router.post('/edit',productController.showProductEditPage);
router.post('/edit/done',multerProductConfig.single('image'),productController.productEdit);
router.post('/delete',productController.productDelete);
router.get('/generate',productController.generateFakeData);

module.exports = router;