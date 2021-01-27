'use strict';

var server = require('server');
var base = module.superModule;

server.extend(base);

server.prepend('PlaceOrder', function (req, res, next) {
    var Transaction = require('dw/system/Transaction');
    var OrderMgr = require('dw/order/OrderMgr');
    var URLUtils = require('dw/web/URLUtils');
    var Resource = require('dw/web/Resource');
    var currentBasket = require('dw/order/BasketMgr').getCurrentBasket();
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
    var MercadoPago = require('*/cartridge/scripts/payment/mercadopago/index');

    /**
     * @param {dw.order.Basket} basket target
     * @returns {boolean} true if mercado pago is being used
     */
    function hasMercadoPagoRedirectPayment(basket) {
        var result = false;
        basket.paymentInstruments
            .toArray()
            .forEach(function (paymentInstrument) {
                if (
                    paymentInstrument.paymentMethod ===
                    MercadoPago.constants.METHOD.REDIRECT
                ) {
                    result = true;
                }
            });
        return result;
    }

    if (!currentBasket) {
        res.json({
            error: true,
            cartError: true,
            fieldErrors: [],
            serverErrors: [],
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });
        return next();
    }

    var hasMercadoPagoRedirect = hasMercadoPagoRedirectPayment(currentBasket);

    if (!hasMercadoPagoRedirect) {
        return next();
    }

    var order = COHelpers.createOrder(currentBasket);
    if (!order) {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.technical', 'checkout', null)
        });
        this.emit('route:Complete', req, res);
    }

    var fraudDetectionStatus = hooksHelper(
        'app.fraud.detection',
        'fraudDetection',
        currentBasket,
        require('*/cartridge/scripts/hooks/fraudDetection').fraudDetection
    );

    if (fraudDetectionStatus.status === 'fail') {
        Transaction.wrap(function () {
            OrderMgr.failOrder(order, true);
        });
        req.session.privacyCache.set('fraudDetectionStatus', true);
        res.json({
            error: true,
            cartError: true,
            redirectUrl: URLUtils.url(
                'Error-ErrorCode',
                'err',
                fraudDetectionStatus.errorCode
            ).toString(),
            errorMessage: Resource.msg('error.technical', 'checkout', null)
        });
        this.emit('route:Complete', req, res);
    }

    var System = require('dw/system/System');
    var IS_PRODUCTION = System.getInstanceType() === System.PRODUCTION_SYSTEM;

    var preference = MercadoPago.preference.create(order);

    if (order.getCustomerEmail()) {
        COHelpers.sendConfirmationEmail(order, req.locale.id);
    }

    res.json({
        error: false,
        continueUrl: IS_PRODUCTION
            ? preference.init_point
            : preference.sandbox_init_point
    });
    this.emit('route:Complete', req, res);
    return; // eslint-disable-line
});

module.exports = server.exports();
