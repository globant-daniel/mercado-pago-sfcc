'use strict';

var System = require('dw/system/System');
var Site = require('dw/system/Site');

/**
 * @param {string} sitePref Site Preference Id
 * @returns {any} - the preference value
 */
function getCustomPreference(sitePref) {
    return Site.getCurrent().getCustomPreferenceValue(sitePref);
}

var IS_PRODUCTION = System.getInstanceType() === System.PRODUCTION_SYSTEM;

module.exports = {
    api: {
        ACCESS_TOKEN: IS_PRODUCTION
            ? getCustomPreference('MercadoPago_PRODTOKEN')
            : getCustomPreference('MercadoPago_DEVTOKEN')
    },
    installments: {
        ENABLED: getCustomPreference('MercadoPago_EnableInstallments'),
        MIN_VALUE: getCustomPreference('MercadoPago_InstallmentMinValue'),
        MAX_QTY: getCustomPreference('MercadoPago_MaxInstallments')
    }
};
