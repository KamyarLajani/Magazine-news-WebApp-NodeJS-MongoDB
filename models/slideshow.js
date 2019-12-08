
const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const SlideshowSchema = new Schema({
    article_id: String
},
{ collection: 'slideshow' });


let Slideshow = mongoose.model('slideshow', SlideshowSchema);

module.exports = Slideshow;