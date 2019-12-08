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
const Breaknews = require('../models/index.js').breaknews;
const SubCategory = require('../models/index.js').subCategory;
const Info = require('../models/index.js').info;
router.get('/cat/:name', (req, res)=>{

    (async ()=>{
        try {
            let QueryName = await req.params.name;
            let catQuery = await Category.find({name: QueryName});
            let subcatQuery = await SubCategory.find({name: QueryName});
            let category = await Category.find({});
            let articles = await Article.find({}).sort({num: -1});
            let popular = await Popular.find({});
            let newsletter = await Newsletter.find({});
            let breaknews = await Breaknews.find({}).sort({_id: -1}).limit(4);
            let subCategory = await SubCategory.find({}).sort({num: -1});
            let info = await Info.find({});
            res.locals.path = decodeURIComponent(req.path);
            res.locals.url = decodeURIComponent(req.protocol + '://' + req.get('host'));
            if(catQuery != ''){
             
                let articlesCat = await Article.find({category_id: catQuery[0]._id}).sort({num: -1});
                for(let i = 0; i< articlesCat.length; i++){
                    articlesCat[i].content = articlesCat[i].content.replace(/<[^>]*>?/gm, ' ');
                    articlesCat[i].content = articlesCat[i].content.replace(/&nbsp;/g, ' ')
                    articlesCat[i].content = articlesCat[i].content.substring(0,80);
                }
                res.render('category', {articles, category, popular, newsletter, articlesCat, breaknews, subCategory, info});
            }
            else if(subcatQuery != ''){

                let subCategoryQuery = await Article.find({category_id: subcatQuery[0]._id}).sort({num: -1});
                for(let i = 0; i< subCategoryQuery.length; i++){
                    subCategoryQuery[i].content = subCategoryQuery[i].content.replace(/<[^>]*>?/gm, ' ');
                    subCategoryQuery[i].content = subCategoryQuery[i].content.replace(/&nbsp;/g, ' ')
                    subCategoryQuery[i].content = subCategoryQuery[i].content.substring(0,80);
                }
               
                res.render('category', {articles, category, popular, newsletter, breaknews, subCategoryQuery, subCategory, info});
            }
            else {
                  
                res.render('404', {articles, category, popular, newsletter, breaknews, subCategory, info});
            }  
            
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});





module.exports = router;