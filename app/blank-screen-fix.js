(function() {
    var webview = document.querySelector('webview');
    var POLL_INTERVAL = 500;
    var POLL_INTERVAL_SLOW = 4000;
    var POLL_TIMEOUT = 5 * 60 * 1000;

    webview.addEventListener('contentload', function (e) {
        var interval = startPolling(POLL_INTERVAL);

        //Failsafe, if the page has not loaded in 5 minutes, stop polling
        setTimeout(function(){
            clearInterval(interval);
            startPolling(POLL_INTERVAL_SLOW);
        }, POLL_TIMEOUT)
    });

    function startPolling(intervalms) {
        var polling = true;
        var interval = setInterval(function() {
            //The interval is canceled when the contect is detected to be fully loaded
            if (polling) {

                webview.executeScript({
                    code: 'document.querySelector(".app.two")'
                }, function (a) {
                    if (a[0] != null) {
                        console.log('Found .app.two');
                        polling = false;
                        setTimeout(function () {
                            clearInterval(interval);
                            console.log('Finished blank screen fix poll');
                        }, intervalms * 10);
                    }
                });
            }

            fixWithOpacity();
        },intervalms);

        return interval;
    }

    function fixWithOpacity(){
        webview.style.opacity = .99;
        setTimeout(function(){
            webview.style.opacity = 1;
        }, 0)
    }

}());
