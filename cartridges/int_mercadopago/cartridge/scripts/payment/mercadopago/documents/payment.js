'use strict';

/**
 * @class
 * @param {dw.order.Order} order - customer order
 */
function Payment(order) {
    var Resource = require('dw/web/Resource');
    var Site = require('dw/system/Site');
    var Items = require('./items');
    var preferences = require('*/cartridge/config/preferences');
    var constants = require('../modules/constants');

    this.payer = {
        id: order.customerNo,
        first_name: order.billingAddress.firstName,
        last_name: order.billingAddress.lastName,
        email: order.customerEmail,
        identification: preferences.getCustomerIdentification(order)
    };
    // this.order = {
    //     type: 'mercadopago',
    //     id: order.custom.MercadoPago_OrderID
    // };
    this.external_reference = order.orderNo;
    this.description = Resource.msgf(
        'payment.description',
        'mercadopago',
        null,
        Site.getCurrent().name
    );
    this.transaction_amount = order.totalGrossPrice.value;
    this.binary_mode = false;

    var paymentInstrument = order.getPaymentInstruments(
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
    this.additional_info = {
        items: new Items(order, true)
    };
}

module.exports = Payment;
