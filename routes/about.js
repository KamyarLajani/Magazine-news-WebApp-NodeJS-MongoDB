const express = require('express');
const router = express();
const bodyParser = require('body-parser');
router.set(bodyParser.urlencoded({extended: false}));
router.set(bodyParser.json());
router.use(express.static('public'));
const path = require('path');
const pug = require('pug');
router.set("view engine", "pug");
router.set('views', path.join(__dirname, '../views'));
router.set('view options', { pretty: true });

const Article = require('../models/index.js').article;
const Category = require('../models/index.js').category;
const Popular = require('../models/index.js').popular;
const Newsletter = require('../models/index.js').newsletter;
const About = require('../models/index.js').about;
const Breaknews = require('../models/index.js').breaknews;
const SubCategory = require('../models/index.js').subCategory;
const Info = require('../models/index.js').info;
router.get('/AboutUs', (req, res)=>{

    (async ()=>{
        try {
            let subcatQuery = await SubCategory.find({});
            let articles = await Article.find({}).sort({num: -1});
            let category = await Category.find({});
            let popular = await Popular.find({});
            let newsletter = await Newsletter.find({});
            let about = await About.find({});
            let breaknews = await Breaknews.find({}).sort({_id: -1}).limit(4);
            let subCategory = await SubCategory.find({});
            let info = await Info.find({});
            res.locals.path = req.path.replace('/', '');
            res.locals.url = req.protocol + '://' + req.get('host');
            res.render('about', {articles, category, popular, newsletter, about, breaknews, subCategory, subcatQuery, info});
            
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


module.exports = router;