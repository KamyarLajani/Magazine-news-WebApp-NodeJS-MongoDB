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
const Contacts = require(pathDir).contact;
const NewsletterEmail = require(pathDir).newsletterEmail;
const Webpush = require(pathDir).webpush;
const Category = require(pathDir).category;
const Subcategories = require(pathDir).subCategory;
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

router.get('/', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            

            let articles = await Articles.find({}, {views: 1, date: 1, category_id: 1});
            let contacts = await Contacts.countDocuments();
            let newsletter = await NewsletterEmail.countDocuments();
            let webpush = await Webpush.countDocuments();
            let categories = await Category.find({},{name: 1});
            let subcategories = await Subcategories.find({},{name: 1});
            // get avarage article views in this week
            let now = new Date().getTime();
            
            let arrayAvarage = [], arrayViews, totalViews, found;
            let dayName = [], weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            for(let i=0; i < 7; i++){
                arrayViews = [], found = 0;
                for(let j=0; j < articles.length; j++){
                    // 86400000 is one day milliseconds
                    if(articles[j].date <= now && articles[j].date > now-86400000){
                        // push the views of the article
                        arrayViews.push(articles[j].views);   
                        found = 1;
                    }          
                }
                // go back one day
                now-= 86400000;
                if(found){
                    totalViews = 0;
                    for(let n=0; n < arrayViews.length; n++) {
                        totalViews+= arrayViews[n];
                    }
                    arrayAvarage.push(Math.round(totalViews / arrayViews.length));
                }
                else {
                    arrayAvarage.push(0);
                }
            }
            let milliseconds = new Date().getTime();
            for(let i = 0; i< 7; i++){
                dayName.push(weekDays[new Date(milliseconds).getDay()]);
                milliseconds-= 86400000; 
            } 
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('index', {articles, contacts, newsletter, webpush, categories, subcategories, dayName, arrayAvarage ,categories, subcategories, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


module.exports = router;