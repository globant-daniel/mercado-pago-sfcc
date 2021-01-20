'use strict';

/**
 * @class
 * @param {dw.order.Order} order - customer order
 */
function Payment(order) {
    var Order = require('dw/order/Order');
    var URLUtils = require('dw/web/URLUtils');
    var Resource = require('dw/web/Resource');
    var Site = require('dw/system/Site');
    var Items = require('./items');
    var preferences = require('*/cartridge/config/preferences');

    var constants = require('../modules/constants');

    if (!(order instanceof Order)) {
        throw new TypeError('Parameter in Payment document is not a Order');
    }

    var isAuthenticated = order.customer.isAuthenticated();

    this.payer = {
        id: order.customerNo,
        type: isAuthenticated ? 'customer' : 'guest',
        first_name: order.billingAddress.firstName,
        last_name: order.billingAddress.lastName,
        email: order.customerEmail,
        identification: preferences.getCustomerIdentification(order)
    };
    this.order = {
        type: 'mercadopago',
        id: order.custom.MercadoPago_OrderID
    };
    this.external_reference = order.orderNo;
    this.description = Resource.msgf(
        'payment.description',
        'mercadopago',
        null,
        Site.getCurrent().name
    );
    this.transaction_amount = order.totalGrossPrice.value;
    this.binary_mode = false;

    var paymentInstrument = order.getPaymentInstrumens(
        constants.METHOD.CARD
    )[0];

    this.payment_method_id = paymentInstrument.creditCardType;
    this.token = paymentInstrument.creditCardToken;
    this.statement_descriptor = Resource.msgf(
        'payment.statement_descriptor',
        'mercadopago',
        null,
        Site.getCurrent().name
    );
    this.installments = paymentInstrument.custom.MercadoPago_Installments;
    this.notification_url = URLUtils.https('MercadoPago-Notify');
    this.additional_info = {
        items: new Items(order, false)
    };
}

module.exports = Payment;
