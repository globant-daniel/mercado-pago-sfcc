'use strict';

var server = require('server');

server.extend(module.superModule);

server.append('Begin', function (req, res, next) {
    var currentBasket = require('dw/order/BasketMgr').currentBasket;

    if (currentBasket) {
        res.setViewData({
            basketTotal: currentBasket.totalGrossPrice.value
        });
    }
    return next();
});

module.exports = server.exports();
