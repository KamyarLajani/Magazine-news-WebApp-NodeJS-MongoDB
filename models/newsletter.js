const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const newsletterSchema = new Schema({
    before: String,
    after: String
},
{ collection: 'newsletter' });


let Newsletter = mongoose.model('newsletter', newsletterSchema);

module.exports = Newsletter;