(function() {
    var webview = document.querySelector('webview');

    //Trap notifications
    var interval = setInterval(function () {
        webview.contentWindow.postMessage({type: 'handshake'}, "*");
    }, 1000);

    addEventListener('message', function(e) {
        var msg = e.data;
        if(msg.type == 'notif') {
            if (!document.hasFocus()) {
                var notification = new Notification(msg.conversation, msg.data);

                notification.addEventListener('click', function() {
                    webview.contentWindow.postMessage({type: 'click', id: msg.id}, "*");
                    chrome.app.window.current().show(true);
                });

                setTimeout(function() {
                    notification.close();
                }, 5000);

                chrome.app.window.current().drawAttention();
            } else {
                chrome.app.window.current().clearAttention();
            }
        } else if (msg.type == 'init') {
            clearInterval(interval);
            console.log("Notification trapper init");
        }
    });
}());
