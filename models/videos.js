
const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const VideosSchema = new Schema({
    article_id: String
},
{ collection: 'videos' });


let Videos = mongoose.model('videos', VideosSchema);

module.exports = Videos;