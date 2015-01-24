console.log('Loaded Notification trapper');
(function() {
    var source = null;
    var origin = null;

    //Initialize source and origin for notification trapping
    window.addEventListener('message', function(e){
        console.log("Got handshake from " + e.origin);
        source = e.source;
        origin = e.origin;
        e.source.postMessage({type:'init'}, origin);
    });

    window.Notification = function (a, b) {
        if (source != null) {
            if(b.icon != null) {
                download(b.icon, function(data){
                    var blb = new Blob([data], {type: 'image/png'});
                    var url = (window.URL || window.webkitURL).createObjectURL(blb);
                    b.icon = url;
                    forwardNotif(a, b);
                });
            } else {
                forwardNotif(a, b);
            }
            console.log('Notification trapped', a, b);
        } else {
            console.log('Notification trapped but not bubbled');
        }
    }

    window.Notification.permission="granted";

    window.Notification.requestPermission = function (e) {
        console.log('req per');
    }

    function forwardNotif(a, b) {
        source.postMessage({type: 'notif', conversation: a, data: b}, origin);
    }

    function download(url, callback) {
        var oReq = new XMLHttpRequest();
        oReq.responseType = 'arraybuffer';
        oReq.onload = function(){callback(oReq.response)};
        oReq.open("get", url, true);
        oReq.send();
    }

}());

