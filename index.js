var Koa = require("koa");
var Router = require("koa-router");
var logger = require('koa-logger');
var path = require("path");
var staticServer = require("koa-static");
var session = require("koa-session");
var database = require("./db/db");
var config = require("./config");

var route = new Router;

var app = new Koa();

// 日志
app.use(logger());

// session
app.keys = config.keys;
app.use(session(app));

// 分别生成前台，后台路由
var feRoutesAll = require("./routes/feRoutes");
var beRoutesAll = require("./routes/beRoutes");
feRoutesAll(route);
beRoutesAll(route);

// 静态资源服务，并启用缓存
app.use(staticServer(path.join(__dirname, "/public"), {maxage: config.staticAge}));
// 启用路由
app.use(route.routes());
app.use(route.allowedMethods());

// 启动服务
app.listen(3000);
console.log('listening on port 3000');