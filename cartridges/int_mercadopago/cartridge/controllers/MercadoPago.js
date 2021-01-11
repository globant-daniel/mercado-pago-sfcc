'use strict';

var server = require('server');

server.get('Notify', function (req, res, next) {
    next();
});

module.exports = server.exports();
