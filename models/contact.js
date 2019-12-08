const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: String,
    email: String,
    message: String,
    seen: {type: Boolean, default: false}
   
},
{ collection: 'contact' });


let Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;