'use strict';

var endpoints = require('./endpoints');

/**
 * @param {dw.order.Order} order - order to be based upon
 * @returns {Object} response
 */
function create(order) {
    var URLUtils = require('dw/web/URLUtils');
    var Site = require('dw/system/Site');

    var lineItems = order.getProductLineItems().toArray();

    lineItems = lineItems.map(function (lineItem) {
        var productImage = lineItem.product.getImage('large');
        var imageUrl = productImage && productImage.httpsURL.toString();

        return {
            id: lineItem.productID,
            title: lineItem.productName,
            currency_id: 'BRL' || lineItem.adjustedGrossPrice.getCurrencyCode(),
            picture_url: imageUrl,
            quantity: lineItem.quantityValue,
            unit_price: lineItem.adjustedGrossPrice.getValue()
        };
    });

    var customerName = order.customerName.split(' ');
    var marketplace = Site.getCurrent().name;
    var returnUrl = URLUtils.https(
        'Order-Confirm',
        'ID',
        order.orderNo,
        'token',
        order.orderToken
    ).toString();

    var body = {
        payer: {
            name: customerName[0],
            surname: customerName[1],
            email: order.customerEmail
        },
        items: lineItems,
        back_urls: {
            success: returnUrl,
            pending: returnUrl,
            failure: returnUrl // it may not be appropriate, needs recheck in the future
        },
        marketplace: marketplace,
        external_reference: order.orderNo,
        auto_return: 'approved',
        notification_url: URLUtils.https('MercadoPago-Notify').toString()
    };

    var result = endpoints.createPreference(body);

    if (!result.ok) {
        var Logger = require('dw/system/Logger');
        Logger.error(
            'Error on preference creation. \nResponse: {0}',
            result.errorMessage
        );
        return JSON.parse(result.errorMessage);
    }

    return JSON.parse(result.object.text);
}

module.exports = {
    create: create
};
