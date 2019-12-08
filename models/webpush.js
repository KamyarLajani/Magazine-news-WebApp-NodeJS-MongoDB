const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const webpushSchema = new Schema({
    expirationTime: String,
    p256dh: String,
    auth: String,
    endpoint: String
   
},
{ collection: 'webpush' });


let Webpush = mongoose.model('webpush', webpushSchema);

module.exports = Webpush;