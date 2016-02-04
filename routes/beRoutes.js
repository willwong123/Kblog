var User = require("./../controller/user");
var Auth = require("../libs/auth");

module.exports = function (route) {
    route.get("/login", User.login);
    route.get("/login/index", Auth(), User.loginSuccess);
    route.post("/login", User.saveLogin);
    route.get("/register", User.register);
    route.post("/register", User.saveAdd);
};
