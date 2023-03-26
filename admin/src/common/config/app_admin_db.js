const mongoose = require('mongoose');

/*class DBConnection {

    constructor(url) {
        this.url = url;
        this.options = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    }

    connection() {
        mongoose.connect(this.url, this.options)
            .then(() => { console.log("db connected") })
            .catch((dbError) => { console.log(dbError) });
    }
}

const dbConnection = new DBConnection(process.env.MONGODB_CONNECTION_STRING+'app_admin');
dbConnection.connection();
*/

const conn = mongoose.createConnection(process.env.MONGODB_CONNECTION_STRING + 'app_admin', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})


const User = conn.model('User', require('../model/user_model').UserSchema)
const Product = conn.model('Product', require('../../product/model/product_model').ProductSchema)


module.exports = {
    User,
    Product
}