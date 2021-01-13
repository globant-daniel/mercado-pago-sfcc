'use strict';

module.exports = {
    /**
     * @param {dw.order.Basket} basket - basket to be handled
     * @returns {Object} { fieldErrors, serverErrors, error }
     */
    Handle: function (basket) {
        var Transaction = require('dw/system/Transaction');
        Transaction.wrap(function () {
            basket
                .getPaymentInstruments()
                .toArray()
                .forEach(function (paymentInstrument) {
                    basket.removePaymentInstrument(paymentInstrument);
                });

            basket.createPaymentInstrument(
                'MERCADO_PAGO',
                basket.getTotalGrossPrice()
            );
        });

        return { fieldErrors: [], serverErrors: [], error: false };
    },
    Authorize: function () {}
};
