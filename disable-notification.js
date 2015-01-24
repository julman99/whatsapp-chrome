(function() {
    console.log('Loaded Notification disable');

    window.Notification = function () {
        this.permission = "granted";
        console.log('new notification created');

        this.requestPermission = function (e) {
            console.log('req per');
        }
    }
}());
