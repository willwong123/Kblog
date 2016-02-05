var mongoose = require("mongoose");
var parse = require("co-body");
var uuid = require("node-uuid");
var markdown = require("markdown").markdown;

// 加载配置文件
var config = require("../config");

var render = require("../libs/render");
var Blog = require("../model/blog");

/*
 * 获取文章列表
 * */
module.exports.index = function* () {
    // 确定当前页面
    var cur = parseInt(this.query.page || 1, 10);

    // 查询当前页面数据
    var indexList = yield Blog.find({})
        .sort({time: -1})
        .skip(config.indexLimit * (cur - 1))
        .limit(config.indexLimit);

    // 查询全部数据长度
    var count = yield Blog.count();

    // 设置翻页状态
    var prov = cur - 1;
    var next = cur * config.indexLimit >= count ? 0 : cur + 1;

    // 渲染页面
    this.body = yield render('fePages/content', {
        posts: indexList,
        page: {
            prov: prov,
            next: next,
            cur: cur
        }
    });
};

/*
* 获取标签
* TODO: 待完善功能
* */
module.exports.tags = function* () {
    var tagsAll = yield Blog.distinct("tags");
    this.body = yield render("fePages/tags", {tags: tagsAll})
};

/*
 * 获取文章详情
 * */
module.exports.detail = function* () {
    // 获取文章详情参数
    var id = this.params['postId'];

    // 查询文章内容
    var post = yield Blog.findOne({id: id});

    if (!post) {
        // 404
        this.body = yield render('fePages/404', {});
        return;
    }

    // 渲染文章详情页
    this.body = yield render('fePages/article', {post: post})
};

/*
 * 保存新增文章
 * */
module.exports.save = function* () {
    // 解析传入的参数
    var post = yield parse(this);

    // 获取并格式化当前时间
    var fullTime = new Date();
    var year = fullTime.getFullYear();
    var month = fullTime.getMonth() < 9 ? '0' + (parseInt(fullTime.getMonth()) + 1) : parseInt(fullTime.getMonth()) + 1;
    var day = fullTime.getDay() < 10 ? '0' + fullTime.getDay() : fullTime.getDay();
    var hour = fullTime.getHours() < 10 ? "0" + fullTime.getHours() : fullTime.getHours();
    var minute = fullTime.getMinutes() < 10 ? '0' + fullTime.getMinutes() : fullTime.getMinutes();
    var second = fullTime.getSeconds() < 10 ? '0' + fullTime.getSeconds() : fullTime.getSeconds();

    // 转义特殊字符函数
    function html2Escape(sHtml) {
        return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
    }
    // markdown化正文
    post.content = html2Escape(post.content);

    // 设置新增文章标签
    post.tags = post.tags.split(',');

    // 设置新增文章时间
    post.time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

    // 设置新增文章id
    post.id = uuid.v4();

    // 实例化Blog
    var blog = new Blog(post);

    // 保存至数据库
    blog.save();

    this.redirect("/login/posts");
};

/*
 * 新增文章
 * */
module.exports.addNew = function* () {
    this.body = yield render("bePages/add", {})
};

/*
* 修改文章
* */
module.exports.edit = function* () {
    var id = this.params['postId'];
    var post = yield Blog.findOne({id: id});
    console.log(post)
    this.body = yield render("bePages/add", {post: post});
};

/*
* 删除文章
* */
module.exports.remove = function* () {
    var id = this.params['postId'];
    yield Blog.remove({id: id},function(err) {
        if (err) {
            console.log(err);
            return;
        }
    });
    this.redirect("/login/posts");
}

/*
 * 文章管理页面
 * */
module.exports.manage = function* () {

    var posts = yield Blog.find({}).sort({time: -1});
    var user = this.session.user.username;

    this.body = yield render("bePages/index", {list: posts, user: user})
};
