var mongoose = require("mongoose");
var BlogSchema = require("../db/schema/blog");

module.exports = mongoose.model("Blog", BlogSchema);