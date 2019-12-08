
const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const PopularSchema = new Schema({
    article_id: String
},
{ collection: 'popular' });


let Popular = mongoose.model('popular', PopularSchema);

module.exports = Popular;