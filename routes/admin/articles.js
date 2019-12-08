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
const Articles = require(pathDir).article;
const PushSubscription = require(pathDir).webpush;
const Info = require(pathDir).info;
const NewsletterEmail = require(pathDir).newsletterEmail;
const Contact = require(pathDir).contact;
const pagination = require('./pagination.js');
let formidable = require('formidable');
const mv = require('mv');
const webpush = require('web-push');
let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
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

router.get('/articles', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            
            res.redirect(`/admin/${req.path.replace(/\//g, '')}/page/1`);
            
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});



router.get('/articles/page/:num', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let searchString = req.query.search;
            let subCategories = await SubCategories.find({});
            let categories = await Categories.find({});
            let edit = false;
            let add = false;
            let currentPage = parseInt(req.params.num);
            let limit = 10;
           
            
            if(searchString == undefined){
               
                let count = await Articles.countDocuments({});
                let totalPages = Math.ceil(count / limit);
                
                let articles = await pagination(req.path, Articles, count, parseInt(req.params.num), searchString, 'title');
                
                // converting html content to plain text
                for(let i = 0; i< articles.length; i++){
                    articles[i].content = articles[i].content.replace(/<[^>]*>?/gm, ' ');
                    articles[i].content = articles[i].content.replace(/&nbsp;/g, ' ')
                    articles[i].content = articles[i].content.substring(0,80);
                }
                // admin name
                let user = await req.user;
                let contactsCount = await Contact.find({seen: false}).countDocuments();
                res.render('articles', {articles, categories, subCategories, edit, currentPage, limit, totalPages, add, user, contactsCount});
               
            }
            else {
                let count = await Articles.countDocuments({title: {$regex: new RegExp(searchString, 'i')}});
                let totalPages = Math.ceil(count / limit);

                let articles = await pagination(req.path, Articles, count, parseInt(req.params.num), searchString, 'title');
              
                // converting html content to plain text
                for(let i = 0; i< articles.length; i++){
                    articles[i].content = articles[i].content.replace(/<[^>]*>?/gm, ' ');
                    articles[i].content = articles[i].content.replace(/&nbsp;/g, ' ')
                    articles[i].content = articles[i].content.substring(0,80);
                }
                // admin name
                let user = await req.user;
                let contactsCount = await Contact.find({seen: false}).countDocuments();
                res.render('articles', {articles, categories, subCategories, edit, currentPage, limit, totalPages, add, user, contactsCount});
                
            }
            
           
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


router.get('/articles/add', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {

            let subCategories = await SubCategories.find({});
            let categories = await Categories.find({});
            
            let edit = false;
            let add = true;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('articles', {categories, subCategories, edit, add, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


router.post('/articles/add', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            
            let form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.keepExtensions = true;
            let imageTypes = ['image/bmp', 'image/gif', 'image/ief', 'image/jpeg', 'image/pipeg', 'image/svg+xml' ,'image/png'];
            
            form.parse(req, (error, fields, files)=>{
                
            
                if(imageTypes.includes(files.image.type)){
                    
                    mv(files.image.path, path.join(__dirname, '..', '../public/uploads') + '/' + files.image.name, function (err) {
                        if(err) throw err;
                        (async ()=>{
                            try {
                                let lastnum = await Articles.find({}, {num: 1}).sort({_id: -1}).limit(1);
                            if(lastnum.length!== 0){
                                let create = await Articles.create({title: fields.title, content:fields.content, category_id: fields.category, keywords: fields.keywords, image: files.image.name, num: lastnum[0].num+1});
                            }
                            else {
                                let create = await Articles.create({title: fields.title, content:fields.content, category_id: fields.category, keywords: fields.keywords, image: files.image.name, num: 1});
                            }
                            
                            // send the article to Email subscribers
                            let info = await Info.find({}).limit(1);
                            let newsletterEmail = await NewsletterEmail.find({});

                            let fromEmailAddress = info[0].email;
                            let toEmailAddress = [];
                            for(let i=0; i< newsletterEmail.length; i++){
                                toEmailAddress[i] = newsletterEmail[i].email;
                            }
                            let emails = toEmailAddress.toString();
                            let transport = nodemailer.createTransport(smtpTransport({
                                service: 'gmail',
                                auth: {
                                    user: info[0].email,
                                    pass: info[0].password
                                }
                            }))
                            
                            let mail = {
                                from: fromEmailAddress,
                                to: emails,
                                subject: `${req.hostname} - ${fields.title}`,
                                text: req.hostname,
                                html: fields.content
                            }
                            if(newsletterEmail.length !== 0) {
                                transport.sendMail(mail, function(error, response){
                                    if(error){
                                        console.log(error);
                                    }
                                    transport.close();
                                });
                            }
                           
                            // converting html content to plain text
                            fields.content = fields.content.replace(/<[^>]*>?/gm, ' ');
                            fields.content = fields.content.replace(/&nbsp;/g, ' ')
                            fields.content = fields.content.substring(0,80);
                            
                            // push notification to all subscribers
                            let result = await PushSubscription.find({});
                            if(lastnum.length !== 0 && result.length !== 0){
                                const payload = JSON.stringify({ title: fields.title, body: `${fields.content.substring(0, 30) }...`, articleUrl: lastnum[0].num+1, logo: files.image.name});
                                
                                let subscription;

                                for(let i=0; i< result.length; i++){
                                    subscription = await {endpoint: result[i].endpoint, keys: {auth: result[i].auth, p256dh: result[i].p256dh}, expirationTime: result[i].expirationTime};
                                    await webpush.sendNotification(subscription, payload, (err)=>{

                                    });
                                }
                            }

                            res.redirect('/admin/articles/page/1');
                            }
                            catch(err){
                                res.redirect('/admin/articles/page/1');
                            }
                        })();
                      });
                }
                else {
                    console.log(false);
                }
            });

            
        }
        catch(error) {
            console.log(error);
            return res.redirect('/admin/articles/page/1');
            
            
        }
        
    })();
   
});

router.get('/articles/delete/:id', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let id = req.params.id;
            let deleteOne = await Articles.deleteOne({_id: id});
            res.redirect('/admin/articles/page/1');
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});

