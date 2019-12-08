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
const Videos = require(pathDir).videos;
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

router.get('/videos', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let searchString = req.query.search;
            if(searchString == undefined) {
                let videos = await Videos.find({}).sort({_id: -1}).limit(3);
                
                let articles = await Articles.find({}).sort({_id: -1});
                // admin name
                let user = await req.user;
                let contactsCount = await Contact.find({seen: false}).countDocuments();
                res.render('videos', {videos, articles, user, contactsCount});
            }
            else {
                let videos = await Videos.find({}).sort({_id: -1}).limit(3);
                let articles = await Articles.find({}).sort({_id: -1});
                let articlesQuery = await Articles.find({title: {$regex: new RegExp(searchString, 'i')}}).sort({_id: -1});
                // admin name
                let user = await req.user;
                let contactsCount = await Contact.find({seen: false}).countDocuments();
                res.render('videos', {articlesQuery, videos, articles, user, contactsCount});
            }
            
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


router.post('/videos', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let count = await Videos.countDocuments({});
            
            if(count > 3) {

                let ID = await Videos.find({}).sort({_id: -1}).limit(count - 3);
                
                for(let i =0; i< count - 3; i++) {
                    let data = await Videos.deleteOne({category_id: ID[i].category_id});
                   
                }
            }
            if(Array.isArray(req.body.videos)){
                for(let j =0; j< req.body.videos.length; j++) {
                    await Videos.create({article_id: req.body.videos[j]});
                    
                }
            }
            else {
                await Videos.create({article_id: req.body.videos});
            }
            let videos = await Videos.find({}).sort({_id: -1}).limit(3);
            let articles = await Articles.find({}).sort({_id: -1});
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('videos', {videos, articles, user, contactsCount}); 
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});



module.exports = router;