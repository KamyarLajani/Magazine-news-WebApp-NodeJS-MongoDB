const express = require('express');
const router = express();
const bodyParser = require('body-parser');
let request = require('request');
const path = require('path');
const Article = require('../models/index.js').article;


router.get('/api', (req, res)=>{
    (async ()=>{
        try{
            res.setHeader('Content-Type', 'text/html');
            res.write('If you want to set limit and page number of articles, use page and limit query strings. eg: /api/articles?page=1&limit=10' + '<br>' + 'if you want to get all articles, don\'t set them.' + '<br>');
            res.end('Visit the api: <a href="/api/articles?page=1&limit=10">Visit</a>');
        }
        catch(err){
            console.log(err);
        }
    })();
});



router.get('/api/articles', (req, res)=>{
    (async ()=>{
        try{
            let limit = req.query.limit;
            let page = req.query.page;
            let errMsg = '';
            let count = await Article.countDocuments();
            if(limit && page){
                limit= parseInt(limit);
                page= parseInt(page);
                if(!Number.isInteger(limit) || !Number.isInteger(page)){
                    errMsg = 'Page or Limit query vlue is not valid.';
                }else {
                    let skip = (limit*page) - limit;
                    let totalPages = Math.ceil(count / limit);
                    let articles = await Article.find({}).sort({_id: -1}).limit(limit).skip(skip);
                    // article html content to plain text
                    for(let i = 0; i< articles.length; i++){
                        articles[i].content = articles[i].content.replace(/<[^>]*>?/gm, ' ');
                        articles[i].content = articles[i].content.replace(/&nbsp;/g, ' ')
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(articles, null, 4));
                }
            }
            else {
                let articles = await Article.find({}).sort({_id: -1});
                // article html content to plain text
                for(let i = 0; i< articles.length; i++){
                    articles[i].content = articles[i].content.replace(/<[^>]*>?/gm, ' ');
                    articles[i].content = articles[i].content.replace(/&nbsp;/g, ' ')
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(articles, null, 4));
            }
            if(errMsg !== ''){
                res.send({error: errMsg});
            }

        }
        catch(err){
            console.log(err);
        }
    })();
});



module.exports = router;