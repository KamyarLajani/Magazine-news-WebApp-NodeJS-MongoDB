const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const infoSchema = new Schema({
    title: String,
    keywords: String,
    image: String,
    description: String,
    email: String,
    password: String,
    phone: String,
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
   
},
{ collection: 'info' });


let Info = mongoose.model('info', infoSchema);

module.exports = Info;