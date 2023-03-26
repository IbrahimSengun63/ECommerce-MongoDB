const Product = require('../../common/config/app_admin_db').Product;
const faker = require('faker');

const generateFakeData = function (req,res,next) {
    

    for (let i = 0; i < 20; i++) {
        const product = new Product();
        product.productName = faker.name.findName();
        product.category = "gayrimenkul";
        product.description = faker.commerce.productDescription();
        product.price = parseFloat(faker.commerce.price());
        product.discount = faker.datatype.number(99);
        product.stock = faker.datatype.number(500);;
        product.shop = "hf";
        product.image = "altin.jpg"
        product.netPrice = (product.price * (100 - product.discount) / 100).toFixed(2);
        product.save(function(err) {
            if (err) throw err
        });
    
    }
    res.redirect('/home/1');
}

const showProductAddPage = function (req, res, next) {

    res.render('admin/src/product/views/product-add.ejs', { layout: 'admin/src/home/views/layout/home_layout.ejs', title: "product-add" });
}

const productAdd = async function (req, res, next) {
    
    const netPrice = (req.body.price * (100 - req.body.discount) / 100).toFixed(2);
    //'/home/mordor/Web Workspace/Nodejs/App/admin/src/product/uploads/products/tablet.png'
    const values = {
        productName: req.body.productName,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        stock: req.body.stock,
        netPrice:netPrice,
        shop: req.body.shop,
        image: (req.file != undefined ? req.file.filename : "null")
    }

    try {
        
        const product = new Product(values);
        await product.save();
        res.redirect('/admin/product/add')
    } catch (error) {

    }
}

const showProductListPage = async function (req, res, next) {


    const products = await Product.find().lean();

    res.render('admin/src/product/views/product-list.ejs', { layout: 'admin/src/home/views/layout/home_layout.ejs', title: "product-list", products });
}

const showProductEditPage = async function (req, res, next) {

    const id = req.body.id;
    try {
        const product = await Product.findById(id);
        if (product) {
            res.render('admin/src/product/views/product-edit.ejs', { layout: 'admin/src/home/views/layout/home_layout.ejs', title: "product-edit", product })
        } else {
            res.redirect('/admin/product/list')
        }
    } catch (error) {
        res.redirect('/admin/product/list')
    }



}

const productEdit = async function (req, res, next) {
    const id = req.body.id;
    const netPrice = (req.body.price * (100 - req.body.discount) / 100).toFixed(2);
    const values = {
        productName: req.body.productName,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        netPrice:netPrice,
        stock: req.body.stock,
        shop: req.body.shop,
        image: (req.file != undefined ? req.file.filename : req.body.image)
    }

    try {
        const update = await Product.findByIdAndUpdate(id, values);
        if (update) {
            res.render('admin/src/product/views/product-edit.ejs', { layout: 'admin/src/home/views/layout/home_layout.ejs', title: "product-edit", product: values })
        } else {
            res.redirect('/admin/product/list')
        }
    } catch (error) {
        res.redirect('/admin/product/list')
    }

}

const productDelete = async function (req, res, next) {

    const id = req.body.id;
    try {
        const done = await Product.findByIdAndDelete(id);
        if (done) {
            res.redirect('/admin/product/list');
        }
    } catch (error) {

    }


}


module.exports = {
    showProductAddPage,
    productAdd,
    showProductListPage,
    showProductEditPage,
    productEdit,
    productDelete,
    generateFakeData
}