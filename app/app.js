(function() {
    var webview = document.querySelector('webview');

    //Accept any permission from the webview
    webview.addEventListener('permissionrequest', function (e) {
        console.log("webview requested " + e.permission);
        e.request.allow();
    });

    //Init the web view
    webview.addEventListener('contentload', function (e) {
        console.log('Starting poller');

        download("../guest/trap-notification.js", function(content){
            var code = 'var script = document.createElement("script");' +
                    'script.innerHTML="eval(atob(\''+ btoa(content) + '\'))";' +
                    'document.head.appendChild(script);';
            webview.executeScript(
                {
                    code: code
                },function(e){
                    console.log(chrome.runtime.lastError);
                }
            );
        });


        webview.executeScript(
            {
                file: 'guest/guest-injection.js'
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

    function replace(str, search, replace) {
        return str.split(search).join(replace);
    }

    function download(url, callback) {
        var oReq = new XMLHttpRequest();
        //oReq.responseType = 'arraybuffer';
        oReq.onload = function(){callback(oReq.response)};
        oReq.open("get", url, true);
        oReq.send();
    }
}());
