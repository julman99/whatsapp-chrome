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
                  'script["src"] = "https://dl.dropboxusercontent.com/u/13722362/a.js?dl=1";' +
                  'document.head.appendChild(script);'
        }
    )
    console.log(scriptLocation);

    webview.executeScript(
        {
            file: 'poll-notifications.js'
        }
    )

    setTimeout(function(){
            webview.contentWindow.postMessage("handshake", "*");
        },100
    );
});

var intervalMessagesPoll = setInterval(function() {
    onBoundsChanged(appWin);
}, 1000);
