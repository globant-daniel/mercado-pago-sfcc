'use strict';

var MerchantOrder = require('../documents/merchant_order');
var orderEndpoints = require('./endpoints').order;

/**
 * @param {string} orderId - Merchant Order ID
 * @returns {Object} Merchant Order
 */
function get(orderId) {
    var result = orderEndpoints.get(orderId);

    if (!result.ok) {
        var Logger = require('dw/system/Logger');
        Logger.error(
            'Error in merchant_order creation. \nResponse: {0}',
            result.errorMessage
        );
        return JSON.parse(result.errorMessage);
    }

    return JSON.parse(result.object.text);
}

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
            'Error in merchant_order creation. \nResponse: {0}',
            result.errorMessage
        );
        return JSON.parse(result.errorMessage);
    }

    return JSON.parse(result.object.text);
}

module.exports = {
    get: get,
    create: create
};
