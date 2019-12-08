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
const Contact = require(pathDir).contact;
const Admin = require(pathDir).admin;
let checkAuthenticated = require('./authenticate.js').checkAuthenticated;
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
 
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

router.get('/account', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            // admin name
            let user = await req.user;
            let admin = await Admin.find({email: user.email});
            if(admin.length === 0){
                req.logOut();
            }
            else {
                let contactsCount = await Contact.countDocuments();
                res.render('account', {admin, user, contactsCount});
            }
            
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


router.get('/account/edit', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            // admin name
            let user = await req.user;
            let admin = await Admin.find({email: user.email});
            if(admin.length === 0){
                req.logOut();
            }
            else {
                let edit = '';
                let contactsCount = await Contact.countDocuments();
                res.render('account', {edit, admin, user, contactsCount});
            }
            
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


router.post('/account/edit', checkAuthenticated, (req, res)=>{

    (async ()=>{
            
        try {
           
            let user = await req.user;
            if(req.body.password1 !== req.body.password2){
                let error = 'Passwords are not match.';
                let edit = '';
                let contactsCount = await Contact.countDocuments();
                let admin = await Admin.find({email: user.email});
                res.render('account', {error, edit, admin, user, contactsCount});
            }
            else {
                await Admin.updateOne({_id: user._id}, {name: req.body.name, email: req.body.email, password: req.body.password1});
                req.logOut();
                res.redirect('/admin/login');
                
            }
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});






module.exports = router;