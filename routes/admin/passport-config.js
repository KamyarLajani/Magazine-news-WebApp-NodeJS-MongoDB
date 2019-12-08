const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async(email, password, done)=>{
            const user = await getUserByEmail(email);
            if(user == null){

                return done(null, false, {message: 'Email address is incorrect.'});
            }
            if(password == user.password){
                return done(null, user);
            }
            else {
                return done(null, false, {message: 'Password is incorrect.'});
            }
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user, done)=> done(null, user._id));
    passport.deserializeUser((id, done)=>{
        return done(null, getUserById(id));
    });
}

module.exports = initialize;

