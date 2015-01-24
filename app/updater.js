(function() {
    var INTERVAL_MIN = 30;

    setInterval(function() {
        chrome.runtime.requestUpdateCheck(function(status) {
            if(status == 'update_available') {
                chrome.runtime.reload();
            }
        });
    }, INTERVAL_MIN  * 60 * 1000);
    console.log('Initialized update checker');
}());
