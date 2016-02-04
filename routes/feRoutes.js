var Blog = require("./../controller/blog");

module.exports = function (route) {
    route.get("/", Blog.index);
    route.get("/post", Blog.index);
    route.get("/tags", Blog.tags);
    route.get("/post/new", Blog.addNew);
    route.get("/post/:postId", Blog.detail);
    route.post("/post", Blog.save);
};
