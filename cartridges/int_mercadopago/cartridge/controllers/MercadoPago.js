'use strict';

var server = require('server');

server.get('Reentry', function (req, res, next) {
    res.json(req);
    next();
});

server.get('Notfiy', function (req, res, next) {
    res.json(req);
    next();
});

module.exports = server.exports();
