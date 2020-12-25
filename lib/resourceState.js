'use strict';

let https = require('https'),
    forwardHeaders = ['Authorization'];

function getResourceStateAsync(req) {
    return new Promise((resolve, reject) => {
        let options = {
            method: 'HEAD',
            protocol: 'https' + ':',
            hostname: req.hostname,
            port: req.get('host').split(':')[1],
            path: req.originalUrl,
            headers: {}
        };
        forwardHeaders.forEach(name => {
            let value = req.get(name);
            if (typeof value !== 'undefined')
                options.headers[name] = value;
        });
        https
            .request(options, res => {
                console.warn("res.statusCode: " + res.statusCode)
                console.warn("res.statusMessage" + res.statusMessage)
                console.warn("res.headers: " + res.headers)
                console.warn("res.body: " + res.body)
                console.log("++++++++++++++++++++++++++++++++++++++++++++++++++")
                resolve({
                    etag: res.headers['etag'],
                    lastModified: res.headers['last-modified']
                });
            })
            .on('error', reject)
            .end();
    });
}

module.exports = getResourceStateAsync;
