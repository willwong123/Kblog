module.exports = function (sHtml) {
    // ת�������ַ�����
    return sHtml.replace(/[<>&"]/g,function(c) {
        return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];
    });
};