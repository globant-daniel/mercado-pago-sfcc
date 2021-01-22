'use strict';

module.exports = {
    /**
     * @param {dw.order.Basket} basket - basket to be handled
     * @param {Object} paymentInfo - info retrived by form_processor
     * @returns {Object} { fieldErrors, serverErrors, error }
     */
    Handle: function (basket, paymentInfo) {
        var MercadoPago = require('*/cartridge/scripts/payment/mercadopago/index');
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

            paymentInstrument.custom.MercadoPago_Installments =
                paymentInfo.installments;
        });

        return { fieldErrors: {}, serverErrors: {}, error: false };
    },
    Authorize: function (orderNumber, paymentInstrument, paymentProcessor) {
        var Transaction = require('dw/system/Transaction');
        var OrderMgr = require('dw/order/OrderMgr');
        var MercadoPago = require('*/cartridge/scripts/payment/mercadopago/index');

        var order = OrderMgr.getOrder(orderNumber);
        var orderPaymentInstrument = paymentInstrument;
        var result = { error: true };

        Transaction.wrap(function () {
            orderPaymentInstrument.paymentTransaction.setTransactionID(
                orderNumber
            );
            orderPaymentInstrument.paymentTransaction.setPaymentProcessor(
                paymentProcessor
            );
        });

        // var preference = MercadoPago.preference.create(order);

        // if (preference.error) {
        //     return result;
        // }

        // Transaction.wrap(function () {
        //     order.custom.MercadoPago_PreferenceID = preference.id;
        // });

        // var merchantOrder = MercadoPago.order.create(order);

        // if (merchantOrder.error) {
        //     return result;
        // }

        // Transaction.wrap(function () {
        //     order.custom.MercadoPago_OrderID = merchantOrder.id;
        // });

        var payment = MercadoPago.payment.create(order);

        if (payment.error || payment.status === 'rejected') {
            return result;
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

        result.error = false;
        return result;
    }
};
