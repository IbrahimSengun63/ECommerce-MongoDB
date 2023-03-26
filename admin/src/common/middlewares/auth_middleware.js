
const checkSignIn = function (req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('login_errors',{msg:['be sign in']});
        res.redirect('/login');
    }
};




module.exports = {
    checkSignIn
    
}