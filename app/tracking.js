(function() {
    var service = analytics.getService('whatsapp');
    var tracker = service.getTracker('UA-58879588-3');
    tracker.sendAppView('MainView');
}());