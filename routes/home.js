const express = require('express');
const router = express();
const bodyParser = require('body-parser');
let request = require('request');
router.set(bodyParser.urlencoded({extended: false}));
router.set(bodyParser.json());
router.use(express.static('public'));
const path = require('path');
const pug = require('pug');
router.set("view engine", "pug");
router.set('view options', { pretty: true });
router.set('views', path.join(__dirname, '../views'));
const { check, validationResult } = require('express-validator');


const Article = require('../models/index.js').article;
const Category = require('../models/index.js').category;
const Highlighted = require('../models/index.js').highlighted;
const Slideshow = require('../models/index.js').slideshow;
const Popular = require('../models/index.js').popular;
const Videos = require('../models/index.js').videos;
const Newsletter = require('../models/index.js').newsletter;
const Breaknews = require('../models/index.js').breaknews;
const SubCategory = require('../models/index.js').subCategory;
const Info = require('../models/index.js').info;
const Contact = require('../models/index.js').contact;




router.get('/', (req, res)=>{

    (async ()=>{
        try {
            
            // search form
            
            let searchString = req.query.search;
            let articles = await Article.find({}).sort({num: -1});
            let category = await Category.find({});
            let popular = await Popular.find({}).sort({_id: -1}).limit(6);
            let newsletter = await Newsletter.find({});
            let breaknews = await Breaknews.find({}).sort({_id: -1}).limit(4);
            let subCategory = await SubCategory.find({});
            let info = await Info.find({});
            res.locals.path = 'Home';
            res.locals.url = req.protocol + '://' + req.get('host');
            if(searchString !== undefined){
                let articlesCat = await Article.find({$or: [{title: {$regex: new RegExp(searchString, 'i')}}, {keywords: {$regex: new RegExp(searchString, 'i')}}]}).sort({num: -1});
                for(let i = 0; i< articlesCat.length; i++){
                    articlesCat[i].content = articlesCat[i].content.replace(/<[^>]*>?/gm, ' ');
                    articlesCat[i].content = articlesCat[i].content.replace(/&nbsp;/g, ' ')
                    articlesCat[i].content = articlesCat[i].content.substring(0,80);
                }
               
                res.render('category', {articles, category, popular, newsletter, articlesCat, breaknews, subCategory, info});
                
            }
            else {

                let slideshow = await Slideshow.find({});
                let highlighted = await Highlighted.find({}).sort({_id: -1}).limit(4);
                let mostViewed = await Article.find({}).sort({views: -1}).limit(4);
                let videos = await Videos.find({}).sort({_id: -1}).limit(3);
                 res.render('index', {articles, category, slideshow, highlighted, mostViewed, popular, videos, newsletter, breaknews, subCategory, info});
                
            }
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});

// contact page

router.get('/ContactUs', (req, res)=>{
    (async ()=>{
        try {
        let articles = await Article.find({}).sort({num: -1});
        let category = await Category.find({});
        let popular = await Popular.find({});
        let newsletter = await Newsletter.find({});
        let breaknews = await Breaknews.find({}).sort({_id: -1}).limit(4);
        let subCategory = await SubCategory.find({});
        let info = await Info.find({});
        res.locals.path = req.path.replace('/', '');
        res.locals.url = req.protocol + '://' + req.get('host');
        let result = '';
        res.render('contact', {articles, category, popular, newsletter, breaknews, subCategory, info, result});
        }
        catch(error) {
            console.log(error)
        }
    })();
   
});

router.post('/ContactUs', [check('email').isEmail()], (req, res)=>{
    (async ()=>{
        try {
            const errors = validationResult(req);
            let articles = await Article.find({}).sort({num: -1});
            let category = await Category.find({});
            let popular = await Popular.find({});
            let newsletter = await Newsletter.find({});
            let breaknews = await Breaknews.find({}).sort({_id: -1}).limit(4);
            let subCategory = await SubCategory.find({});
            let info = await Info.find({});
            res.locals.path = req.path.replace('/', '');
            res.locals.url = req.protocol + '://' + req.get('host');
            var result;
            if (!errors.isEmpty()) {
                result = 'Fields must be valid values!';
                res.json({result});

            }
            else {
                // google recaptcha
               
                if(req.body.captcha === undefined || req.body.captcha === '' || req.body.captcha === null){
                    result = 'Please verify reCaptcha';
                    res.json({result});
                    
                }
                else {
                    const secretKey = '<SecretKey>';
                    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteapi=${req.connection.remoteAddress}`;
                        request(verifyUrl, (error, response, datas)=>{
                            let parsed = JSON.parse(datas)
                            if(parsed.success !== undefined && !parsed.success){
                                result = 'Google reCaptcha verification failed.';
                                res.json({result});
                            }
                            else {
                                (async ()=>{ 
                                    let contact  = await Contact.create({name: req.body.name, email: req.body.email, message: req.body.message});
                                    result =  'Thank you for contacting us.';
                                     res.json({result});
                                })();
                            }
                            
                        });
                        
                }
            }
            
        }
        catch(error) {
            console.log(error)
        }
    })();
   
});

module.exports = router;