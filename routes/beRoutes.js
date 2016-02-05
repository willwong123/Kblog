var User = require("./../controller/user");
var Blog = require("./../controller/blog");
var Auth = require("../libs/auth");

module.exports = function (route) {
    route.get("/login", User.login);
    route.post("/login", User.saveLogin);
    route.get("/logout", User.logout);
    route.get("/register", User.register);
    route.post("/register", User.saveAdd);

    // ��¼�ɹ�������¹���
    route.get("/login/posts", Auth(), Blog.manage);
    route.get("/login/post/new", Auth(), Blog.addNew);
    route.get("/login/edit/:postId", Auth(), Blog.edit);
    route.post("/login/edit/:postId", Auth(), Blog.saveEdit);
    route.post("/login/post", Auth(), Blog.save);
    // Ԥ������
    route.get("/preview/post/:postId", Auth(), Blog.detail);
    // ɾ������
    route.post("/login/remove/:postId", Auth(), Blog.remove);
};
