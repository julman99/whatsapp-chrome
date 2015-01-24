console.log('Loaded Notification trapper');
(function() {
    var source = null;
    var origin = null;
    var ids = 0;
    var store = {};

    //Initialize source and origin for notification trapping
    window.addEventListener('message', function(e){
        var msg = e.data;
        if(msg.type == 'handshake') {
            console.log("Got handshake from " + e.origin);
            source = e.source;
            origin = e.origin;
            e.source.postMessage({type: 'init'}, origin);
        } else if (msg.type == 'click') {
            var notif = store[msg.id];
            if(notif != null) {
                delete store[msg.id];
                dispatchConversationChanged();
                notif.onclick();
            }
        }
    });

    window.Notification = function (a, b) {
        if (source != null) {
            var id = ++ids;
            store[id] = this;
            if(b.icon != null) {
                download(b.icon, function(data){
                    var blb = new Blob([data], {type: 'image/png'});
                    var url = (window.URL || window.webkitURL).createObjectURL(blb);
                    b.icon = url;
                    forwardNotif(a, b, id);
                });
            } else {
                forwardNotif(a, b, id);
            }
            console.log('Notification trapped', a, b);

            //Make sure we delete the notifications after 10min so they dont stay forever in the cache
            setTimeout(function(){
                delete store[id];
            },10 * 60 * 1000);
        } else {
            console.log('Notification trapped but not bubbled');
        }
    }

    window.Notification.permission="granted";

    window.Notification.requestPermission = function (e) {
        console.log('Requested notification permission');
    }

    function forwardNotif(a, b, id) {
        source.postMessage({type: 'notif', conversation: a, data: b, id: id}, origin);
    }

    function download(url, callback) {
        var oReq = new XMLHttpRequest();
        oReq.responseType = 'arraybuffer';
        oReq.onload = function(){callback(oReq.response)};
        oReq.open("get", url, true);
        oReq.send();
    }

    function dispatchConversationChanged() {
        setTimeout(function() {
            document.dispatchEvent(new document.defaultView.CustomEvent('conversation-changed'));
        },0);
    }

}());

