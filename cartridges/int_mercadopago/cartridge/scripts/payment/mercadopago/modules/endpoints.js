'use strict';

/**
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

            svc.addHeader('Authorization', 'Bearer ' + configuration.ACCESS_TOKEN);

            return JSON.stringify(args.body || {});
        },
        parseResponse: function (svc, response) {
            return response;
        }
    });
}

module.exports = {
    /**
     * @param {Object} body - request body
     * @returns {dw.svc.Result} request response
     */
    createPreference: function (body) {
        var service = createService();
        return service.call({
            path: '/checkout/preferences',
            method: 'POST',
            body: body
        });
    },
    getPayment: function (paymentId) {
        var service = createService();
        return service.call({
            path: '/v1/payments/' + paymentId
        });
    }
};
