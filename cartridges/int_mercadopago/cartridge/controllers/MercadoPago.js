'use strict';

var server = require('server');

server.post('Notify', function (req, res, next) {
    var MercadoPago = require('*/cartridge/scripts/payment/mercadopago/index');
    var Logger = require('dw/system/Logger');
    var OrderMgr = require('dw/order/OrderMgr');

    var body = JSON.parse(req.body || '{}');
    var paymentId = body.data && body.data.id;

    if (!paymentId) {
        return next();
    }

    var payment = MercadoPago.payment.get(paymentId);
    var orderNo = payment.external_reference;
    var order = OrderMgr.getOrder(orderNo);

    if (!order) {
        Logger.error(
            'External reference sent to MercadoPago-Notify was not a existent order.\nBody: {0}',
            JSON.stringify(body, null, 2)
        );
        return next();
    }

    try {
        MercadoPago.payment.saveData(order, payment);
    } catch (e) {
        Logger.error(
            'Error saving the MercadoPago data on order of ID {0}.\nBody: {1}',
            JSON.stringify(body, null, 2)
        );
    }
    return next();
});

module.exports = server.exports();
