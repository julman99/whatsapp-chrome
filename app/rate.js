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
                        displayRandomNotification();
                    }
                })
            }
        })

        //Notification bind
        chrome.notifications.onClicked.addListener(function(notificationId){
            cancelAlarmForever();
            if(notificationId.indexOf('rate.rate.') === 0) {
                window.open('https://chrome.google.com/webstore/detail/whatsapp-for-chrome/bgkodfmeijboinjdegggmkbkjfiagaan', '_blank');
            } else if(notificationId.indexOf('rate.share.fb.') === 0) {
                window.open('https://www.facebook.com/sharer/sharer.php?u=https://chrome.google.com/webstore/detail/whatschrome/bgkodfmeijboinjdegggmkbkjfiagaan?utm_source=share-fb');
            } else if(notificationId.indexOf('rate.share.link.') === 0) {
                Utils.copyTextToClipboard("https://chrome.google.com/webstore/detail/whatsapp-for-chrome/bgkodfmeijboinjdegggmkbkjfiagaan?utm_source=copy-link-notification");
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

    function displayRandomNotification() {
        var option = Math.round(Math.random() * 2);
        displayRateNotification(option)
    }

    function displayRateNotification(option) {
        var notification = {
            type: 'basic',
            isClickable: true,
            buttons: [{
                title: chrome.i18n.getMessage("rate_remindMe")
            }, {
                title: chrome.i18n.getMessage("rate_dontRemindMe")
            }]
        };
        if(option === 0) {
            var id = 'rate.rate.' + new Date().getTime();
            notification.title = chrome.i18n.getMessage("rate_doYouLike");
            notification.message = chrome.i18n.getMessage("rate_rate5star");
            notification.iconUrl = '../img/icon-stars.png';
        } else if(option == 1) {
            var id = 'rate.share.fb.' + new Date().getTime();
            notification.title = chrome.i18n.getMessage("rate_doYouLike");
            notification.message = chrome.i18n.getMessage("rate_fb");
            notification.iconUrl = '../img/icon-fb.png';
        } else if(option == 2) {
            var id = 'rate.share.link.' + new Date().getTime();
            notification.title = chrome.i18n.getMessage("rate_doYouLike");
            notification.message = chrome.i18n.getMessage("rate_link");
            notification.iconUrl = '../img/icon-link.png';
        }
        chrome.notifications.create(id, notification, function (x) {
            //nothing
        });
    }

    window.displayRateNotification = displayRateNotification;
    window.displayRandomNotification = displayRandomNotification;
}());
