(function(){
    var ALARM_ID = 'rate.alarm';
    var STORAGE_ID = 'rate.alarm.canceled';

    bindEvents();
    checkAlarmExists();

    function checkAlarmExists() {
        chrome.alarms.get(ALARM_ID, function(alarm) {
            if(alarm == null) {
                console.log('Creating Rate alarm');
                createRateAlarm();
            } else {
                console.log('There is a Rate alarm already defined');
            }
        });
    }

    function createRateAlarm() {
        chrome.alarms.create(ALARM_ID, {when: tomorrow()});
    }

    function cancelAlarmForever() {
        //We need to create the object in a variable or the set method wont work: http://stackoverflow.com/questions/14982560/using-a-variable-key-in-chrome-storage-local-set
        var obj = {};
        obj[STORAGE_ID] = "canceled";
        chrome.storage.local.set(obj, function(e){});
    }

    function isAlarmCanceledForever(callback) {
        chrome.storage.local.get(STORAGE_ID, function(v){
            callback(v[STORAGE_ID] === "canceled");
        })
    }

    function tomorrow() {
        return new Date().getTime() + 24 * 60 * 60 * 1000; //1 day
        //return new Date().getTime() + 15000;
    }

    function bindEvents() {
        //Alarm bind
        chrome.alarms.onAlarm.addListener(function(alarm){
            if(alarm.name == ALARM_ID) {
                isAlarmCanceledForever(function(canceled){
                    if(!canceled) {
                        displayRateNotification();
                    }
                })
            }
        })

        //Notification bind
        chrome.notifications.onClicked.addListener(function(notificationId){
            if(notificationId.indexOf('rate.') === 0) {
                cancelAlarmForever();
                window.open('https://chrome.google.com/webstore/detail/whatsapp-for-chrome/bgkodfmeijboinjdegggmkbkjfiagaan', '_blank');
            }
        });
        chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex){
            if(notificationId.indexOf('rate.') === 0) {
                switch (buttonIndex) {
                    case 0:
                        createRateAlarm();
                        break;
                    case 1:
                        cancelAlarmForever();
                        break;
                }
            }
        });
        chrome.notifications.onClosed.addListener(function(notificationId){
            if(notificationId.indexOf('rate.') === 0) {
                createRateAlarm();
            }
        });
    }

    function displayRateNotification() {
        var id = 'rate.' + new Date().getTime();

        chrome.notifications.create(id, {
            type: 'basic',
            title: 'Do you like WhatsChrome?',
            message: 'Click here and rate us 5 star',
            iconUrl: '../icon.png',
            isClickable: true,
            buttons: [{
                title: 'Remind me tomorrow'
            }, {
                title: 'Don\'t remind me'
            }]
        }, function (x) {
            //nothing
        });
    }
}());
