module.exports = function (sHtml) {
    // 转义特殊字符函数
    return sHtml.replace(/[<>&"]/g,function(c) {
        return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];
    });
};