const express = require('express');
const router = express();
const bodyParser = require('body-parser');
let request = require('request');
router.set(bodyParser.urlencoded({extended: false}));
router.set(bodyParser.json());
router.use(express.static('public'));
const path = require('path');
let PublicKey = require(path.join(__dirname, '../index.js'))
const webpush = require('web-push');
let pathDir = path.join(__dirname, '../models/index.js');
const Webpush = require(pathDir).webpush;

router.post('/subscribe', (req, res)=>{
    try {
        (async ()=>{
           // store subscription
            let store = await Webpush.create({expirationTime: req.body.expirationTime, p256dh: req.body.keys.p256dh, auth: req.body.keys.auth, endpoint: req.body.endpoint})
            
        })()
    }
    catch(error){

    }
})



module.exports = router;
