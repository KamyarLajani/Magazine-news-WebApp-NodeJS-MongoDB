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
const Info = require(pathDir).info;
const Contact = require(pathDir).contact;
let formidable = require('formidable');
const fs = require('fs');
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
router.get('/sitesetting', checkAuthenticated, (req, res)=>{

    (async ()=>{
        try {
            let info = await Info.find({});
            // admin name
            let user = await req.user;
            let contactsCount = await Contact.countDocuments();
            res.render('setting', {info, user, contactsCount});
        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});


router.post('/sitesetting', checkAuthenticated, (req, res)=>{

    (async ()=>{
            
        try {
            let form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.keepExtensions = true;
            let imageTypes = ['image/bmp', 'image/gif', 'image/ief', 'image/jpeg', 'image/pipeg', 'image/svg+xml' ,'image/png'];
            form.parse(req, (error, fields, files)=>{
                
                if(files.image.name != ''){
                    if(imageTypes.includes(files.image.type)){
                        
                        fs.rename(files.image.path, path.join(__dirname, '..', '../public/images/' + files.image.name), function (err) {
                            if(err) throw err;
                            (async ()=>{
                                try {
                                    let count = await Info.countDocuments({});
                                    
                                    if(count > 0){
                                        
                                        await Info.updateOne({}, {title: fields.title, keywords: fields.keywords, image: files.image.name, description: fields.description, email: fields.email, password: fields.password, phone: fields.phone, facebook: fields.facebook, instagram: fields.instagram, twitter: fields.twitter, youtube: fields.youtube});
                                    }
                                    else {
                                        
                                        await Info.create({title: fields.title, keywords: fields.keywords, image: files.image.name, description: fields.description, email: fields.email, password: fields.password, phone: fields.phone, facebook: fields.facebook, instagram: fields.instagram, twitter: fields.twitter, youtube: fields.youtube});
                                        
                                    }
                                    let info = await Info.find({});
                                    // admin name
                                    let user = await req.user;
                                    let contactsCount = await Contact.countDocuments();
                                    res.render('setting', {info, user, contactsCount})
                                }
                                catch(err) {
                                    console.log(err)
                                }
                            })();
                        });
                    }
                    else {
                        console.log(false);
                    }
                }
                else {
                    
                    (async ()=>{
                        let count = await Info.countDocuments({});
                        
                        if(count > 0){
                            await Info.updateOne({}, {title: fields.title, keywords: fields.keywords, email: fields.email, password: fields.password, description: fields.description, phone: fields.phone, facebook: fields.facebook, instagram: fields.instagram, twitter: fields.twitter, youtube: fields.youtube});
                        }
                        else {
                            await Info.create({}, {title: fields.title, keywords: fields.keywords, email: fields.email, password: fields.password, description: fields.description, phone: fields.phone, facebook: fields.facebook, instagram: fields.instagram, twitter: fields.twitter, youtube: fields.youtube});
                        }
                        let info = await Info.find({});
                        // admin name
                        let user = await req.user;
                        let contactsCount = await Contact.countDocuments();
                        res.render('setting', {info, user, contactsCount})
                    })();
                }
            });
        
            

        }
        catch(error) {
            console.log(error)
        }
        
    })();
   
});






module.exports = router;