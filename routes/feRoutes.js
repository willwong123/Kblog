var Blog = require("./../controller/blog");
var Auth = require("../libs/auth");

module.exports = function (route) {
    route.get("/", Blog.index);
    route.get("/post", Blog.index);
    route.get("/post/:postId", Blog.detail);
    route.get("/tags", Blog.tags);
};
