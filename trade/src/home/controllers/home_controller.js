
const Product = require('../../../../admin/src/common/config/app_admin_db').Product;

async function getProducts(filter = undefined) {
    const products = filter == undefined ? await Product.find().lean() : await Product.find(filter).lean();
    return products;
}

async function eliminateSameCategories() {

    const products = await Product.find().lean();

    const categories = [];

    for (let i = 0; i < products.length; i++) {
        let element1 = products[i].category;
        let same = false;
        for (let j = products.length - 1; i < j; j--) {
            let element2 = products[j].category;
            if (element1 === element2) {
                same = true;
                break;
            }
        }
        if (same == false) {
            categories.push(element1);
        }
    }
    return categories;
}

const showTradeHomePage = async function (req, res, next) {
    const totalProducts = await getProducts();
    const activeCategory = undefined;
    const categories = await eliminateSameCategories();

    let perPage = 12;
    let page = req.params.page || 1;

    const products = await Product.find({}).skip((perPage * page) - perPage).limit(perPage).lean();

    let totalPages = Math.ceil(totalProducts.length / perPage);

    res.render('trade/src/home/views/shop_area.ejs', { layout: 'trade/src/home/views/layout/home_layout.ejs', products, categories, page, totalPages, activeCategory });

}

const showProductsByCategory = async function (req, res, next) {

    const activeCategory = req.params.category;

    const totalProducts = await getProducts({ category: activeCategory })
    const categories = await eliminateSameCategories(totalProducts);

    let perPage = 12;
    let page = req.params.page || 1;

    const products = await Product.find({ category: activeCategory }).skip((perPage * page) - perPage).limit(perPage).lean();

    let totalPages = Math.ceil(totalProducts.length / perPage);

    res.render('trade/src/home/views/shop_area.ejs', { layout: 'trade/src/home/views/layout/home_layout.ejs', products, categories, page, totalPages, activeCategory });


}


const showcart = async function (req, res, next) {
    
    res.render('trade/src/home/views/shop_cart.ejs', { layout: 'trade/src/home/views/layout/home_layout.ejs' });

}

module.exports = {
    showTradeHomePage,
    showProductsByCategory,
    showcart

}
