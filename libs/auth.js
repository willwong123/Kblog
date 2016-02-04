var render = require("./render");

// 验证session
module.exports = function () {
    return function* (next) {
        if (!this.session || !this.session.user) {
            this.redirect("/login");
            return;
        }
        yield next;
    }
};