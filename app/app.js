(function() {
    var webview = document.querySelector('webview');

    webview.addEventListener('permissionrequest', function (e) {
        console.log("webview requested " + e.permission);
        e.request.allow();
        //appWin.drawAttention();
        //chrome.browserAction.setBadgeText("12")
    });

    webview.addEventListener('contentload', function (e) {
        console.log('Starting poller');

        webview.executeScript(
            {
                code: 'var script = document.createElement("script");' +
                'script["src"] = "https://rawgit.com/julman99/whatsapp-chrome/1323983/guest/trap-notification.js";' +
                'document.head.appendChild(script);'
            }
        )

        webview.executeScript(
            {
                file: 'guest/guest-injection.js'
            }
        )
    });

    webview.addEventListener('newwindow', function (e) {
        window.open(e.targetUrl, '_blank');
    });

}());
