var mongoose = require("mongoose");
var parse = require("co-body");
var uuid = require("node-uuid");
var markdown = require("markdown").markdown;

// 加载配置文件
var config = require("../config");

var Blog = require("../model/blog");

var render = require("../libs/render");
var date = require("../libs/date");

/*
 * 前台文章列表
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
 * 前台展示文章详情
 * */
module.exports.detail = function* () {
    // 获取文章详情参数
    var id = this.params['postId'];

    // 查询文章内容
    var post = yield Blog.findOne({id: id});

    post.content = markdown.toHTML(post.content);

    if (!post) {
        // 404
        this.body = yield render('fePages/404', {});
        return;
    }

    // 渲染文章详情页
    this.body = yield render('fePages/article', {post: post})
};

/*
 * 后台文章管理页面
 * */
module.exports.manage = function* () {
    // 当前展示页的页码
    var cur = parseInt(this.query.p || 1, 10);

    var postsCount = yield Blog.find({}).count();
    var posts = yield Blog.find({})
        .sort({time: -1})
        .skip((cur - 1) * config.backLimit)
        .limit(config.backLimit);

    var page = Math.ceil(postsCount / config.backLimit);

    var user = this.session.user.username;
    this.body = yield render("bePages/index", {list: posts, user: user, page: page})
};

/*
 * 后台新增文章
 * */
module.exports.addNew = function* () {
    this.body = yield render("bePages/add", {post: {}, edit: false})
};

/*
 * 后台保存新增文章
 * */
module.exports.save = function* () {
    // 解析传入的参数
    var post = yield parse(this);

    // 设置新增文章标签
    post.tags = post.tags.split(',');

    // 设置新增文章时间
    post.time = date();

    // 设置新增文章id
    post.id = uuid.v4();

    // 实例化Blog
    var blog = new Blog(post);

    // 保存至数据库
    blog.save(function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("新数据保存成功！")
    });

    this.redirect("/login/posts");
};

/*
* 后台修改文章
* */
module.exports.edit = function* () {
    var id = this.params['postId'];
    var post = yield Blog.findOne({id: id});
    this.body = yield render("bePages/add", {post: post, edit: true});
};

/*
* 后台保存修改
* */
module.exports.saveEdit = function* () {
    var id = this.params["postId"];
    // 解析传入的参数
    var post = yield parse(this);

    // 设置新增文章标签
    post.tags = post.tags.split(',');

    // 更新实例
    Blog.update({id: id},
        {$set:
            {   tags: post.tags,
                content: post.content,
                time: date(),
                title: post.title
            }
        }, {}, function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("数据更新成功！")
        });

    this.redirect("/login/posts");
};

/*
* 后台删除文章
* */
module.exports.remove = function* () {
    var id = this.params['postId'];
    yield Blog.remove({id: id},function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("删除单条数据成功!");
    });
    this.redirect("/login/posts");
};

/*
 * 后台批量删除文章
 * */
module.exports.removeGroup = function* () {
    var reqBody = yield parse(this);
    var idArr = reqBody.id;
    yield Blog.remove({id: {$in: idArr}},function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("删除批量数据成功!");
    });
    this.redirect("/login/posts");
};