const router = require('express').Router();
const TradeHomeController = require('../controllers/home_controller');


router.get('/:page',  TradeHomeController.showTradeHomePage);
router.get('/:category/:page',  TradeHomeController.showProductsByCategory);

router.get('/shopcart',  TradeHomeController.showcart);

module.exports = router;