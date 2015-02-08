(function() {
    var webview = document.querySelector('webview');

    //Accept any permission from the webview
    webview.addEventListener('permissionrequest', function (e) {
        console.log("webview requested " + e.permission);
        e.request.allow();
    });

    //Init the web view
    webview.addEventListener('contentload', function (e) {
        webview.executeScript(
            {
                file: 'guest/guest-injection.js'
            }
        );

        webview.executeScript(
            {
                file: 'guest/share-menu.js'
            }
        )
    });

    //Handle when url are clicked inside the webview
    webview.addEventListener('newwindow', function (e) {
        window.open(e.targetUrl, '_blank');
    });

    //Handle focus event and pass it down to the webview
    window.addEventListener('focus',function(){
        webview.focus();
    });

}());
