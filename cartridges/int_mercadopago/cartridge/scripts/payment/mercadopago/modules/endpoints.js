'use strict';

/*eslint-disable */
var Preference = require('../documents/preference');
var Payment = require('../documents/payment');
var MerchantOrder = require('../documents/merchant_order');
/*eslint-enable */

/**
 * Creates a general-purpose {} with the Mercado Pago API URL.
 * @returns {dw.svc.HTTPService} MercadoPagoAPI service
 */
function createService() {
    var configuration = require('./configuration');
    var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

    return LocalServiceRegistry.createService('MercadoPagoAPI', {
        createRequest: function (svc, args) {
            svc.setRequestMethod(args.method || 'GET');
            svc.addHeader('Content-type', 'application/json');
            svc.addHeader('charset', 'UTF-8');

            svc.setURL(svc.URL + (args.path || ''));

            if (args.headers && typeof args.headers === 'object') {
                Object.keys(args.headers).forEach(function (headerName) {
                    svc.addHeader(headerName, args.headers[headerName]);
                });
            }

            svc.addHeader(
                'Authorization',
                'Bearer ' + configuration.api.ACCESS_TOKEN
            );

            return JSON.stringify(args.body || {});
        },
        parseResponse: function (svc, response) {
            return response;
        }
    });
}

var preference = {
    /**
     * Creates a Preference in the Mercado Pago API
     * @param {Preference} document - preference document
     * @returns {dw.svc.Result} request response
     */
    create: function (document) {
        var service = createService();
        return service.call({
            path: '/checkout/preferences',
            method: 'POST',
            body: document
        });
    }
};

var order = {
    /**
     * Retrives a Merchant Order in the Mercado Pago API
     * @param {string} orderId - Merchant Order ID
     * @returns {dw.svc.Result} request response
     */
    get: function (orderId) {
        var service = createService();
        return service.call({
            path: '/merchant_orders/' + orderId
        });
    },
    /**
     * Creates a Merchant Order in the Mercado Pago API
     * @param {MerchantOrder} document - merchant_order document
     * @returns {dw.svc.Result} request response
     */
    create: function (document) {
        var service = createService();
        return service.call({
            path: '/merchant_orders',
            method: 'POST',
            body: document
        });
    }
};

var payment = {
    /**
     * Retrives a payment via API call to Mercado Pago API
     * @param {string} paymentId mercado pago payment ID
     * @returns {dw.svc.Result} response result
     */
    get: function (paymentId) {
        var service = createService();
        return service.call({
            path: '/v1/payments/' + paymentId
        });
    },
    /**
     * Creates a payment in the Mercado Pago API
     * @param {Payment} document payment document
     * @returns {dw.svc.Result} response result
     */
    create: function (document) {
        var service = createService();
        return service.call({
            method: 'POST',
            path: '/v1/payments',
            body: document
        });
    }
};

module.exports = {
    payment: payment,
    order: order,
    preference: preference
};
