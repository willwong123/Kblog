var mongoose = require("mongoose");
var UserSchema = require("../db/schema/user");

module.exports = mongoose.model("User", UserSchema);