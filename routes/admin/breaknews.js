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
const Breaknews = require(pathDir).breaknews;
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
router.get('/breaknews', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let breaknews = await Breaknews.find({}).sort({_id: -1}).limit(4);
            
            let edit = false;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('breaknews', {breaknews, edit, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});

router.post('/breaknews/add', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {

            let create = await Breaknews.create({title: req.body.title});
            let breaknews = await Breaknews.find({}).sort({_id: -1}).limit(4);
            let edit = false;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('breaknews', {breaknews, edit, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});

router.get('/breaknews/delete/:id', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let id = req.params.id;
            let deleteOne = await Breaknews.deleteOne({_id: id});
            let breaknews = await Breaknews.find({}).sort({_id: -1}).limit(4);
            let edit = false;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('breaknews', {breaknews, edit, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});

router.get('/breaknews/edit/:id', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let id = req.params.id;
            let breaknews = await Breaknews.find({}).sort({_id: -1}).limit(4);
            let editCollection = await Breaknews.find({_id: id});
            let edit = true;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('breaknews', {editCollection, breaknews, edit, user, contactsCount});
        }
        catch(error) {
            
            console.log(error);
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.countDocuments();
            res.render('breaknews', {error: 'Something went wrong!', user, contactsCount});
        }
        
    })();
   
});


router.post('/breaknews/edit/:id', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let id = req.params.id;
           
            let updateOne = await Breaknews.updateOne({_id: id}, {title: req.body.title});
            let breaknews = await Breaknews.find({}).sort({_id: -1}).limit(4);
            let edit = false;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('breaknews', {breaknews, edit, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


module.exports = router;