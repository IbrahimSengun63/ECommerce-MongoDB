const LocalStrategy = require('passport-local').Strategy;
const User = require('../config/app_trade_db').User;
const bcrypt = require('bcrypt');


function passport_auth(passport, req) {

    const options = {
        usernameField: 'userName',
        passwordField: 'password'
    }
    passport.use('local-login', new LocalStrategy(options, async (userName, password, done) => {

        try {
            const user = await User.findOne({ userName: userName }) || await User.findOne({ email: userName });

            if (!user) {

                return done(null, false, req.flash("errors", "asdasdad"));
            } else {

                const passwordCheck = await bcrypt.compare(password, user.password);

                if (passwordCheck && user.mailActive == false) {
                    return done(null, false, req.flash("errors", "asdasdad"));
                } else if (passwordCheck && user.mailActive == true) {
                    return done(null, user);
                } else {
                    return done(null, false, req.flash("errors", "asdasdad"));
                }
            }

        } catch (error) {
            return done(error);
            done()
        }

    }));
    // burayı kontrol et
    passport.serializeUser((user, done) => {

        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {

        User.findById(id, (error, user) => {
            done(error, user);
        });
    });

}

module.exports = passport_auth;
