'use strict';

var MercadoPago = require('*/cartridge/scripts/payment/mercadopago/index');

module.exports = {
    /**
     * @param {dw.order.Basket} basket - basket to be handled
     * @param {Object} paymentInfo - info retrived by form_processor
     * @returns {Object} { fieldErrors, serverErrors, error }
     */
    Handle: function (basket, paymentInfo) {
        var Transaction = require('dw/system/Transaction');
        var Resource = require('dw/web/Resource');
        var collections = require('*/cartridge/scripts/util/collections');
        var currentBasket = basket;

        if (!paymentInfo.cardToken) {
            return {
                error: true,
                fieldErrors: [],
                serverErrors: [
                    Resource.msg('missing.card.token', 'mercadopago', null)
                ]
            };
        }

        Transaction.wrap(function () {
            collections.forEach(
                currentBasket.getPaymentInstruments(),
                function (item) {
                    currentBasket.removePaymentInstrument(item);
                }
            );

            var paymentInstrument = currentBasket.createPaymentInstrument(
                MercadoPago.constants.METHOD.CARD,
                currentBasket.totalGrossPrice
            );

            paymentInstrument.setCreditCardNumber(paymentInfo.cardNumber);
            paymentInstrument.setCreditCardType(paymentInfo.cardType);

            paymentInstrument.setCreditCardExpirationMonth(
                paymentInfo.expirationMonth
            );
            paymentInstrument.setCreditCardExpirationYear(
                paymentInfo.expirationYear
            );
            paymentInstrument.setCreditCardToken(paymentInfo.cardToken);
        });

        return { fieldErrors: {}, serverErrors: {}, error: false };
    },
    Authorize: function (orderNumber, paymentInstrument, paymentProcessor) {
        var Transaction = require('dw/system/Transaction');
        var OrderMgr = require('dw/order/OrderMgr');

        var orderPaymentInstrument = paymentInstrument;
        var order = OrderMgr.getOrder(orderNumber);
        var merchantOrder = MercadoPago.order.create(order);

        if (merchantOrder.error) {
            return { error: true };
        }

        Transaction.wrap(function () {
            orderPaymentInstrument.paymentTransaction.setTransactionID(orderNumber);
            orderPaymentInstrument.paymentTransaction.setPaymentProcessor(
                paymentProcessor
            );
            order.custom.MercadoPago_OrderID = merchantOrder.id;
        });

        var payment = MercadoPago.payment.create(order);

        if (payment.error || payment.status === 'rejected') {
            return { error: true };
        }

        if (payment.status === 'approved') {
            order.setPaymentStatus(order.PAYMENT_STATUS_PAID);
        }

        delete payment.items;

        orderPaymentInstrument.custom.MercadoPago_Details = JSON.stringify(
            payment,
            null,
            2
        );

        return { error: false };
    }
};
