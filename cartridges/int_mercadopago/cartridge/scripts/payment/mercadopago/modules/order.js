'use strict';

var MerchantOrder = require('../documents/merchant_order');
var orderEndpoints = require('./endpoints').order;

/**
 * @param {dw.order.Order} order - customer order
 * @returns {Object} result
 */
function create(order) {
    var body = new MerchantOrder(order);

    var result = orderEndpoints.create(body);

    if (!result.ok) {
        var Logger = require('dw/system/Logger');
        Logger.error(
            'Error on merchant_order creation. \nResponse: {0}',
            result.errorMessage
        );
        return JSON.parse(result.errorMessage);
    }

    return JSON.parse(result.object.text);
}

module.exports = {
    create: create
};
