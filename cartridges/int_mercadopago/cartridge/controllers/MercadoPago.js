'use strict';

var server = require('server');

server.get('Notification', function (req, res, next) {
    next();
});

module.exports = server.exports();
