'use strict';

/**
 * Preference document
 * @class
 * @param {dw.order.Order} order customer order
 */
function Preference(order) {
    var URLUtils = require('dw/web/URLUtils');
    var Site = require('dw/system/Site');
    var Items = require('./items');
    var Resource = require('dw/web/Resource');

    this.external_reference = order.orderNo;
    this.items = new Items(order);
    this.payer = {
        name: order.billingAddress.firstName,
        surname: order.billingAddress.lastName,
        customerEmail: order.customerEmail
    };
    this.marketplace = Resource.msgf(
        'payment.statement_descriptor',
        'mercadopago',
        null,
        Site.getCurrent().name
    );

    var returnUrl = URLUtils.https(
        'Order-Confirm',
        'ID',
        order.orderNo,
        'token',
        order.orderToken
    ).toString();

    this.back_urls = {
        success: returnUrl,
        pending: returnUrl,
        failure: returnUrl // TODO: it may not be appropriate, needs recheck in the future
    };
    this.auto_return = 'approved';
}

module.exports = Preference;
