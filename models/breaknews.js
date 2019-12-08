
const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const breaknewsSchema = new Schema({
    title: String
   
},
{ collection: 'breaknews' });


let Breaknews = mongoose.model('breaknews', breaknewsSchema);

module.exports = Breaknews;