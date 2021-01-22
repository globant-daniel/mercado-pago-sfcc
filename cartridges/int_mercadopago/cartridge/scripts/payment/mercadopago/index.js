'use strict';

/**
 * @param {string} path relative to mercadopago folder
 * @returns {any} - exports of the specified file
 */
function importScript(path) {
    try {
        return require('*/cartridge/scripts/payment/mercadopago/' + path);
    } catch (_) {
        return {};
    }
}

/**
 * @class
 */
function MercadoPago() {}

MercadoPago.payment = importScript('modules/payment');
MercadoPago.constants = importScript('modules/constants');
MercadoPago.configuration = importScript('modules/configuration');
MercadoPago.preference = importScript('modules/preference');
MercadoPago.order = importScript('modules/order');

module.exports = MercadoPago;

