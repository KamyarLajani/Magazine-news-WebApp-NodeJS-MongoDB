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
const SubCategories = require(pathDir).subCategory;
const Categories = require(pathDir).category;
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
router.get('/subCategories', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let subCategories = await SubCategories.find({});
            let categories = await Categories.find({});
            let edit = false;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('subcategories', {categories, subCategories, edit, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});



router.post('/subCategories/add', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {

            let create = await SubCategories.create({name: req.body.title, category_id: req.body.category});
            let subCategories = await SubCategories.find({});
            let categories = await Categories.find({});
            let edit = false;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('subcategories', {categories, subCategories, edit, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});



router.get('/subCategories/edit/:id', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
           
            let id = req.params.id;
            let subCategories = await SubCategories.find({});
            let categories = await Categories.find({});
            let editCollection = await SubCategories.find({_id: id});
            let edit = true;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('subcategories', {categories, editCollection, subCategories, edit, user, contactsCount});
        }
        catch(error) {
            
            console.log(error);
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('subcategories', {error: 'Something went wrong!', user, contactsCount});
        }
        
    })();
   
});


router.post('/subCategories/edit/:id', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let id = req.params.id;
            let updateOne = await SubCategories.updateOne({_id: id}, {name: req.body.title, category_id: req.body.category});
            let subCategories = await SubCategories.find({});
            let categories = await Categories.find({});
            let edit = false;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('subcategories', {categories, subCategories, edit, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


router.get('/subCategories/delete/:id', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let id = req.params.id;
            let deleteOne = await SubCategories.deleteOne({_id: id});
            let subCategories = await SubCategories.find({});
            let categories = await Categories.find({});
            let edit = false;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('subcategories', {categories, subCategories, edit, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


module.exports = router;