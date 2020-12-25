'use strict';

let http = require('https'),
    forwardHeaders = ['Authorization'];

function getResourceStateAsync(req) {
    return new Promise((resolve, reject) => {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++")
        let options = {
            method: 'HEAD',
            protocol: 'https' + ':',
            hostname: req.hostname,
            port: req.get('host').split(':')[1],
            path: req.originalUrl,
            headers: {}
        };
        console.warn("OPTIONS_1:" + JSON.stringify(options))
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++")
        forwardHeaders.forEach(name => {
            let value = req.get(name);
            if (typeof value !== 'undefined')
                options.headers[name] = value;
        });
        console.warn("OPTIONS_2:" + JSON.stringify(options))
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++")
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
