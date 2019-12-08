const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const newsletterEmailSchema = new Schema({
    email: String,
    date: {type: Number, default: new Date().getTime()}
},
{ collection: 'newsletter-email' });


let NewsletterEmail = mongoose.model('newsletter-email', newsletterEmailSchema);

module.exports = NewsletterEmail;