const LocalStrategy = require('passport-local').Strategy;
const User = require('../../common/config/app_admin_db').User;
const bcrypt = require('bcrypt');


function passport_auth(passport) {
    
    const options = {
        usernameField: 'email',
        passwordField: 'password'
    }
    passport.use(new LocalStrategy(options, async (email, password, done) => {

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'user cannot find' });
            } else {

                const passwordCheck = await bcrypt.compare(password, user.password);

                if (passwordCheck && user.mailActive == false) {
                    return done(null, false, { message: 'user cannot find' });
                } else if (passwordCheck && user.mailActive == true) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'user cannot find' });
                }
            }

        } catch (error) {
            return done(error);
            done()
        }

    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user);
        });
    });

}

module.exports = passport_auth;
