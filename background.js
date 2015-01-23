chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('window.html',
        {
            'bounds': {
                'width': 800,
                'height': 680
            },
            id: 'whatsapp'
        },
        onWindowCreated
    );
});

function onWindowCreated(appWin) {

    appWin.contentWindow.addEventListener('load', function(){

        var webview = appWin.contentWindow.document.querySelector('webview');

        // Resize the webview when the window resizes.
        appWin.onBoundsChanged.addListener(function(){onBoundsChanged(appWin)});


        // Initialize the webview size once on launch.
        setTimeout(function() {
            onBoundsChanged(appWin);
        }, 0);

        ////Interval to fix the white window on startup
        var interval = setInterval(function() {
            onBoundsChanged(appWin);
            webview.executeScript(
                {
                    file: 'hide-notification-request.js'
                }
            )
        }, 100);

        //Cancel the hacky interval after a minute
        setTimeout(function() {
            clearInterval(interval);

        }, 60000);
    });

    appWin.contentWindow.addEventListener('message', function(e) {
        if (!appWin.contentWindow.document.hasFocus()) {
            appWin.drawAttention();
        }
    });

    //chrome.browserAction.setBadgeText({text: "10+"})


}

function onBoundsChanged(appWin) {
    var webview = appWin.contentWindow.document.querySelector('webview');

    var bounds = appWin.getBounds();
    var variance = Math.round(Math.random() * 10);
    webview.style.height = bounds.height  + 'px';
    webview.style.width = bounds.width + '.0' + variance + 'px';
}