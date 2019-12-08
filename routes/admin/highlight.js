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
const Articles = require(pathDir).article;
const Highlight = require(pathDir).highlighted;
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
router.get('/highlight', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let searchString = req.query.search;
            if(searchString == undefined) {
                let highlight = await Highlight.find({}).sort({_id: -1}).limit(4);
                let articles = await Articles.find({}).sort({_id: -1});
                // admin name
                let user = await req.user;
                let contactsCount = await Contact.find({seen: false}).countDocuments();
                res.render('highlight', {highlight, articles, user, contactsCount});
            }
            else {
                let highlight = await Highlight.find({}).sort({_id: -1}).limit(4);
                let articles = await Articles.find({}).sort({_id: -1});
                let articlesQuery = await Articles.find({title: {$regex: new RegExp(searchString, 'i')}}).sort({_id: -1});
                // admin name
                let user = await req.user;
                let contactsCount = await Contact.find({seen: false}).countDocuments();
                res.render('highlight', {articlesQuery, highlight, articles, user, contactsCount});
                
            }
            
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


router.post('/highlight', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let count = await Highlight.countDocuments({});
            
            if(count > 4) {

                let ID = await Highlight.find({}).sort({_id: -1}).limit(count - 4);
                
                for(let i =0; i< count - 4; i++) {
                    let data = await Highlight.deleteOne({category_id: ID[i].category_id});
                  
                }
            }
            if(Array.isArray(req.body.highlight)){
                for(let j =0; j< req.body.highlight.length; j++) {
                    await Highlight.create({article_id: req.body.highlight[j]});
                    
                }
            }
            else {
                await Highlight.create({article_id: req.body.highlight});
            }
            
            let highlight = await Highlight.find({}).sort({_id: -1}).limit(4);
            let articles = await Articles.find({}).sort({_id: -1});
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('highlight', {highlight, articles, user, contactsCount}); 
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});





module.exports = router;