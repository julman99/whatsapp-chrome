Utils = {

    downloadText: function(url, callback) {
        var oReq = new XMLHttpRequest();
        oReq.onload = function(){callback(oReq.response)};
        oReq.open("get", url, true);
        oReq.send();
    },

    downloadBinary: function(url, callback) {
        var oReq = new XMLHttpRequest();
        oReq.responseType = 'arraybuffer';
        oReq.onload = function(){callback(oReq.response)};
        oReq.open("get", url, true);
        oReq.send();
    },

    copyTextToClipboard: function(text) {
        var copyFrom = document.createElement("textarea");
        copyFrom.textContent = text;
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        body.removeChild(copyFrom);
    }

}