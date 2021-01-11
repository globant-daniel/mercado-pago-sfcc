'use strict';

/**
 * @returns {dw.svc.HTTPService} MercadoPagoAPI service
 */
function createService() {
    var configuration = require('./configuration');
    var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

    return LocalServiceRegistry.createService('MercadoPagoAPI', {
        createRequest: function (svc, args) {
            svc.setRequestMethod(args.method);
            svc.addHeader('Content-type', 'application/json');
            svc.addHeader('charset', 'UTF-8');

            svc.setURL(svc.url + (args.path || ''));

            if (args.headers && typeof args.headers === 'object') {
                Object.keys(args.headers).forEach(function (headerName) {
                    svc.addHeader(headerName, args.headers[headerName]);
                });
            }

            svc.addParam('access_token', configuration.ACCESS_TOKEN);

            return args.body || {};
        },
        parseResponse: function (svc, response) {
            try {
                return JSON.parse(response.object.text);
            } catch (_) {
                return null;
            }
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });
}

module.exports = {
    createPreference: function (body) {
        var service = createService();
        return service.call({
            path: '/checkout/preferences',
            method: 'GET',
            body: body
        });
    }
};
