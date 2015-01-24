(function() {
    var webview = document.querySelector('webview');

    //Trap notifications
    var interval = setInterval(function () {
        webview.contentWindow.postMessage("handshake", "*");
    }, 1000);

    addEventListener('message', function(e) {
        var msg = e.data;
        if(msg.type == 'notif') {
            if (!document.hasFocus()) {
                new Notification(msg.conversation, msg.data);
                appWin.drawAttention();
            } else {
                appWin.clearAttention();
            }
        } else if (msg.type == 'init') {
            clearInterval(interval);
            console.log("Notification trapper init");
        }
    });
}());
