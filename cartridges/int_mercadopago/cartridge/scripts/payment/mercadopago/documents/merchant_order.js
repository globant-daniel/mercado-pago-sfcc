'use strict';

/**
 * @class
 * @param {dw.order.Order} order - customer order
 */
function MerchantOrder(order) {
    var Items = require('../documents/items');


    // The follwing commented propeties are causing an error
    // from the Mercado Pago API: "Error when calling GetSite"
    // and why it happens.

    // this.site_id = Site.getCurrent().getCustomPreferenceValue('countryCode').value;

    // this.marketplace = Resource.msgf(
    //     'payment.statement_descriptor',
    //     'mercadopago',
    //     null,
    //     Site.getCurrent().name
    // );

    this.preference_id = order.custom.MercadoPago_PreferenceID;
    this.items = new Items(order);
    this.external_reference = order.orderNo;
}

module.exports = MerchantOrder;
