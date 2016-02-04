var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: String,
    username: String,
    password: String,
    role: String,
    time: Date
});

module.exports = UserSchema;