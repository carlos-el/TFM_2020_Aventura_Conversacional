var https = require('https');
var config = require('../config');
var scheduler = require('../helpers/scheduler');
var tokenManagement = require('../helpers/tokenManagement');

exports.sendAmazonMediaContentNotification = async function (notification) {
    var token = tokenManagement.getAmazonApiToken()
    var options = {
        'method': 'POST',
        'hostname': config.amazon_notification_service.url,
        'path': config.amazon_notification_service.path,
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        'maxRedirects': 5
    };

    var req = https.request(options, function (res) {
        var chunks = [];
        
        if(res.statusCode == 403){
            // If there was a problem with the token the reset the token
            tokenManagement.requestAmazonApiToken();
            // And the re-schedule the job
            scheduler.makeSchedule(new Date(Date.now()+60000), notification)
        } else if (res.statusCode == 202){
            console.log("Notification sent at " + new Date().toString())
        }

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            //var body = Buffer.concat(chunks);
            //console.log(body.toString())
            //body = JSON.parse(body.toString())
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = JSON.stringify({
        "timestamp": new Date().toISOString(),
        "referenceId": "unique-id-of-this-event-instance-abc123456789",
        "expiryTime": new Date(Date.now() + 1830000).toISOString(), // Add 35 minutes to set the expiry time
        "event": {
            "name": "AMAZON.MediaContent.Available",
            "payload": {
                "availability": {
                    "startTime": new Date(notification.time).toISOString(),
                    "provider": {
                        "name": "localizedattribute:providerName"
                    }, "method": "AIR"
                },
                "content": {
                    "name": "localizedattribute:contentName",
                    "contentType": "GAME"
                }
            }
        },
        "localizedAttributes": [
            {
                "locale": "es-ES",
                "providerName": notification.title,
                "contentName": notification.body
            }
        ], "relevantAudience": {
            "type": "Unicast",
            "payload": {
                "user": notification.user
            }
        }
    });

    req.write(postData);

    req.end()
}