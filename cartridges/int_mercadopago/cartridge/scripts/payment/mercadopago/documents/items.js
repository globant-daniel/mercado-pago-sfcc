'use strict';

/**
 * @class
 * @param {dw.order.Order} order - customer order
 * @param {boolean} includeCurrency - indicates if each item should
 * include the currency_id
 */
function Items(order, includeCurrency) {
    var Order = require('dw/order/Order');
    var collections = require('*/cartridge/scripts/util/collections');

    if (!(order instanceof Order)) {
        throw new TypeError('Parameter in Items document is not a Order');
    }

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

        if (includeCurrency) {
            result.currency_id =
                // BRL is hardcoded and should be removed for production
                'BRL' || lineItem.adjustedGrossPrice.getCurrencyCode();
        }

        return result;
    });
}

module.exports = Items;
