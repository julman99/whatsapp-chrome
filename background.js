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
        var interval = createFixWhiteScreenInterval(100);

        //Cancel the hacky interval after a minute
        setTimeout(function() {
            clearInterval(interval);

            //We still fix the issue every 3 seconds just in case
            //Helpful for when someone takes too much time doing the QR code.
            //A more elegant fix for this would be doing jquery-livequery and listen for when the actual page is drawn
            createFixWhiteScreenInterval(3000);
        }, 60000);
    });

    appWin.contentWindow.addEventListener('message', function(e) {
        if (!appWin.contentWindow.document.hasFocus()) {
            appWin.drawAttention();
        } else {
            appWin.clearAttention();
        }
    });
}

function createFixWhiteScreenInterval(interval) {
    var interval = setInterval(function() {
        onBoundsChanged(appWin);
    }, 100);
    return interval;
}

function onBoundsChanged(appWin) {
    var webview = appWin.contentWindow.document.querySelector('webview');

    var bounds = appWin.getBounds();
    var variance = Math.round(Math.random() * 10);
    webview.style.height = bounds.height  + 'px';
    webview.style.width = bounds.width + '.0' + variance + 'px';
}