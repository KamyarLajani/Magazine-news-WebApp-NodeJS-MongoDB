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
const NewsletterEmail = require(pathDir).newsletterEmail;
const Contact = require(pathDir).contact;
const pagination = require('./pagination.js');
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

router.get('/newsletter-sub', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            
            res.redirect(`/admin/${req.path.replace(/\//g, '')}/page/1`);
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});



router.get('/newsletter-sub/page/:num', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let searchString = req.query.search;
            let currentPage = parseInt(req.params.num);
            let limit = 20;
           
            if(searchString == undefined){
                let count = await NewsletterEmail.countDocuments({});
                let totalPages = Math.ceil(count / limit);
                let emails = await pagination(req.path, NewsletterEmail, count, parseInt(req.params.num), searchString, 'email');
                // admin name
                let user = await req.user;
                let contactsCount = await Contact.find({seen: false}).countDocuments();
                res.render('newsletter-sub', {emails, currentPage, limit, totalPages, user, contactsCount});
                
            }
            else {
                let count = await NewsletterEmail.countDocuments({email: {$regex: new RegExp(searchString, 'i')}});
                let totalPages = Math.ceil(count / limit);
                let emails = await pagination(req.path, NewsletterEmail, count, parseInt(req.params.num), searchString, 'email'); 
                // admin name
                let user = await req.user; 
                let contactsCount = await Contact.find({seen: false}).countDocuments();
                res.render('newsletter-sub', {emails, currentPage, limit, totalPages, user, contactsCount});


            }
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});



router.get('/newsletter-sub/delete/:id', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let id = req.params.id;
            let deleteOne = await NewsletterEmail.deleteOne({_id: id});
            res.redirect('/admin/newsletter-sub/page/1');
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});



module.exports = router;