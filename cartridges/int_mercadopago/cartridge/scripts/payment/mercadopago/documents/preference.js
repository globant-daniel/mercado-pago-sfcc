'use strict';

/**
 * Preference document
 * @class
 * @param {dw.order.Order} order customer order
 */
function Preference(order) {
    var Order = require('dw/order/Order');
    var URLUtils = require('dw/web/URLUtils');
    var Site = require('dw/system/Site');
    var Items = require('./items');

    if (!(order instanceof Order)) {
        throw new TypeError('Parameter in Preference document is not a Order');
    }

    this.external_reference = order.orderNo;

    this.items = new Items(order);

    this.payer = {
        name: order.billingAddress.firstName,
        surname: order.billingAddress.lastName,
        customerEmail: order.customerEmail
    };

    var siteName = Site.getCurrent().name;
    this.marketplace = siteName;

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
    this.notification_url = URLUtils.https('MercadoPago-Notify').toString();
}

module.exports = Preference;
