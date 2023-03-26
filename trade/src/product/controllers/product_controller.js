
const Product = require('../../../../admin/src/common/config/app_admin_db').Product;



const showProductPage = async function (req, res, next) {
    
    const productName = req.params.productName;
    const product = await Product.findOne({productName});
    
    res.render('trade/src/product/views/product_page.ejs', { layout: 'trade/src/home/views/layout/home_layout.ejs',product});

}




module.exports = {
    showProductPage

}
