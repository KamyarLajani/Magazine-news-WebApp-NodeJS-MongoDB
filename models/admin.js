const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: String,
    email: String,
    password: String,
    verifycode: {type: String, default: ''}
},
{ collection: 'admin' });


let Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;