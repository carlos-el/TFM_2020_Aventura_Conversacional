var http = require('http');
const config = require('../config');

exports.sendTrapNotification = function (user, time) {
    var options = {
        'method': 'POST',
        'hostname': config.notification_server.url,
        'port': config.notification_server.port.toString(),
        'path': config.notification_server.path,
        'headers': {
            'Content-Type': 'application/json'
        },
        'maxRedirects': 5
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            // var body = Buffer.concat(chunks);
            // console.log(body.toString());
        });

        res.on("error", function (error) {
            //console.error(error);
        });
    });

    var postData = JSON.stringify({
        "user": user,
        "title": "Tu mundo de Expedición Salvamento",
        "body": "Una captura usando una trampa",
        "time": new Date(time).toISOString(),
    });

    req.on('error', function (e) {  // manages connection refused error
        //console.log(e);
    });
    req.write(postData);

    req.end();
}


