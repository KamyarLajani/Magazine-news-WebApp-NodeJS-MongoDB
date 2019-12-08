const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const catSchema = new Schema({
    name: String
},
{ collection: 'category' });


let Category = mongoose.model('category', catSchema);

module.exports = Category;