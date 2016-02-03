var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BlogSchema = new Schema({
    id: String,
    tags: Array,
    title: String,
    content: String,
    time: String
});

module.exports = BlogSchema;