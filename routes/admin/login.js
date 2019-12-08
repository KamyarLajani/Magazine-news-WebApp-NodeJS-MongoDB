const express = require('express');
const router = express();
const bodyParser = require('body-parser');
router.set(bodyParser.urlencoded({extended: false}));
router.set(bodyParser.json());
router.use(express.static('public'));
const path = require('path');
const pug = require('pug');
router.set("view engine", "pug");
router.set('views', path.join(__dirname, '..', '../views/admin'));
router.set('view options', { pretty: true });
let pathDir = path.join(__dirname, '..', '../models/index.js');
const Admin = require(pathDir).admin;
const Info = require(pathDir).info;
let cookieParser = require('cookie-parser');
let checkNotAuthenticated = require('./authenticate.js').checkNotAuthenticated;
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const crypto = require('crypto');
let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
 
const MongoStore = require('connect-mongo')(session);

router.use(flash());
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        url: 'DBurl',
    })
}));

router.use(passport.initialize());
router.use(passport.session());

(async ()=>{
    try {

        let initializePassport = require('./passport-config');
        
        initializePassport(passport, (email) => {
            return (async ()=>{
                let admin = await Admin.find({email: email});
                if(admin.length === 0){
                    return null;
                }
                else {
                    
                    return admin[0];
                }
            })();
        },
        (id) => {
            return (async ()=>{
                let admin = await Admin.find({_id: id});
                if(admin.length === 0){
                    return null;
                }
                else {
                    return admin[0];
                }
            })();
        });
        
    }
    catch(error) {
        console.log(error);
    }
})();

router.get('/login', checkNotAuthenticated, (req, res)=>{
    
    res.render("login", {login_errors: req.flash().error});

});



router.post('/login', passport.authenticate('local', {
        successRedirect: '/admin', 
        failureRedirect: '/admin/login', 
        failureFlash: true
    }
    
));

// logout
router.get('/logout', (req, res)=>{
    (async ()=>{
        try {
            req.logOut();
            res.redirect('/admin/login');
            
        }
        catch(error) {
            console.log(error);
        }
    })();
});

router.get('/login/forgot', (req, res)=>{
    (async ()=>{
        try {
            
            let verifyCode = req.query.verifycode;
            
            if(verifyCode !== undefined && req.query.reset == undefined){
                let admin = await Admin.find({verifycode: verifyCode});
                if(admin.length !== 0){
                  
                    res.redirect(`/admin/login/forgot?verifycode=${verifyCode}&reset=1`);
                }
                else {
                    res.send('Verify code is incorrect or expired.');
                }
            }
            else if(verifyCode !== undefined && req.query.reset !== undefined){
                
                let admin = await Admin.find({verifycode: verifyCode});
                if(admin.length !== 0){

                    let verified = true;
                    let forgot = undefined;
                    res.render('login', {verified, forgot, verifyCode});
                }
                else {
                    
                    res.send('Verify code is incorrect or expired.');
                }
            }
            else {
                let forgot= '';
                res.render('login', {forgot});
            }
        }
        catch(error) {
            console.log(error);
        }
    })();
});

router.post('/login/forgot', (req, res)=>{
    (async ()=>{
        try {
            let verifyCode = req.query.verifycode;
            
            if(verifyCode !== undefined && req.query.reset !== undefined){
                let verifyCode = req.query.verifycode;
                if(req.body.password1 !== req.body.password2){
                    let error = 'Passwords are not equal.';
                    let verified = true;
                    let forgot = undefined;
                    res.render('login', {verified, forgot, error});
                }
                else {
                    
                    
                    await Admin.updateOne({verifycode: verifyCode}, {password: req.body.password1, verifycode: ''});
                    res.redirect('/admin/login');
                }

            }

            else {
                let email = req.body.email;
                let search = await Admin.find({email: email});
                let forgot= '';
                if(search.length !== 0){
                    let verifyCode = crypto.randomBytes(20).toString('hex');
                    let success = 'Verification code successfully sent to your Email. Please check your Email address.';
                    let info = await Info.find({}).limit(1);
                    let fromEmailAddress = info[0].email;
                    let transport = nodemailer.createTransport(smtpTransport({
                        service: 'gmail',
                        auth: {
                            user: info[0].email,
                            pass: info[0].password
                        }
                    }))
                    let content = `<h4>Reset password</h4>
                    <p>Click the below link to verify your email address.</p>
                    <a href="${decodeURIComponent(req.protocol + '://' + req.get('host'))}/admin/login/forgot?verifycode=${verifyCode}">${decodeURIComponent(req.protocol + '://' + req.get('host'))}/admin/login/forgot?verifycode=${verifyCode}</a>`;
                    let mail = {
                        from: fromEmailAddress,
                        to: email,
                        subject: `${req.hostname} - Reset password`,
                        text: req.hostname,
                        html: content
                    }
                
                    transport.sendMail(mail, function(error, response){
                        if(error){
                            console.log(error);
                        }
                        transport.close();
                        
                        res.render('login', {forgot, success})
                    });
                    await Admin.updateOne({email: email}, {verifycode: verifyCode});
                }
                else {
                    let error = 'Email address is not found.';
                    
                    res.render('login', {error, forgot})
                }

            }     
        }
        catch(err) {
            console.log(err);
            let error = 'Something went wrong.';
            res.render('login', {error, forgot})
        }
    })();
});







module.exports = router;