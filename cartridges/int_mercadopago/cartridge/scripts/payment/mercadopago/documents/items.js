'use strict';

/**
 * @class
 * @param {dw.order.Order} order - customer order
 * @param {boolean} noCurrencyCode - indicates if each item should
 * not include the currency_id
 */
function Items(order, noCurrencyCode) {
    var collections = require('*/cartridge/scripts/util/collections');

    return collections.map(order.getProductLineItems(), function (lineItem) {
        var productImage = lineItem.product.getImage('large');
        var imageUrl = productImage && productImage.httpsURL.toString();

        var result = {
            id: lineItem.productID,
            title: lineItem.productName,
            description: lineItem.product.shortDescription.getSource(),
            picture_url: imageUrl,
            quantity: lineItem.quantityValue,
            unit_price: lineItem.adjustedGrossPrice.getValue()
        };

        if (!noCurrencyCode) {
            result.currency_id =
                // BRL is hardcoded and should be removed for production
                'BRL' || lineItem.adjustedGrossPrice.getCurrencyCode();
        }

        return result;
    });
}

module.exports = Items;
