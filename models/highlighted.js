
const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const HighlightedSchema = new Schema({
    article_id: String
},
{ collection: 'highlighted' });


let Highlghited = mongoose.model('highlighted', HighlightedSchema);

module.exports = Highlghited;