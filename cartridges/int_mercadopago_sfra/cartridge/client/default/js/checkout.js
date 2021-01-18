var baseCheckout = require('base/checkout/checkout');
var MercadoPago = require('./checkout/MercadoPago');
var processInclude = require('base/util');

$(document).ready(function () { // eslint-disable-line
    processInclude(baseCheckout);
    processInclude(MercadoPago);
});
