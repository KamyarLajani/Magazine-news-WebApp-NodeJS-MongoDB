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

function pagination(path, model, length, num, query, field){
    let limit = 10;
    return (async ()=>{
        let currentPage = parseInt(num);
        let skip = (limit*currentPage) - limit;
        let totalPages = Math.ceil(length / limit);
        let rg = new RegExp(query, 'i');
        let q = {};
        q[field] = rg;
        if(totalPages > 2) {
            if(query == undefined){
                let result = await model.find({}).sort({_id: -1}).limit(limit).skip(skip);
                return result;
            }
            else {
                

                let result = await model.find(q).sort({_id: -1}).limit(limit).skip(skip);
                return result;
            }
            
        }
        else {
            if(query == undefined){
                let result = await model.find({}).sort({_id: -1});
                return result;
            }
            else {
                
                let result = await model.find(q).sort({_id: -1});
                return result;
            }
            
        }
        
        
        
        
    })();   


}

module.exports = pagination;