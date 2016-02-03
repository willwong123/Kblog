/**
 * Created by 14050185 on 2016/1/26.
 */
var Koa = require("koa");
var route = require("koa-route");
var logger = require('koa-logger');
var parse = require('co-body');
var render = require('./libs/render');
var app = new Koa();

app.use(logger())

var routes = require("./routes");
app.use(route.get("/", routes.index));
app.use(route.get("/tags", routes.tags));
app.use(route.get("/post/new", routes.addNew));
app.use(route.get("/post/:id", routes.detail));
app.use(route.post("/post", routes.add));

app.listen(3000);
console.log('listening on port 3000');