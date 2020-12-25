'use strict';

let http = require('http'),
    forwardHeaders = ['Authorization'];

function getResourceStateAsync(req) {
    return new Promise((resolve, reject) => {
        console.warn("REG:" + JSON.stringify(req))
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++")
        let options = {
            method: 'HEAD',
            protocol: req.protocol + ':',
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
        http
            .request(options, res => {
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
