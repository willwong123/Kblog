var mongoose = require("mongoose");
var config = require("../config");
var database = mongoose.connect("mongodb://"+ config.dbHost + "/" + config.dbName);

module.exports = database;
