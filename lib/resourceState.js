'use strict';

let https = require('https'),
    http = require('http'),
    forwardHeaders = ['Authorization'];

function getResourceStateAsync(req) {
    return new Promise((resolve, reject) => {
        let options = {
            method: 'HEAD',
            protocol: 'http:',
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
        http
        .request(options, res => {
            if (res.statusCode === 301) {
                options.protocol = 'https';
                https.request(options, res => {
                    resolve({
                        etag: res.headers['etag'],
                        lastModified: res.headers['last-modified']
                    });
                });
            } else {
                resolve({
                    etag: res.headers['etag'],
                    lastModified: res.headers['last-modified']
                });
            }
        })
        .on('error', reject)
        .end();

    });
}

module.exports = getResourceStateAsync;
