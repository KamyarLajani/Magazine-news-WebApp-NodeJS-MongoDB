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
let homePage = require('./home.js');
let aboutPage = require('./about.js');
let categoryPage = require('./category.js');
let articlePage = require('./article.js');
let newsletter = require('./newsletter.js');
let webpush = require('./webpush.js');
let api = require('./api.js');

router.use(aboutPage);
router.use(homePage);
router.use(articlePage);
router.use(categoryPage);
router.use(newsletter);
router.use(webpush);
router.use(api);


module.exports = router;