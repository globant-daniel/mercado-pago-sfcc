'use strict';

module.exports = {
    /**
     * @param {dw.order.Basket} basket - basket to be handled
     * @returns {Object} { fieldErrors, serverErrors, error }
     */
    Handle: function (basket) {
        var MercadoPago = require('*/cartridge/scripts/payment/mercadopago/index');
        var Transaction = require('dw/system/Transaction');
        Transaction.wrap(function () {
            basket
                .getPaymentInstruments()
                .toArray()
                .forEach(function (paymentInstrument) {
                    basket.removePaymentInstrument(paymentInstrument);
                });

            basket.createPaymentInstrument(
                MercadoPago.constants.METHOD.REDIRECT,
                basket.getTotalGrossPrice()
            );
        });

        return { fieldErrors: [], serverErrors: [], error: false };
    },
    Authorize: function () {}
};
