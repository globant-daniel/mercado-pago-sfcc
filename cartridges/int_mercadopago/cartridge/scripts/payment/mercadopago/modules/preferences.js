'use strict';

var endpoints = require('./endpoints');

/**
 * @param {dw.order.LineItemCtnr} lineItemCtnr - container to be based upon
 * @returns {Object} response
 */
function create(lineItemCtnr) {
    var lineItems = lineItemCtnr.getProductLineItems().toArray();
    lineItems = lineItems.map(function (lineItem) {
        var productImage = lineItem.product.getImage('large');
        var imageUrl = productImage && productImage.httpsURL;

        return {
            id: lineItem.productID,
            title: lineItem.productName,
            currency_id: lineItem.adjustedGrossPrice.getCurrencyCode(),
            picture_url: imageUrl,
            quantity: lineItem.quantityValue,
            unit_price: lineItem.adjustedGrossPrice.getValue()
        };
    });

    var body = {
        items: lineItems
    };
    var result = endpoints.createPreference(body);

    if (!result) {
        var Logger = require('dw/system/Logger');
        Logger.error(
            'Error on preference creation. \nBody: {0}',
            JSON.stringify(body, null, 2)
        );
        return {};
    }

    return result;
}

module.exports = {
    create: create
};
