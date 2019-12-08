const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const subCatSchema = new Schema({
    category_id: String,
    name: String
},
{ collection: 'subcategory' });


let subCategory = mongoose.model('subcategory', subCatSchema);

module.exports = subCategory;