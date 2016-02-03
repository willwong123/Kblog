var Koa = require("koa");
var Router = require("koa-router");
var logger = require('koa-logger');
var path = require("path");
var staticServer = require("koa-static");
var database = require("./db/db");

var route = new Router;

var app = new Koa();

// 日志
app.use(logger());

// 生成路由
var routesAll = require("./routes");
routesAll(route);

// 静态资源服务，并启用缓存
app.use(staticServer(path.join(__dirname, "/public"), {maxage: 86400000}));
// 启用路由
app.use(route.routes());
app.use(route.allowedMethods());

// 启动服务
app.listen(3000);
console.log('listening on port 3000');