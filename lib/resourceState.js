'use strict';

let https = require('https'),
    http = require('http'),
    forwardHeaders = ['Authorization'];

function getResourceStateAsync(req) {
    return new Promise((resolve, reject) => {

        if(req.protocol === 'https'){
            let options = {
                method: 'HEAD',
                protocol: 'https:',
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
                resolve({
                    etag: res.headers['etag'],
                    lastModified: res.headers['last-modified']
                });
            })
            .on('error', reject)
            .end();           
        } else {
            let options = {
                method: 'HEAD',
                protocol: req.protocol + ':',
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
                resolve({
                    etag: res.headers['etag'],
                    lastModified: res.headers['last-modified']
                });
            })
            .on('error', reject)
            .end();
        }
    });
}

module.exports = getResourceStateAsync;
