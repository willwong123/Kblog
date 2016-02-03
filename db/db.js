/**
 * Created by 14050185 on 2016/2/2.
 */

var monk = require("monk");
var wrap = require("co-monk");

var database = monk("localhost/blog");
var posts = wrap(database.get("posts"));

module.exports.Index = function* (){
    var indexList = yield posts.find({});
    return posts.find({});
};

module.exports.Add = function* (){
    console.log("this")
    yield posts.insert({"id":2,"time":"2016-02-04","title":"connect success!","content":"this is inserted by node!","tags":"nodejs"})
    var res = posts.find({});
    console.log(res)
}