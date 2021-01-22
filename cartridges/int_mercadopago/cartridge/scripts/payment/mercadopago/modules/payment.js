'use strict';

var paymentEndpoints = require('./endpoints').payment;
var Payment = require('../documents/payment');

/**
 * @param {string} paymentId mercado pago api payment ID
 * @returns {Object} mercado pago api response
 */
function get(paymentId) {
    var response = paymentEndpoints.get(paymentId);
    if (!response.ok) {
        var Logger = require('dw/system/Logger');
        Logger.error(
            'Error in get payment. \nResponse: {0}',
            response.errorMessage
        );
        return JSON.parse(response.errorMessage);
    }

    return JSON.parse(response.object.text);
}

/**
 * @param {dw.order.Order} order - customer order
 * @returns {Object} result
 */
function create(order) {
    var body = new Payment(order);
    var result = paymentEndpoints.create(body);

    if (!result.ok) {
        var Logger = require('dw/system/Logger');
        Logger.error(
            'Error in payment creation. \nResponse: {0}',
            result.errorMessage
        );
        return JSON.parse(result.errorMessage);
    }

    return JSON.parse(result.object.text);
}

/**
 * @param {dw.order.Order} order - customer order
 * @param {Object} payment - mercado pago api payment response
 * @returns {undefined}
 */
function saveData(order, payment) {
    var Transaction = require('dw/system/Transaction');
    var constants = require('../modules/constants');
    var Order = require('dw/order/Order');

    var paymentInstrument = order.getPaymentInstruments(
        constants.METHOD.REDIRECT
    )[0];

    var customerPayment = payment;

    var paymentStatus =
        customerPayment.status === 'approved'
            ? Order.PAYMENT_STATUS_PAID
            : Order.PAYMENT_STATUS_NOTPAID;

    delete customerPayment.items;

    Transaction.wrap(function () {
        paymentInstrument.custom.MercadoPago_Details = JSON.stringify(
            payment,
            null,
            2
        );
        order.setPaymentStatus(paymentStatus);
    });
}

module.exports = {
    get: get,
    create: create,
    saveData: saveData
};
