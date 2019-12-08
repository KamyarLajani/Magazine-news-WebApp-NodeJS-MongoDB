const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const aboutSchema = new Schema({
    content: String
   
},
{ collection: 'about' });


let About = mongoose.model('about', aboutSchema);

module.exports = About;