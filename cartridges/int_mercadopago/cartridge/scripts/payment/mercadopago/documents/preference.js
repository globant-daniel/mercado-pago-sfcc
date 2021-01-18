/**
 * Preference document
 * @class
 * @param {dw.order.Order} order customer order
 */
function Preference(order) {
    var Order = require('dw/order/Order');
    var URLUtils = require('dw/web/URLUtils');
    var Site = require('dw/system/Site');

    if (!(order instanceof Order)) {
        throw new TypeError('Parameter in Preference document is not a Order');
    }

    this.external_reference = order.orderNo;

    var lineItems = order
        .getProductLineItems()
        .toArray()
        .map(function (lineItem) {
            var productImage = lineItem.product.getImage('large');
            var imageUrl = productImage && productImage.httpsURL.toString();

            return {
                id: lineItem.productID,
                title: lineItem.productName,
                currency_id:
                    // BRL is hardcoded and should be removed for production
                    'BRL' || lineItem.adjustedGrossPrice.getCurrencyCode(),
                picture_url: imageUrl,
                quantity: lineItem.quantityValue,
                unit_price: lineItem.adjustedGrossPrice.getValue()
            };
        });

    this.items = lineItems;

    var customerName = order.customerName.split(' ');
    var customerEmail = order.customerEmail;

    this.payer = {
        name: customerName[0],
        customerEmail: customerEmail
    };

    if (customerName[1]) {
        this.payer.surname = customerName[1];
    }

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
