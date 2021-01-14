'use strict';

var endpoints = require('./endpoints');

/**
 * @param {string} paymentId mercado pago api payment ID
 * @returns {Object} mercado pago api response
 */
function get(paymentId) {
    var response = endpoints.getPayment(paymentId);
    if (!response.ok) {
        var Logger = require('dw/system/Logger');
        Logger.error(
            'Error on get payment. \nResponse: {0}',
            response.errorMessage
        );
        return JSON.parse(response.errorMessage);
    }

    return JSON.parse(response.object.text);
}

// function create() {}

/**
 * @param {dw.order.Order} order - customer order
 * @param {Object} payment - mercado pago api payment response
 * @returns {undefined}
 */
function saveData(order, payment) {
    var Transaction = require('dw/system/Transaction');
    var Order = require('dw/order/Order');

    var paymentInstrument = order.getPaymentInstruments('MERCADO_PAGO')[0];

    var paymentStatus =
        payment.status === 'approved'
            ? Order.PAYMENT_STATUS_PAID
            : Order.PAYMENT_STATUS_NOTPAID;

    Transaction.wrap(function () {
        paymentInstrument.custom.MercadoPago_Details = JSON.stringify(payment);
        order.setPaymentStatus(paymentStatus);
    });
}

module.exports = {
    get: get,
    // create: create,
    saveData: saveData
};
