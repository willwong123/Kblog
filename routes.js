/**
 * Created by 14050185 on 2016/2/2.
 */

var parse = require("co-body");
var render = require("./libs/render");
var uuid = require("node-uuid");

//var db = require("./db/db");

var monk = require("monk");
var wrap = require("co-monk");
var database = monk("localhost/blog");
var posts = wrap(database.get("posts"));

module.exports = {
    index: function* () {
        var indexList = yield posts.find({}, {limit: 5,sort: {time: -1}});
        this.body = yield render('content', {posts: indexList})
    },
    addNew: function* () {
        this.body = yield render("add", {})
    },
    detail: function* (id) {
        var post = yield posts.findOne({id: id});
        if (!post) this.throw(404, "Can not find this!");
        this.body = yield render('article', {post: post})
    },
    tags: function* () {
        var tagsAll = yield posts.find({}, [{$group: {_id: "$tags", count: {$sum: 1}}}]);
        console.log(tagsAll);
        this.body = yield render("tags", {tags: tagsAll})
    },
    add: function* () {
        var post = yield parse(this);
        post.time = new Date().toLocaleString();
        post.id = uuid.v4();
        yield posts.insert(post);
        this.redirect("/");
    }

};