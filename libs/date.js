module.exports = function() {
    // 格式化当前时间
    var fullTime = new Date();
    var year = fullTime.getFullYear();
    var month = fullTime.getMonth() < 9 ? '0' + (parseInt(fullTime.getMonth()) + 1) : parseInt(fullTime.getMonth()) + 1;
    var day = fullTime.getDate() < 10 ? '0' + fullTime.getDate() : fullTime.getDate();
    var hour = fullTime.getHours() < 10 ? "0" + fullTime.getHours() : fullTime.getHours();
    var minute = fullTime.getMinutes() < 10 ? '0' + fullTime.getMinutes() : fullTime.getMinutes();
    var second = fullTime.getSeconds() < 10 ? '0' + fullTime.getSeconds() : fullTime.getSeconds();

    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
};