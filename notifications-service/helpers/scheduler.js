var schedule = require('node-schedule');
var amazonNotifications = require('../helpers/amazonNotifications');

exports.makeSchedule = function (time, notification){
    // Schedule the job
    console.log("Notification scheduled for "+ new Date(time))
    schedule.scheduleJob(new Date(time), function () {
        amazonNotifications.sendAmazonMediaContentNotification(notification);
    });
}