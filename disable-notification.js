/**
 * DEPRECATED
 * This file is used to support 0.2.X or older versions
 */

(function() {
    console.log('Loaded Notification disable');

    window.Notification = function (a, b) {
        console.log('new notification created',a,b);
    }

    window.Notification.permission="granted";
    window.Notification.requestPermission = function (e) {
        console.log('req per');
    }

}());