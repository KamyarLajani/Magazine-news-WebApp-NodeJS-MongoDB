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
const Newsletter = require(pathDir).newsletter;
const Contact = require(pathDir).contact;
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

router.get('/newsletter', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let newsletter = await Newsletter.find({});
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('newsletter', {newsletter, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


router.post('/newsletter', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let count = await Newsletter.countDocuments({});
            if(count > 0){
                await Newsletter.updateOne({}, {before: req.body.before, after: req.body.after});
            }
            else {
                await Newsletter.create({before: req.body.before, after: req.body.after});
            }
            
            let newsletter = await Newsletter.find({});
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('newsletter', {newsletter, user, contactsCount}); 
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});






module.exports = router;