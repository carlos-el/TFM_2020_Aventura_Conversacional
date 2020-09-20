var https = require('https');
var config = require('../config');
var qs = require('querystring');

exports.requestAmazonApiToken = requestAmazonApiToken = function () {
    var options = {
        'method': 'POST',
        'hostname': config.amazon_credential_service.url,
        'path': config.amazon_credential_service.path,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        'maxRedirects': 5
    };

    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            body = JSON.parse(body.toString())
            saveAmazonApiToken(body.access_token)
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': process.env.AMAZON_API_CLIENT_ID,
        'client_secret': process.env.AMAZON_API_CLIENT_ID_SECRET,
        'scope': 'alexa::proactive_events'
    });

    req.write(postData);

    req.end();
}

exports.saveAmazonApiToken = saveAmazonApiToken = function (token) {
    process.env.AMAZON_API_TOKEN = token;
}

exports.getAmazonApiToken = getAmazonApiToken = function () {
    return process.env.AMAZON_API_TOKEN;
}