'use strict';

let https = require('https'),
    http = require('http'),
    forwardHeaders = ['Authorization'];

async function getResourceStateAsync(req) {
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

    // Get Etag via http protocol
    let res_http = new Promise((resolve, reject) => {
        http.request(options, res => {
                resolve(res);
            })
            .on('error', reject)
            .end();
    });
    let res = await res_http;

    // Http code meanin redirect to https protocol
    if (res.statusCode !== 301) {
        return {
            etag: res.headers['etag'],
            lastModified: res.headers['last-modified']
        }
    }

    // Get Etag information via https protocol
    let res_https =new Promise((resolve, reject) => {
        options.protocol = 'https:';
        console.log(options.protocol)
        https.request(options, res => {
                resolve(res);
            })
            .on('error', reject)
            .end();
    });
    res = await res_https;
    return {
        etag: res.headers['etag'],
        lastModified: res.headers['last-modified']
    }
}

module.exports = getResourceStateAsync;