'use strict';

var base = module.superModule;

/**
 * Payment class that represents payment information for the current basket
 * @param {dw.order.Basket} currentBasket - the target Basket object
 * @param {dw.customer.Customer} currentCustomer - the associated Customer object
 * @param {string} countryCode - the associated Site countryCode
 * @constructor
 */
function Payment(currentBasket, currentCustomer, countryCode) {
    base.call(this, currentBasket, currentCustomer, countryCode);

    var MercadoPago = require('*/cartridge/scripts/payment/mercadopago/index');

    if (currentBasket && MercadoPago.configuration.installments.ENABLED) {
        var find = require('*/cartridge/scripts/util/array').find;

        var mpPaymentMethod = find(
            this.applicablePaymentMethods || [],
            function (paymentMethod) {
                return paymentMethod.ID === MercadoPago.constants.METHOD.CARD;
            }
        );

        if (mpPaymentMethod) {
            mpPaymentMethod.installments = MercadoPago.utils.generateInstallments(
                currentBasket.adjustedMerchandizeTotalGrossPrice
            );
        }
    }
}

module.exports = Payment;
