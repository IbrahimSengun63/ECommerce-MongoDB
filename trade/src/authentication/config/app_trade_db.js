const mongoose = require('mongoose');

class DBConnection {

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
        mongoose.createConnection(this.url, this.options)
            .then(() => { console.log("app_trade_db connected") })
            .catch((dbError) => { console.log(dbError) });
    }
}

//const dbConnection = new DBConnection(process.env.MONGODB_CONNECTION_STRING+'app_trade');
//const conn = dbConnection.connection();
const conn = mongoose.createConnection(process.env.MONGODB_CONNECTION_STRING + 'app_trade', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})


const User = conn.model('User', require('../model/user_model').UserSchema)



module.exports = {
    User
}