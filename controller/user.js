var mongoose = require("mongoose");
var parse = require("co-body");
var uuid = require("node-uuid");
var md5 = require("md5");

// 加载配置文件
var config = require("../config");

var render = require("../libs/render");
var User = require("../model/user");
var auth = require("../libs/auth");

/*
 * 用户登录页面
 * */
module.exports.login = function* () {
    this.body = yield render("bePages/login", {})
};

/*
 * 用户注销页面
 * */
module.exports.logout = function* () {
    this.session = null;
    this.body = yield render("bePages/login", {})
};

/*
* 验证用户登录
* */
module.exports.saveLogin = function* () {
    var userInfo = yield parse(this);

    // 查询是否存在该用户
    var qRes = yield User.find({username: userInfo.username}).count();

    // 用户不存在，返回错误码10001
    if (!qRes) {
        this.errCode = 10001;
        this.redirect("/login");
        return;
    }

    // 存在，验证密码
    var pRes = yield User.find({username: userInfo.username, password: md5(userInfo.password)}).count();

    // 密码错误，返回错误吗10002
    if (!pRes) {
        this.errCode = 10002;
        this.redirect("/login");
        return;
    }

    this.session.user = userInfo;
    // 设置session超时时间，半小时
    this.session.maxAge = config.sessionAge;

    // 登录成功，跳转至后台首页
    this.redirect("/login/posts");

};

/*
* 注册用户
* */
module.exports.register = function* () {
    this.body = yield render("bePages/register", {})
};

/*
* 保存新用户
* */
module.exports.saveAdd = function* () {
    var self = this;
    var newUser = yield parse(this);
    newUser.password = md5(newUser.password);
    newUser.time = new Date();
    newUser.role = 'admin';
    newUser.id = uuid.v1();

    var user = new User(newUser);

    user.save(function(err) {
        if (err) console.err(err);
        self.session.user = user;
    });

    this.redirect("login");
};