router.get('/articles/edit/:id', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
           
            let id = req.params.id;
            let subCategories = await SubCategories.find({});
            let categories = await Categories.find({});
            let editCollection = await Articles.find({_id: id});
            let edit = true;
            let add = false;
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('articles', {categories, editCollection, subCategories, edit, add, user, contactsCount});
        }
        catch(error) {
            
            console.log(error)
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.find({seen: false}).countDocuments();
            res.render('articles', {error: 'Something went wrong!', user, contactsCount});
        }
        
    })();
   
});


router.post('/articles/edit/:id', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let id = req.params.id;
            
            let form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.keepExtensions = true;
            let imageTypes = ['image/bmp', 'image/gif', 'image/ief', 'image/jpeg', 'image/pipeg', 'image/svg+xml' ,'image/png'];
            
            form.parse(req, (error, fields, files)=>{
                if(files.image.name != ''){
                    
                    if(imageTypes.includes(files.image.type)){
                    
                        mv(files.image.path, path.join(__dirname, '..', '../public/uploads') + '/' + files.image.name, function (err) {
                            if(err) throw err;
                                (async ()=>{
                                    let update = await Articles.updateOne({_id: id}, {title: fields.title, content:fields.content, category_id: fields.category, keywords: fields.keywords, image: files.image.name});
                                   
                                    res.redirect('/admin/articles');
                                })();
                        });
                    }
                    else {
                        console.log(false);
                    }
                }
                else {
                    
                    (async ()=>{
                        let update = await Articles.updateOne({_id: id}, {title: fields.title, content:fields.content, category_id: fields.category, keywords: fields.keywords});
                        
                        res.redirect('/admin/articles');
                    })();
                }
                
            });
        }
        catch(error) {
            console.log(error);
            res.redirect('/admin/articles/page/1');
        }
        
    })();
   
});


module.exports = router;