'use strict';

var endpoints = require('./endpoints');
var Preference = require('documents/preference');

/**
 * @param {dw.order.Order} order - order to be based upon
 * @returns {Object} response
 */
function create(order) {
    var body = new Preference(order);

    var result = endpoints.preference.create(body);

    if (!result.ok) {
        var Logger = require('dw/system/Logger');
        Logger.error(
            'Error on preference creation. \nResponse: {0}',
            result.errorMessage
        );
        return JSON.parse(result.errorMessage);
    }

    return JSON.parse(result.object.text);
}

module.exports = {
    create: create
};
