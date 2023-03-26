const dotenv = require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');

//require('./admin/src/common/config/app_admin_db');
//const MongoDBStore = require('connect-mongodb-session')(session);
/*const appAdminSessionStore = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING+'app_admin',
    collection: 'sessions'
});
*/
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname,'./'));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./'));
//app.use("/uploads",express.static(path.join(__dirname,'/src/uploads')));

/*app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    store: appAdminSessionStore
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.validation_errors = req.flash('validation_errors');
    res.locals.success_message =req.flash('success_message');
    res.locals.firstName = req.flash('firstName');
    res.locals.lastName = req.flash('lastName');
    res.locals.email = req.flash('email');
    res.locals.passport_login_errors = req.flash('error');
    res.locals.verify_errors = req.flash('verify_errors');
    next();
});

app.use(passport.initialize());
app.use(passport.session());
*/
//const loginRouter = require('./admin/src/login/routers/login_router');
//const homeRouter = require('./admin/src/home/routers/home_router');
//const profileRouter = require('./admin/src/profile/routers/profile_router');
const productRouter = require('./admin/src/product/routers/product_router');


//app.use('/', loginRouter);
//app.use('/admin/panel', homeRouter);
//app.use('/admin/profile', profileRouter);
app.use('/admin/product',productRouter);


/////////////////////////////////////////////////////


//require('./trade/src/authentication/config/app_trade_db');
const MongoDBStore = require('connect-mongodb-session')(session);
const appTradeSessionStore = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING+'app_trade',
    collection: 'sessions'
});

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    store: appTradeSessionStore
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success =req.flash('success');
    res.locals.firstName = req.flash('firstName');
    res.locals.lastName = req.flash('lastName');
    res.locals.email = req.flash('email');
    res.locals.userName = req.flash('userName');
    //console.log(res.locals.errors);
    next();
});

app.use(passport.initialize());
app.use(passport.session());


const TradeHomeRouter = require('./trade/src/home/routers/home_router');
const TradeProductRouter = require('./trade/src/product/routers/product_router');
app.use('/home', TradeHomeRouter);
app.use('/product', TradeProductRouter);

const TradeLoginRouter = require('./trade/src/authentication/login/routers/login_router');
const TradeRegisterRouter = require('./trade/src/authentication/register/routers/register_router');
const TradeForgetPasswordRouter = require('./trade/src/authentication/forget-password/routers/forget_password_router');
const TradeResetPasswordRouter = require('./trade/src/authentication/reset-password/routers/reset_password_router');
app.use('/', TradeLoginRouter);
app.use('/', TradeRegisterRouter);
app.use('/', TradeForgetPasswordRouter);
app.use('/', TradeResetPasswordRouter);


app.listen(process.env.PORT, () => {
    console.log("Runnig!!!");
});

