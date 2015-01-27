(function() {
    var INTERVAL_MIN = 15;

    function showUpdateMessage() {
        document.getElementById('finishUpdateBar').style['display'] = '';
    }

    setInterval(function() {
        chrome.runtime.requestUpdateCheck(function(status) {
            if(status == 'update_available') {
                showUpdateMessage();
            }
        });
    }, INTERVAL_MIN  * 60 * 1000);

    document.getElementById('finishUpdate').addEventListener('click', function(){
        chrome.runtime.reload();
    });

    console.log('Initialized update checker');
}());
