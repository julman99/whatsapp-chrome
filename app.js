var webview = document.querySelector('webview');

webview.addEventListener('permissionrequest', function(e) {
    console.log("webview requested " + e.permission);
    e.request.allow();
    //appWin.drawAttention();
    //chrome.browserAction.setBadgeText("12")
});

webview.addEventListener('contentload', function(e) {
    console.log('Starting poller');

    var scriptLocation =  window.location.origin + '/a.js';
    webview.executeScript(
        {
            code: 'var script = document.createElement("script");' +
                  'script["src"] = "https://rawgit.com/julman99/whatsapp-chrome/master/disable-notification.js";' +
                  'document.head.appendChild(script);'
        }
    )
    console.log(scriptLocation);

    webview.executeScript(
        {
            file: 'guest-injection.js'
        }
    )

    setTimeout(function(){
            webview.contentWindow.postMessage("handshake", "*");
        },100
    );
});

webview.addEventListener('newwindow', function(e) {
    window.open(e.targetUrl,'_blank');
});
