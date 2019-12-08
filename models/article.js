const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    num: Number,
    title: String,
    content: String,
    keywords: String,
    image: String,
    date: {type: Number, default: new Date().getTime()},
    views: {type: Number, default: 0},
    category_id: String
},
{ collection: 'article' });


let Article = mongoose.model('article', articleSchema);

module.exports = Article;