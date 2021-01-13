'use strict';

var endpoints = require('./endpoints');

/**
 * @param {dw.order.Order} order - order to be based upon
 * @returns {Object} response
 */
function create(order) {
    var URLUtils = require('dw/web/URLUtils');

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

    var body = {
        items: lineItems,
        back_urls: {
            success: URLUtils.https('MercadoPago-Reentry').toString(),
            pending: URLUtils.https('MercadoPago-Reentry').toString(),
            failure: URLUtils.https('MercadoPago-Reentry').toString()
        },
        auto_return: 'approved',
        notification_url: URLUtils.url('MercadoPago-Notify').toString()
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
